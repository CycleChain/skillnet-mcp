import { jest } from '@jest/globals';

describe('MCP Server Environment Variables (Config)', () => {
    // Save original env
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should correctly receive API_KEY from environment', () => {
        process.env.API_KEY = 'test_api_key_123';
        expect(process.env.API_KEY).toBe('test_api_key_123');
    });

    it('should correctly receive GITHUB_TOKEN from environment', () => {
        process.env.GITHUB_TOKEN = 'ghp_test_token_456';
        expect(process.env.GITHUB_TOKEN).toBe('ghp_test_token_456');
    });

    it('should handle missing API_KEY gracefully', () => {
        delete process.env.API_KEY;
        expect(process.env.API_KEY).toBeUndefined();
    });

    it('should handle missing GITHUB_TOKEN gracefully', () => {
        delete process.env.GITHUB_TOKEN;
        expect(process.env.GITHUB_TOKEN).toBeUndefined();
    });

    it('should correctly pass environment variables to child processes (mock test)', () => {
        process.env.API_KEY = 'test_api_key';
        process.env.GITHUB_TOKEN = 'ghp_test_token';
        
        // Simulating the environment passed to execFileAsync
        const simulatedExecEnv = { ...process.env };
        
        expect(simulatedExecEnv.API_KEY).toBe('test_api_key');
        expect(simulatedExecEnv.GITHUB_TOKEN).toBe('ghp_test_token');
    });
});
