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
            sort_by: 'stars'
        });
        expect(cmd2).toEqual(['search', 'pdf', '--mode', 'vector', '--limit', '10', '--category', 'Development', '--sort-by', 'stars']);
    });

    it('should build download_skill command', () => {
        const cmd = buildCommand('download_skill', { url: 'https://github.com/abc', target_dir: './skills' });
        expect(cmd).toEqual(['download', 'https://github.com/abc', '-d', './skills']);
    });

    it('should build create_skill command for different sources', () => {
        const cmdGithub = buildCommand('create_skill', { source_type: 'github', source: 'url', output_dir: './out' });
        expect(cmdGithub).toEqual(['create', '--github', 'url', '-d', './out']);

        const cmdOffice = buildCommand('create_skill', { source_type: 'office', source: 'file.pdf', model: 'gpt-4o' });
        expect(cmdOffice).toEqual(['create', '--office', 'file.pdf', '--model', 'gpt-4o']);

        const cmdTrajectory = buildCommand('create_skill', { source_type: 'trajectory', source: 'logs.txt' });
        expect(cmdTrajectory).toEqual(['create', 'logs.txt']);
    });

    it('should build evaluate_skill command', () => {
        const cmd = buildCommand('evaluate_skill', { target: './skills/web_search' });
        expect(cmd).toEqual(['evaluate', './skills/web_search']);
    });

    it('should build analyze_skills command', () => {
        const cmd = buildCommand('analyze_skills', { skills_dir: './skills' });
        expect(cmd).toEqual(['analyze', './skills']);
    });

    it('should throw on missing arguments', () => {
        expect(() => buildCommand('search_skills', null)).toThrow('Missing arguments');
    });

    it('should throw on unknown tool', () => {
        expect(() => buildCommand('unknown_tool', { a: 1 })).toThrow('Unknown tool: unknown_tool');
    });
});
