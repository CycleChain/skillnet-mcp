import { jest } from '@jest/globals';
import { buildCommand } from '../index.js';

describe('SkillNet MCP Command Builder', () => {
    it('should build search_skills command', () => {
        const cmd1 = buildCommand('search_skills', { q: 'pdf' });
        expect(cmd1).toEqual(['search', 'pdf']);

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
        expect(cmd2).toEqual(['search', 'pdf', '--mode', 'vector', '--limit', '10', '--category', 'Development', '--sort-by', 'stars', '--page', '2', '--min-stars', '4', '--threshold', '0.85']);
    });

    it('should build download_skill command', () => {
        const cmd = buildCommand('download_skill', { url: 'https://github.com/abc', target_dir: './skills' });
        expect(cmd).toEqual(['download', 'https://github.com/abc', '-d', './skills']);
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
        const cmdSave = buildCommand('analyze_skills', { skills_dir: './skills', save: true, model: 'gpt-3.5-turbo' });
        expect(cmdSave).toEqual(['analyze', './skills', '--save', '--model', 'gpt-3.5-turbo']);

        const cmdNoSave = buildCommand('analyze_skills', { skills_dir: './skills', save: false });
        expect(cmdNoSave).toEqual(['analyze', './skills', '--no-save']);
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
