const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { installSuperpowersGlobal, SUPERPOWERS_SKILLS } = require('../cli/logic/superpowers-installer');

describe('Superpowers Global Installer', () => {
    it('should have 15 standard superpowers skills defined', () => {
        expect(SUPERPOWERS_SKILLS).toHaveLength(15);
        expect(SUPERPOWERS_SKILLS).toContain('using-superpowers');
        expect(SUPERPOWERS_SKILLS).toContain('brainstorming');
        expect(SUPERPOWERS_SKILLS).toContain('writing-plans');
        expect(SUPERPOWERS_SKILLS).toContain('executing-plans');
        expect(SUPERPOWERS_SKILLS).toContain('subagent-driven-development');
        expect(SUPERPOWERS_SKILLS).toContain('systematic-debugging');
        expect(SUPERPOWERS_SKILLS).toContain('test-driven-development');
        expect(SUPERPOWERS_SKILLS).toContain('verification-before-completion');
    });

    it('should successfully install superpowers skills globally', async () => {
        const result = await installSuperpowersGlobal({ silent: true });
        expect(result.success).toBe(true);
        expect(result.count).toBe(15);
        expect(result.installedSkills).toHaveLength(15);

        const globalSkillsDir = path.join(os.homedir(), '.gemini', 'config', 'skills');
        expect(fs.existsSync(globalSkillsDir)).toBe(true);

        // Verify each skill has SKILL.md
        for (const skill of SUPERPOWERS_SKILLS) {
            const skillMd = path.join(globalSkillsDir, skill, 'SKILL.md');
            expect(fs.existsSync(skillMd)).toBe(true);
            const content = fs.readFileSync(skillMd, 'utf-8');
            expect(content.length).toBeGreaterThan(50);
        }
    });
});
