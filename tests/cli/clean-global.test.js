const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { cleanGlobalConfig } = require('../../cli/logic/clean-global');

describe('Clean Global Config', () => {
    const testGeminiRulesDir = path.join(os.homedir(), '.gemini', 'config', 'rules');

    it('should run cleanGlobalConfig safely without error', async () => {
        const result = await cleanGlobalConfig({ silent: true });
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(Array.isArray(result.removedFiles)).toBe(true);
    });

    it('should remove targeted dummy rules from ~/.gemini/config/rules if they exist', async () => {
        // Setup dummy file
        fs.ensureDirSync(testGeminiRulesDir);
        const dummyFile = path.join(testGeminiRulesDir, 'GEMINI.md');
        fs.writeFileSync(dummyFile, '# Dummy Test');

        expect(fs.existsSync(dummyFile)).toBe(true);

        const result = await cleanGlobalConfig({ silent: true });
        expect(result.success).toBe(true);
        expect(fs.existsSync(dummyFile)).toBe(false);
    });
});
