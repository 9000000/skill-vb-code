#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const prompts = require('prompts');
const chalk = require('chalk');

const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');

async function main() {
    console.log(chalk.cyan('================================================================'));
    console.log(chalk.bold.yellow('   🚀 SKILL-VB-CODE AUTOMATIC PUBLISH & RELEASE WIZARD'));
    console.log(chalk.cyan('================================================================\n'));

    // 1. Kiểm tra package.json
    if (!fs.existsSync(PACKAGE_JSON_PATH)) {
        console.error(chalk.red('❌ Không tìm thấy package.json tại thư mục gốc dự án!'));
        process.exit(1);
    }

    const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
    const currentVersion = pkg.version;
    console.log(chalk.white('Phiên bản hiện tại: ') + chalk.bold.green(`v${currentVersion}\n`));

    // Tính toán trước các số version kế tiếp
    const parts = currentVersion.split('.').map(n => parseInt(n, 10));
    const nextPatch = `${parts[0]}.${parts[1]}.${(parts[2] || 0) + 1}`;
    const nextMinor = `${parts[0]}.${(parts[1] || 0) + 1}.0`;
    const nextMajor = `${(parts[0] || 0) + 1}.0.0`;

    // 2. Kiểm tra tài khoản NPM
    console.log(chalk.gray('🔍 Đang kiểm tra trạng thái đăng nhập NPM...'));
    let npmUser = '';
    try {
        npmUser = execSync('npm whoami', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    } catch (_) {}

    if (!npmUser) {
        console.log(chalk.yellow('⚠️ Chưa đăng nhập NPM. Đang kích hoạt đăng nhập...'));
        const loginRes = spawnSync('npm', ['login'], { stdio: 'inherit', shell: true });
        if (loginRes.status !== 0) {
            console.error(chalk.red('❌ Đăng nhập NPM thất bại! Vui lòng thử lại.'));
            process.exit(1);
        }
        try {
            npmUser = execSync('npm whoami', { encoding: 'utf-8' }).trim();
        } catch (_) {}
    }

    console.log(chalk.green(`✅ Tài khoản NPM hiện tại: `) + chalk.bold.cyan(npmUser || 'Unknown') + '\n');

    // 3. Hỏi người dùng thông tin cập nhật
    const questions = [
        {
            type: 'select',
            name: 'bumpType',
            message: 'Chọn mức tăng phiên bản:',
            choices: [
                { title: `Patch: Bản vá lỗi / cập nhật nhỏ (v${nextPatch}) [Khuyên dùng]`, value: 'patch' },
                { title: `Minor: Thêm tính năng lớn / Superpowers mới (v${nextMinor})`, value: 'minor' },
                { title: `Major: Thay đổi cấu trúc lớn (v${nextMajor})`, value: 'major' },
                { title: 'Tự nhập số phiên bản tùy chỉnh', value: 'custom' }
            ],
            initial: 0
        },
        {
            type: prev => prev === 'custom' ? 'text' : null,
            name: 'customVersion',
            message: 'Nhập số phiên bản mới (ví dụ 1.2.0):',
            validate: val => /^\d+\.\d+\.\d+(-.+)?$/.test(val.trim()) ? true : 'Định dạng phiên bản phải chuẩn SemVer (ví dụ 1.2.0)'
        },
        {
            type: 'text',
            name: 'commitMessage',
            message: 'Nhập mô tả sửa đổi phiên bản (Commit message):',
            initial: 'Auto-install original superpowers skills globally on npx setup'
        }
    ];

    const answers = await prompts(questions, {
        onCancel: () => {
            console.log(chalk.yellow('\n✖ Đã hủy quy trình publish.'));
            process.exit(0);
        }
    });

    let newVersion = '';
    if (answers.bumpType === 'patch') newVersion = nextPatch;
    else if (answers.bumpType === 'minor') newVersion = nextMinor;
    else if (answers.bumpType === 'major') newVersion = nextMajor;
    else if (answers.bumpType === 'custom') newVersion = answers.customVersion.trim();

    const commitMessage = answers.commitMessage.trim() || 'Release update';

    console.log('\n' + chalk.cyan('----------------------------------------------------------------'));
    console.log(chalk.bold('📋 Tóm Tắt Kế Hoạch Publish:'));
    console.log(chalk.gray('  Phiên bản mới: ') + chalk.bold.green(`v${newVersion}`));
    console.log(chalk.gray('  Mô tả commit:  ') + chalk.white(commitMessage));
    console.log(chalk.cyan('----------------------------------------------------------------\n'));

    const confirmRes = await prompts({
        type: 'confirm',
        name: 'proceed',
        message: 'Bắt đầu quy trình kiểm thử, đóng gói và publish?',
        initial: true
    });

    if (!confirmRes.proceed) {
        console.log(chalk.yellow('✖ Đã hủy bỏ thao tác.'));
        process.exit(0);
    }

    // 4. Bước 1: Chạy kiểm thử tự động
    console.log('\n' + chalk.cyan('================================================================'));
    console.log(chalk.bold('🧪 BƯỚC 1: Chạy kiểm thử tự động (npm test)...'));
    console.log(chalk.cyan('================================================================'));
    try {
        execSync('npm test', { cwd: ROOT_DIR, stdio: 'inherit' });
        console.log(chalk.green('✅ Toàn bộ bài test đều vượt qua 100%!\n'));
    } catch (err) {
        console.error(chalk.red('\n❌ Kiểm thử thất bại! Dừng quy trình để đảm bảo an toàn.'));
        process.exit(1);
    }

    // 5. Bước 2: Tăng version & Đóng gói bundle
    console.log(chalk.cyan('================================================================'));
    console.log(chalk.bold('📦 BƯỚC 2: Cập nhật phiên bản & Đóng gói Bundle...'));
    console.log(chalk.cyan('================================================================'));
    try {
        // Cập nhật version trong package.json
        execSync(`npm version ${newVersion} --no-git-tag-version`, { cwd: ROOT_DIR, stdio: 'inherit' });
        
        // Chạy prepublishOnly để bundle skills
        execSync('npm run prepublishOnly', { cwd: ROOT_DIR, stdio: 'inherit' });
        console.log(chalk.green(`✅ Đã thiết lập v${newVersion} và đóng gói bundle thành công!\n`));
    } catch (err) {
        console.error(chalk.red('\n❌ Lỗi khi cập nhật version hoặc đóng gói bundle:'), err.message);
        process.exit(1);
    }

    // 6. Bước 3: Xuất bản lên NPM
    console.log(chalk.cyan('================================================================'));
    console.log(chalk.bold(`🚀 BƯỚC 3: Xuất bản v${newVersion} lên NPM Registry...`));
    console.log(chalk.cyan('================================================================'));
    try {
        execSync('npm publish --access public', { cwd: ROOT_DIR, stdio: 'inherit' });
        console.log(chalk.green(`\n🎉 Xuất bản thành công phiên bản v${newVersion} lên NPM!\n`));
    } catch (err) {
        console.error(chalk.red('\n❌ Lỗi khi publish lên NPM. Nếu yêu cầu mã OTP, hãy kiểm tra lại kết nối hoặc Authenticator.'));
        process.exit(1);
    }

    // 7. Bước 4: Commit & Git Push
    console.log(chalk.cyan('================================================================'));
    console.log(chalk.bold('🐙 BƯỚC 4: Đồng bộ lên Git & GitHub...'));
    console.log(chalk.cyan('================================================================'));
    try {
        execSync('git add .', { cwd: ROOT_DIR, stdio: 'inherit' });
        execSync(`git commit -m "release: v${newVersion} - ${commitMessage}"`, { cwd: ROOT_DIR, stdio: 'inherit' });
        console.log(chalk.green(`✅ Đã tạo Git commit cho v${newVersion}`));

        const pushPrompt = await prompts({
            type: 'confirm',
            name: 'push',
            message: 'Đẩy code lên GitHub ngay (git push origin main)?',
            initial: true
        });

        if (pushPrompt.push) {
            console.log(chalk.gray('Đang chạy git push origin main...'));
            execSync('git push origin main', { cwd: ROOT_DIR, stdio: 'inherit' });
            console.log(chalk.green('✅ Đã đẩy commit mới lên GitHub!'));
        } else {
            console.log(chalk.yellow('ℹ️ Bạn có thể tự đẩy code sau bằng lệnh: git push origin main'));
        }
    } catch (gitErr) {
        console.warn(chalk.yellow('⚠️ Lưu ý về Git:'), gitErr.message);
    }

    // 8. Tổng kết
    console.log('\n' + chalk.cyan('================================================================'));
    console.log(chalk.bold.green('✨ HOÀN TẤT XUẤT BẢN THÀNH CÔNG!'));
    console.log(chalk.cyan('================================================================'));
    console.log(chalk.white('Phiên bản mới:    ') + chalk.bold.green(`v${newVersion}`));
    console.log(chalk.white('Thử nghiệm ngay:  ') + chalk.bold.cyan(`npx skill-vb-code@latest\n`));
}

main().catch(err => {
    console.error(chalk.red('\n❌ Lỗi không mong muốn:'), err.message);
    process.exit(1);
});
