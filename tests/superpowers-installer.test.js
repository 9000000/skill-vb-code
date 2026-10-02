const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { 
    installSuperpowersToProject, 
    cleanSuperpowersGlobal, 
    installSuperpowersGlobal, 
    SUPERPOWERS_SKILLS 
} = require('../cli/logic/superpowers-installer');

describe('Superpowers Installer & Manager', () => {
    const testProjectDir = path.join(os.tmpdir(), 'antigravity-test-project-' + Date.now());

    afterAll(() => {
        try {
            fs.removeSync(testProjectDir);
        } catch (_) {}
    });

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
        expect(SUPERPOWERS_SKILLS).toContain('writing-skills');
        expect(SUPERPOWERS_SKILLS).toContain('using-git-worktrees');
    });

    it('should successfully install superpowers skills into an individual project directory', async () => {
        fs.ensureDirSync(testProjectDir);
        const result = await installSuperpowersToProject(testProjectDir, { silent: true });

        expect(result.success).toBe(true);
        expect(result.count).toBe(15);
        expect(result.installedSkills).toHaveLength(15);

        const projectAgentSkillsDir = path.join(testProjectDir, '.agent', 'skills');
        const projectAgentsSkillsDir = path.join(testProjectDir, '.agents');

        expect(fs.existsSync(projectAgentSkillsDir)).toBe(true);
        expect(fs.existsSync(projectAgentsSkillsDir)).toBe(false);

        // Verify each skill has SKILL.md in project directories
        for (const skill of SUPERPOWERS_SKILLS) {
            const skillMd = path.join(projectAgentSkillsDir, skill, 'SKILL.md');
            expect(fs.existsSync(skillMd)).toBe(true);
            const content = fs.readFileSync(skillMd, 'utf-8');
            expect(content.length).toBeGreaterThan(50);
        }
    });

    it('should clean up .agents directory if previously created', async () => {
        const dummyAgentsDir = path.join(testProjectDir, '.agents');
        fs.ensureDirSync(dummyAgentsDir);
        expect(fs.existsSync(dummyAgentsDir)).toBe(true);

        await installSuperpowersToProject(testProjectDir, { silent: true });
        expect(fs.existsSync(dummyAgentsDir)).toBe(false);
    });

    it('should clean up global superpowers skills safely', async () => {
        const result = await cleanSuperpowersGlobal({ silent: true });
        expect(result.success).toBe(true);
        expect(Array.isArray(result.removedPaths)).toBe(true);
    });
});
