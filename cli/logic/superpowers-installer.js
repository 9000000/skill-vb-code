/**
 * Superpowers Global Installer
 * Installs and synchronizes the original Superpowers skills (v6.4.2)
 * globally across the user's environment for Antigravity IDE and companion CLIs.
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

const SUPERPOWERS_REPO_URL = 'https://github.com/9000000/superpowers.git';

const SUPERPOWERS_SKILLS = [
  'brainstorming',
  'diagnosing-superpowers',
  'dispatching-parallel-agents',
  'executing-plans',
  'finishing-a-development-branch',
  'receiving-code-review',
  'requesting-code-review',
  'subagent-driven-development',
  'systematic-debugging',
  'test-driven-development',
  'using-git-worktrees',
  'using-superpowers',
  'verification-before-completion',
  'writing-plans',
  'writing-skills'
];

/**
 * Link or copy directory for cross-runtime compatibility
 */
function linkOrCopyDir(targetPath, linkPath) {
  try {
    if (fs.existsSync(linkPath)) {
      // Check if already pointing to the target
      try {
        const real = fs.realpathSync(linkPath);
        if (path.resolve(real) === path.resolve(targetPath)) {
          return true;
        }
      } catch (_) {}
      fs.removeSync(linkPath);
    }

    const parent = path.dirname(linkPath);
    fs.ensureDirSync(parent);

    const symlinkType = os.platform() === 'win32' ? 'junction' : 'dir';
    fs.symlinkSync(targetPath, linkPath, symlinkType);
    return true;
  } catch (err) {
    // Fallback: direct recursive copy if symlink/junction fails
    try {
      fs.ensureDirSync(linkPath);
      fs.copySync(targetPath, linkPath, { overwrite: true });
      return true;
    } catch (_) {
      return false;
    }
  }
}

/**
 * Install Superpowers skills globally
 * @param {Object} options
 * @param {boolean} [options.silent=false]
 * @param {boolean} [options.force=false]
 * @returns {Promise<{success: boolean, count: number, targets: string[]}>}
 */
async function installSuperpowersGlobal(options = {}) {
  const silent = !!options.silent;
  const homedir = os.homedir();

  // Destination directories
  const geminiConfigDir = path.join(homedir, '.gemini', 'config');
  const globalSkillsDir = path.join(geminiConfigDir, 'skills');
  const globalPluginsDir = path.join(geminiConfigDir, 'plugins', 'superpowers');
  const geminiSkillsDir = path.join(homedir, '.gemini', 'skills');
  const agentsSkillsDir = path.join(homedir, '.agents', 'skills');
  const legacyGlobalDir = path.join(homedir, '.antigravity', 'skills');

  // Source directories
  const bundledSuperpowersDir = path.join(__dirname, '..', '..', 'assets', 'superpowers');
  const bundledSkillsDir = path.join(bundledSuperpowersDir, 'skills');
  const agentSkillsFallback = path.join(__dirname, '..', '..', '.agent', 'skills');

  let sourceSkillsDir = null;
  let hasFullRepo = false;

  if (fs.existsSync(bundledSkillsDir)) {
    sourceSkillsDir = bundledSkillsDir;
    hasFullRepo = true;
  } else if (fs.existsSync(agentSkillsFallback)) {
    sourceSkillsDir = agentSkillsFallback;
  }

  if (!sourceSkillsDir) {
    if (!silent) {
      console.warn(chalk.yellow('⚠️ Superpowers source directory not found. Skipping global installation.'));
    }
    return { success: false, count: 0, targets: [] };
  }

  const installedSkills = [];
  const targets = [];

  try {
    // 1. Ensure target directories exist
    fs.ensureDirSync(globalSkillsDir);
    targets.push(globalSkillsDir);

    // 2. Install each of the 15 Superpowers skills into ~/.gemini/config/skills/
    for (const skill of SUPERPOWERS_SKILLS) {
      const src = path.join(sourceSkillsDir, skill);
      const dest = path.join(globalSkillsDir, skill);

      if (fs.existsSync(src)) {
        await fs.copy(src, dest, { overwrite: true });
        installedSkills.push(skill);
      }
    }

    // 3. Install full plugin into ~/.gemini/config/plugins/superpowers/ if repo bundle exists
    if (hasFullRepo && fs.existsSync(bundledSuperpowersDir)) {
      fs.ensureDirSync(globalPluginsDir);
      await fs.copy(bundledSuperpowersDir, globalPluginsDir, {
        overwrite: true,
        filter: (src) => !src.includes('.git')
      });
      targets.push(globalPluginsDir);
    }

    // 4. Create cross-runtime junctions/links for ~/.gemini/skills and ~/.agents/skills
    linkOrCopyDir(globalSkillsDir, geminiSkillsDir);
    targets.push(geminiSkillsDir);

    linkOrCopyDir(globalSkillsDir, agentsSkillsDir);
    targets.push(agentsSkillsDir);

    // 5. Sync to legacy ~/.antigravity/skills for backwards compatibility
    try {
      fs.ensureDirSync(legacyGlobalDir);
      for (const skill of installedSkills) {
        const src = path.join(sourceSkillsDir, skill);
        const dest = path.join(legacyGlobalDir, skill);
        if (fs.existsSync(src)) {
          await fs.copy(src, dest, { overwrite: true });
        }
      }
      targets.push(legacyGlobalDir);
    } catch (_) {}

    if (!silent) {
      console.log(chalk.green(`  ⚡ Installed ${installedSkills.length} Superpowers skills globally (original v6.4.2)`));
    }

    return {
      success: true,
      count: installedSkills.length,
      installedSkills,
      targets
    };
  } catch (err) {
    if (!silent) {
      console.warn(chalk.yellow(`  ⚠️ Global Superpowers sync notice: ${err.message}`));
    }
    return {
      success: false,
      count: installedSkills.length,
      installedSkills,
      targets,
      error: err.message
    };
  }
}

module.exports = {
  installSuperpowersGlobal,
  SUPERPOWERS_SKILLS,
  SUPERPOWERS_REPO_URL
};
