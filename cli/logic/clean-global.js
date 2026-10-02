const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const { cleanSuperpowersGlobal } = require('./superpowers-installer');

/**
 * Clean up redundant global rules and skills that cause duplicate loading and Token Budget Exceeded in Antigravity IDE
 */
async function cleanGlobalConfig(options = {}) {
    const homedir = os.homedir();
    const geminiRulesDir = path.join(homedir, '.gemini', 'config', 'rules');
    const antigravityRulesDir = path.join(homedir, '.antigravity', 'rules');
    
    // Known toolkit rule files to safely remove from global
    const sourceRulesDir = path.join(__dirname, '..', '..', '.agent', 'rules');
    let targetRules = ['GEMINI.md', 'error-logging.md', 'docs-update.md'];
    
    if (fs.existsSync(sourceRulesDir)) {
        try {
            targetRules = fs.readdirSync(sourceRulesDir).filter(f => f.endsWith('.md'));
        } catch (_) {}
    }

    const removedFiles = [];

    // 1. Clean ~/.gemini/config/rules
    if (fs.existsSync(geminiRulesDir)) {
        try {
            const files = fs.readdirSync(geminiRulesDir);
            for (const file of files) {
                if (targetRules.includes(file)) {
                    const filePath = path.join(geminiRulesDir, file);
                    fs.unlinkSync(filePath);
                    removedFiles.push(`~/.gemini/config/rules/${file}`);
                }
            }
            // Remove dir if empty
            if (fs.readdirSync(geminiRulesDir).length === 0) {
                fs.rmdirSync(geminiRulesDir);
            }
        } catch (err) {
            console.warn(chalk.yellow(`⚠️ Không thể dọn dẹp ~/.gemini/config/rules: ${err.message}`));
        }
    }

    // 2. Clean ~/.antigravity/rules
    if (fs.existsSync(antigravityRulesDir)) {
        try {
            const files = fs.readdirSync(antigravityRulesDir);
            for (const file of files) {
                if (targetRules.includes(file)) {
                    const filePath = path.join(antigravityRulesDir, file);
                    fs.unlinkSync(filePath);
                    removedFiles.push(`~/.antigravity/rules/${file}`);
                }
            }
        } catch (_) {}
    }

    // 3. Clean global Superpowers skills to prevent global duplication
    const spResult = await cleanSuperpowersGlobal({ silent: true });
    if (spResult && spResult.removedPaths && spResult.removedPaths.length > 0) {
        for (const p of spResult.removedPaths) {
            removedFiles.push(p.replace(homedir, '~'));
        }
    }

    if (!options.silent) {
        if (removedFiles.length > 0) {
            console.log(chalk.bold.green('\n🧹 Dọn dẹp cấu hình Global thành công!'));
            console.log(chalk.gray('  Đã gỡ bỏ các rules và skills toàn cục gây tràn Token Budget:'));
            removedFiles.forEach(f => console.log(chalk.cyan(`  ✓ Đã xóa: ${f}`)));
            console.log(chalk.green(`\n✨ Đã giải phóng token! Giờ đây mỗi dự án chỉ dùng rules và skills riêng biệt trong thư mục của nó.\n`));
        } else {
            console.log(chalk.green('\n✅ Cấu hình Global đã sạch sẽ, không có rules hay skills trùng lặp.\n'));
        }
    }

    return {
        success: true,
        removedFiles,
        count: removedFiles.length
    };
}

module.exports = { cleanGlobalConfig };
