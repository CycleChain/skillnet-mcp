import { jest } from '@jest/globals';
import { mkdtemp, mkdir, writeFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { buildCommand, parseCliJson, formatSearchResults, resolveSkillDir } from '../index.js';

describe('SkillNet MCP Command Builder', () => {
    it('should build search_skills command', () => {
        const cmd1 = buildCommand('search_skills', { q: 'pdf' });
        expect(cmd1).toEqual(['search', 'pdf', '--json']);

        const cmd2 = buildCommand('search_skills', {
            q: 'pdf',
            mode: 'vector',
            limit: 10,
            category: 'Development',
            sort_by: 'stars',
            page: 2,
            min_stars: 4,
            threshold: 0.85
        });
        expect(cmd2).toEqual(['search', 'pdf', '--mode', 'vector', '--limit', '10', '--category', 'Development', '--sort-by', 'stars', '--page', '2', '--min-stars', '4', '--threshold', '0.85', '--json']);
    });

    it('should build download_skill command', () => {
        const cmd = buildCommand('download_skill', { url: 'https://github.com/abc', target_dir: './skills' });
        expect(cmd).toEqual(['download', 'https://github.com/abc', '-d', './skills', '--json']);

        const cmdWithOpts = buildCommand('download_skill', { url: 'https://github.com/abc', target_dir: './skills', token: 'mytoken', mirror: 'https://ghfast.top/', overwrite: true });
        expect(cmdWithOpts).toEqual(['download', 'https://github.com/abc', '-d', './skills', '-m', 'https://ghfast.top/', '--overwrite', '--json']);
        expect(cmdWithOpts).not.toContain('mytoken');   // the token is passed as GITHUB_TOKEN
    });

    it('should build create_skill command for different sources', () => {
        const cmdGithub = buildCommand('create_skill', { source_type: 'github', source: 'url', output_dir: './out', max_files: 100 });
        expect(cmdGithub).toEqual(['create', '--github', 'url', '-d', './out', '--max-files', '100']);

        const cmdOffice = buildCommand('create_skill', { source_type: 'office', source: 'file.pdf', model: 'gpt-4o' });
        expect(cmdOffice).toEqual(['create', '--office', 'file.pdf', '--model', 'gpt-4o']);

        const cmdTrajectory = buildCommand('create_skill', { source_type: 'trajectory', source: 'logs.txt' });
        expect(cmdTrajectory).toEqual(['create', 'logs.txt']);
    });

    it('should build evaluate_skill command', () => {
        const cmd = buildCommand('evaluate_skill', { 
            target: './skills/web_search',
            name: 'WebSearcher',
            category: 'Data',
            description: 'Searches the web',
            model: 'gpt-4',
            max_workers: 10
        });
        expect(cmd).toEqual(['evaluate', './skills/web_search', '--name', 'WebSearcher', '--category', 'Data', '--description', 'Searches the web', '--model', 'gpt-4', '--max-workers', '10']);
    });

    it('should build analyze_skills command', () => {
        const cmd = buildCommand('analyze_skills', { skills_dir: './skills', output_dir: './graph', force: true, model: 'gpt-4o' });
        expect(cmd).toEqual(['analyze', './skills', '--output-dir', './graph', '--force', '--model', 'gpt-4o']);

        // skillnet-ai 0.1 has no --save/--no-save; the old argument is ignored
        const legacy = buildCommand('analyze_skills', { skills_dir: './skills', save: true });
        expect(legacy).toEqual(['analyze', './skills']);
    });

    // --- NEGATİF (NON-EXPECT) VE HATA BEKLENEN (EXPECT ERROR) TESTLER ---

    it('should throw on missing arguments for search_skills', () => {
        expect(() => buildCommand('search_skills', null)).toThrow('Missing arguments');
    });

    it('should throw on missing arguments entirely', () => {
        expect(() => buildCommand('download_skill')).toThrow('Missing arguments');
    });

    it('should throw on explicitly unknown tools', () => {
        expect(() => buildCommand('non_existent_tool', { a: 1 })).toThrow('Unknown tool: non_existent_tool');
    });

    it('should throw out of bounds tools (health_check, get_skill_rules) since they are handled independently', () => {
        // These tools are handled directly by the MCP server handler, not CLI Builder
        expect(() => buildCommand('health_check', {})).toThrow('Unknown tool: health_check');
        expect(() => buildCommand('get_skill_rules', { topic: 'react' })).toThrow('Unknown tool: get_skill_rules');
        expect(() => buildCommand('import_best_skill', { topic: 'node' })).toThrow('Unknown tool: import_best_skill');
    });

    // --- POZİTİF (EXPECT) VE OPSİYONEL PARAMETRE TESTLERİ ---

    it('should parse skillnet --json envelopes', () => {
        expect(parseCliJson('{"ok": true, "data": {"path": "/x/y"}, "error": null}').data.path).toBe('/x/y');
        expect(parseCliJson('{"ok": false, "data": null, "error": {"message": "Destination exists"}}').error.message).toBe('Destination exists');
        expect(parseCliJson('╭─ table ─╮')).toBeNull();
        expect(parseCliJson('')).toBeNull();
    });

    it('should format search results for the agent', () => {
        const text = formatSearchResults([{ skill_name: 'pdf', skill_description: 'Read PDFs', stars: '12', category: 'Development', author: 'acme', skill_url: 'https://github.com/acme/skills/tree/main/pdf' }]);
        expect(text).toContain('1. pdf (12 stars, Development, acme)');
        expect(text).toContain('https://github.com/acme/skills/tree/main/pdf');
        expect(formatSearchResults([])).toBe('No skills found.');
    });

    it('should find the downloaded skill folder under the target directory', async () => {
        const root = await mkdtemp(join(tmpdir(), 'skillnet-mcp-'));
        try {
            await mkdir(join(root, 'nested', 'code-reviewer'), { recursive: true });
            await writeFile(join(root, 'nested', 'code-reviewer', 'SKILL.md'), '---\nname: code-reviewer\n---\n');
            expect(await resolveSkillDir(join(root, 'nested'))).toBe(join(root, 'nested', 'code-reviewer'));
            await writeFile(join(root, 'SKILL.md'), '---\nname: flat\n---\n');
            expect(await resolveSkillDir(root)).toBe(root);
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });

    it('should NOT include optional flags if not provided', () => {
        const cmd = buildCommand('search_skills', { q: 'react' });
        expect(cmd).not.toContain('--mode'); // explicitly checking negative logic (non expect)
        expect(cmd).not.toContain('--limit');
    });

    it('should correctly ignore unrecognized arguments in valid tools', () => {
        const cmd = buildCommand('evaluate_skill', { target: './dir', unsupported_flag: true });
        // It should build successfully but ignore 'unsupported_flag'
        expect(cmd).toEqual(['evaluate', './dir']);
        expect(cmd).not.toContain('unsupported_flag');
    });
});
