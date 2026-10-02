/**
 * Superpowers Installer & Manager
 * Manages original Superpowers skills (v6.4.2) from https://github.com/9000000/superpowers.git
 * Installs skills scoped to individual projects (Antigravity IDE workspace standard)
 * and cleans up global duplicates to prevent Token Budget Exceeded.
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
 * Locate source skills directory (bundled repo or agent fallback)
 */
function getSourceSkillsDir() {
  const bundledSuperpowersDir = path.join(__dirname, '..', '..', 'assets', 'superpowers');
  const bundledSkillsDir = path.join(bundledSuperpowersDir, 'skills');
  const agentSkillsFallback = path.join(__dirname, '..', '..', '.agent', 'skills');

  if (fs.existsSync(bundledSkillsDir)) {
    return { dir: bundledSkillsDir, hasFullRepo: true, fullRepoDir: bundledSuperpowersDir };
  } else if (fs.existsSync(agentSkillsFallback)) {
    return { dir: agentSkillsFallback, hasFullRepo: false, fullRepoDir: null };
  }
  return { dir: null, hasFullRepo: false, fullRepoDir: null };
}

/**
 * Install Superpowers skills directly into an individual project.
 * Targets .agent/skills to keep everything unified in the original .agent directory.
 * Also cleans up any unwanted .agents directory in the project.
 * 
 * @param {string} projectPath
 * @param {Object} options
 * @param {boolean} [options.silent=false]
 * @param {boolean} [options.force=true]
 * @returns {Promise<{success: boolean, count: number, installedSkills: string[], targetDirs: string[]}>}
 */
async function installSuperpowersToProject(projectPath, options = {}) {
  const silent = !!options.silent;
  const force = options.force !== false;
  const targetDirs = [];
  const installedSkills = [];

  const { dir: sourceSkillsDir } = getSourceSkillsDir();
  if (!sourceSkillsDir) {
    if (!silent) {
      console.warn(chalk.yellow('⚠️ Superpowers source directory not found. Skipping project skill installation.'));
    }
    return { success: false, count: 0, installedSkills: [], targetDirs: [] };
  }

  try {
    const destAgentSkills = path.join(projectPath, '.agent', 'skills');

    fs.ensureDirSync(destAgentSkills);
    targetDirs.push(destAgentSkills);

    for (const skill of SUPERPOWERS_SKILLS) {
      const src = path.join(sourceSkillsDir, skill);
      const dest = path.join(destAgentSkills, skill);

      if (fs.existsSync(src)) {
        await fs.copy(src, dest, { overwrite: force });
        installedSkills.push(skill);
      }
    }

    // Clean up .agents directory if present to keep everything unified in .agent
    const legacyAgentsDir = path.join(projectPath, '.agents');
    if (fs.existsSync(legacyAgentsDir)) {
      try {
        fs.removeSync(legacyAgentsDir);
      } catch (_) {}
    }

    if (!silent) {
      console.log(chalk.green(`  ⚡ Đã cài đặt ${installedSkills.length} Superpowers skills vào .agent/skills của dự án (${path.basename(projectPath || '.')})`));
    }

    return {
      success: true,
      count: installedSkills.length,
      installedSkills,
      targetDirs
    };
  } catch (err) {
    if (!silent) {
      console.warn(chalk.yellow(`  ⚠️ Project Superpowers installation notice: ${err.message}`));
    }
    return {
      success: false,
      count: installedSkills.length,
      installedSkills,
      targetDirs,
      error: err.message
    };
  }
}

/**
 * Clean up global Superpowers skills and plugins from ~/.gemini and ~/.antigravity
 * to eliminate duplicate loading and Token Budget Exceeded errors.
 * 
 * @param {Object} options
 * @param {boolean} [options.silent=false]
 * @returns {Promise<{success: boolean, removedCount: number, removedPaths: string[]}>}
 */
async function cleanSuperpowersGlobal(options = {}) {
  const silent = !!options.silent;
  const homedir = os.homedir();
  const removedPaths = [];

  const candidateDirs = [
    path.join(homedir, '.gemini', 'config', 'skills'),
    path.join(homedir, '.gemini', 'skills'),
    path.join(homedir, '.agents', 'skills'),
    path.join(homedir, '.antigravity', 'skills')
  ];

  for (const baseDir of candidateDirs) {
    if (!fs.existsSync(baseDir)) continue;

    for (const skill of SUPERPOWERS_SKILLS) {
      const skillPath = path.join(baseDir, skill);
      if (fs.existsSync(skillPath)) {
        try {
          fs.removeSync(skillPath);
          removedPaths.push(skillPath);
        } catch (_) {}
      }
    }
  }

  // Remove global plugin clone if present
  const globalPluginDir = path.join(homedir, '.gemini', 'config', 'plugins', 'superpowers');
  if (fs.existsSync(globalPluginDir)) {
    try {
      fs.removeSync(globalPluginDir);
      removedPaths.push(globalPluginDir);
    } catch (_) {}
  }

  if (!silent && removedPaths.length > 0) {
    console.log(chalk.green(`  🧹 Đã gỡ bỏ ${removedPaths.length} mục Superpowers khỏi môi trường Global.`));
  }

  return {
    success: true,
    removedCount: removedPaths.length,
    removedPaths
  };
}

/**
 * @deprecated Use installSuperpowersToProject instead.
 * Install Superpowers skills globally (Manual opt-in only)
 */
async function installSuperpowersGlobal(options = {}) {
  const silent = !!options.silent;
  const homedir = os.homedir();

  const geminiConfigDir = path.join(homedir, '.gemini', 'config');
  const globalSkillsDir = path.join(geminiConfigDir, 'skills');
  const globalPluginsDir = path.join(geminiConfigDir, 'plugins', 'superpowers');
  const geminiSkillsDir = path.join(homedir, '.gemini', 'skills');
  const agentsSkillsDir = path.join(homedir, '.agents', 'skills');
  const legacyGlobalDir = path.join(homedir, '.antigravity', 'skills');

  const { dir: sourceSkillsDir, hasFullRepo, fullRepoDir } = getSourceSkillsDir();

  if (!sourceSkillsDir) {
    if (!silent) {
      console.warn(chalk.yellow('⚠️ Superpowers source directory not found. Skipping global installation.'));
    }
    return { success: false, count: 0, targets: [] };
  }

  const installedSkills = [];
  const targets = [];

  try {
    fs.ensureDirSync(globalSkillsDir);
    targets.push(globalSkillsDir);

    for (const skill of SUPERPOWERS_SKILLS) {
      const src = path.join(sourceSkillsDir, skill);
      const dest = path.join(globalSkillsDir, skill);

      if (fs.existsSync(src)) {
        await fs.copy(src, dest, { overwrite: true });
        installedSkills.push(skill);
      }
    }

    if (hasFullRepo && fullRepoDir && fs.existsSync(fullRepoDir)) {
      fs.ensureDirSync(globalPluginsDir);
      await fs.copy(fullRepoDir, globalPluginsDir, {
        overwrite: true,
        filter: (src) => !src.includes('.git')
      });
      targets.push(globalPluginsDir);
    }

    linkOrCopyDir(globalSkillsDir, geminiSkillsDir);
    targets.push(geminiSkillsDir);

    linkOrCopyDir(globalSkillsDir, agentsSkillsDir);
    targets.push(agentsSkillsDir);

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
      console.log(chalk.yellow(`  ⚠️ Đã cài ${installedSkills.length} Superpowers skills vào Global (Lưu ý: Có thể gây tốn Token Budget).`));
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
  installSuperpowersToProject,
  cleanSuperpowersGlobal,
  installSuperpowersGlobal,
  SUPERPOWERS_SKILLS,
  SUPERPOWERS_REPO_URL
};
