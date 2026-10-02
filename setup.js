#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const chalk = require('chalk');
const gradient = require('gradient-string');
const boxen = require('boxen');
const prompts = require('prompts');
const packageJson = require('./package.json');

const GLOBAL_DIR = path.join(os.homedir(), '.antigravity');
const SOURCE_DIR = path.join(__dirname, '.agent');

const syncFolders = ['rules', 'workflows', 'agents', 'skills', '.shared'];

async function setup() {
    // Clear screen
    console.log('\x1b[2J\x1b[0f');

    // Premium Banner Restoration
    const branding = `
    ___          __  _ ______                 _ __       
   /   |  ____  / /_(_) ____/________ __   __(_) /___  __
  / /| | / __ \\/ __/ / / __/ ___/ __ \`/ | / / / __/ / / /
 / ___ |/ / / / /_/ / /_/ / /  / /_/ /| |/ / / /_/ /_/ / 
/_/  |_/_/ /_/\\__/_/\\____/_/   \\__,_/ |___/_/\\__/\\__, /  
                                                 /____/   
    `;
    
    console.log(gradient.rainbow.multiline(branding));
    console.log(gradient.atlas('━'.repeat(60)));
    console.log(chalk.gray(`  Antigravity IDE • Global Setup Wizard • v${packageJson.version}`));
    console.log(chalk.gray('  Developed with 💡 by Dokhacgiakhoa'));
    console.log(gradient.atlas('━'.repeat(60)) + '\n');
    console.log(chalk.bold.hex('#00ffee')('🚀 Antigravity Global Setup Starting...\n'));

    // 0. Check for Python (Required for Advanced Skills)
    let hasPython = false;
    try {
        execSync('python --version', { stdio: 'ignore' });
        hasPython = true;
    } catch (e) {
        try {
            execSync('python3 --version', { stdio: 'ignore' });
            hasPython = true;
        } catch (e2) {}
    }

    // Silent check - we will warn later if they select Advanced Mode

    // Interactive Prompts
    const response = await prompts([
        {
            type: 'select',
            name: 'lang',
            message: 'Select Language / Chọn Ngôn ngữ:',
            choices: [
                { title: 'Tiếng Việt (Vietnamese)', value: 'vi' },
                { title: 'English (Tiếng Anh)', value: 'en' }
            ],
            initial: 0
        },
        {
            type: 'select',
            name: 'engineMode',
            message: (prev, values) => values.lang === 'vi' ? 'Chọn Chế độ Động cơ:' : 'Select Engine Mode:',
            choices: (prev, values) => values.lang === 'vi' ? [
                { title: '⚡ Standard (Node.js) - Gọn nhẹ [Mặc định]', value: 'standard' },
                { title: '🧠 Advanced (Python) - Chuyên sâu AI & Data', value: 'advanced' }
            ] : [
                { title: '⚡ Standard (Node.js) - Lightweight [Default]', value: 'standard' },
                { title: '🧠 Advanced (Python) - Deep AI & Data', value: 'advanced' }
            ],
            initial: 0
        },
        {
            type: 'text',
            name: 'agentName',
            message: (prev, values) => values.lang === 'vi' ? 'Đặt tên định danh cho AI Agent của bạn:' : 'Name your AI Agent:',
            validate: value => value.length < 2 ? 'Minimum 2 chars' : true
        },
        {
            type: 'select',
            name: 'projectScale',
            message: (prev, values) => values.lang === 'vi' ? 'Chọn Quy mô Dự án (Project Scale):' : 'Select Project Scale:',
            choices: (prev, values) => values.lang === 'vi' ? [
                { title: '⚡ Instant (Tức thời) - Cá nhân & Nhanh gọn', value: 'instant' },
                { title: '🎨 Creative (Sáng tạo) - Full AI Suite [Mặc định]', value: 'creative' },
                { title: '🏢 SME / Enterprise (Doanh nghiệp) - Bảo mật & Chuẩn hóa', value: 'sme' }
            ] : [
                { title: '⚡ Instant - Personal & Fast', value: 'instant' },
                { title: '🎨 Creative - Full AI Suite [Default]', value: 'creative' },
                { title: '🏢 SME / Enterprise - Security & Standard', value: 'sme' }
            ],
            initial: 1
        },
        {
            type: 'select',
            name: 'industryDomain',
            message: (prev, values) => values.lang === 'vi' ? 'Chọn Lĩnh vực dự án (Industry):' : 'Select Industry Domain:',
            choices: (prev, values) => values.lang === 'vi' ? [
                { title: '💰 Finance (Tài chính - Fintech)', value: 'finance' },
                { title: '🎓 Education (Giáo dục - EdTech)', value: 'education' },
                { title: '🍔 F&B / Restaurant (Nhà hàng)', value: 'fnb' },
                { title: '👤 Personal / Portfolio (Cá nhân)', value: 'personal' },
                { title: '🏥 Healthcare (Y tế - HealthTech)', value: 'healthcare' },
                { title: '🚚 Logistics (Vận tải)', value: 'logistics' },
                { title: '🔮 Other (Khác - Web/App cơ bản)', value: 'other' }
            ] : [
                { title: '💰 Finance (Fintech)', value: 'finance' },
                { title: '🎓 Education (EdTech)', value: 'education' },
                { title: '🍔 F&B / Restaurant', value: 'fnb' },
                { title: '👤 Personal / Portfolio', value: 'personal' },
                { title: '🏥 Healthcare (HealthTech)', value: 'healthcare' },
                { title: '🚚 Logistics', value: 'logistics' },
                { title: '🔮 Other (General Web/App)', value: 'other' }
            ],
            initial: 6
        }
    ], {
        onCancel: () => {
            console.log(chalk.red('\n✖ Setup cancelled / Đã hủy thiết lập'));
            process.exit(0);
        }
    });

    const { lang, engineMode, agentName, projectScale, industryDomain } = response;

    console.log(chalk.green(`\n📍 Configuration Saved:`));
    console.log(chalk.cyan(`   Language: ${lang === 'vi' ? 'Tiếng Việt' : 'English'}`));
    console.log(chalk.cyan(`   Agent Name: ${chalk.bold.yellow(agentName)}`));
    console.log(chalk.cyan(`   Engine: ${engineMode.toUpperCase()}`));
    console.log(chalk.cyan(`   Scale: ${projectScale.toUpperCase()}`));
    console.log(chalk.cyan(`   Industry: ${industryDomain ? industryDomain.toUpperCase() : 'OTHER'}\n`));

    // Save config
    if (!fs.existsSync(GLOBAL_DIR)) {
        fs.mkdirSync(GLOBAL_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(GLOBAL_DIR, '.config.json'), JSON.stringify({ lang, engineMode, agentName, projectScale, industryDomain }, null, 2));

    // 5. Smart Dependency Check (Post-Selection)
    if (engineMode === 'advanced' && !hasPython) {
        console.log('\n' + boxen(
            lang === 'vi' 
            ? chalk.bold.red('⚠️  CẢNH BÁO: CHƯA CÀI ĐẶT PYTHON!') + '\n\n' +
              chalk.white('Chế độ "Advanced" yêu cầu Python để chạy các thuật toán AI.') + '\n' +
              chalk.yellow('Vui lòng chạy lệnh sau để cài đặt tự động:')
            : chalk.bold.red('⚠️  WARNING: PYTHON NOT DETECTED!') + '\n\n' +
              chalk.white('Advanced Mode requires Python for AI algorithms.') + '\n' +
              chalk.yellow('Please run the following command to install:'),
            { padding: 1, borderColor: 'red', borderStyle: 'double' }
        ));

        let installCmd = '';
        if (os.platform() === 'win32') {
            // Recommendation: Python 3.13 (Latest - 1 strategy for Max Stability in 2026)
            installCmd = 'winget install Python.Python.3.13';
        } else if (os.platform() === 'darwin') {
            installCmd = 'brew install python@3.13';
        } else {
            installCmd = 'sudo apt update && sudo apt install python3.13 python3-pip';
        }

        console.log(chalk.black.bgCyan.bold(`  ${installCmd}  `) + '\n');
        
        // AI Delegation Prompt (New Feature)
        const checkMark = chalk.green('✔');
        const promptText = lang === 'vi' 
            ? `Hãy cài đặt Python 3.13 giúp tôi bằng lệnh: ${installCmd}`
            : `Please install Python 3.13 for me using: ${installCmd}`;

        console.log(boxen(
            (lang === 'vi' ? chalk.bold.yellow('🤖 COPY PROMPT NÀY GỬI CHO AI AGENT:') : chalk.bold.yellow('🤖 COPY THIS PROMPT FOR YOUR AI AGENT:')) + 
            '\n\n' + chalk.white(promptText),
            { padding: 1, borderColor: 'yellow', borderStyle: 'round', title: 'Delegate to AI / Ủy quyền cho AI' }
        ));

        console.log(chalk.gray(lang === 'vi' 
            ? '(Đã chọn phiên bản Stable N-1 để đảm bảo tương thích tốt nhất)' 
            : '(Selected Stable N-1 version for maximum compatibility)'));
        console.log(chalk.gray(lang === 'vi' ? '(Sau khi cài xong, hãy chạy lại setup)' : '(After installation, please run setup again)'));
        
        // Optional: Ask to auto-install? (Risk of permission issues, stick to suggestion for safety as per "Safety First" rule)
    }

    // 6. Sync Files (GLOBAL ALWAYS FULL ENTERPRISE)
    console.log('\n🔄 Checking Global Cache (Update if needed)...');
    syncFolders.forEach(folder => {
        const src = path.join(SOURCE_DIR, folder);
        const dest = path.join(GLOBAL_DIR, folder);

        // Special handling for 'skills' bundling
        if (folder === 'skills') {
            const bundlePath = path.join(__dirname, 'assets', 'skills-bundle.json');
            if (fs.existsSync(bundlePath)) {
                console.log('📦 Hydrating Skills from Bundle...');
                try {
                    const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf-8'));
                    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                    
                    let count = 0;
                    Object.entries(bundle).forEach(([relPath, content]) => {
                        const fullPath = path.join(dest, relPath);
                        const dir = path.dirname(fullPath);
                        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                        fs.writeFileSync(fullPath, content);
                        count++;
                    });
                    console.log(`✅ Hydrated ${count} skills from bundle.`);
                    return; // Skip normal copy for skills if bundle used
                } catch (e) {
                    console.error('❌ Failed to hydrate bundle, falling back to copy:', e.message);
                }
            }
        }

        if (fs.existsSync(src)) {
            // ALWAYS sync full content to Global (Central Repository)
            // This ensures Global always has the latest & greatest version of everything.
            if (os.platform() === 'win32') {
                try {
                    execSync(`robocopy "${src}" "${dest}" /E /NFL /NDL /NJH /NJS /nc /ns /np /XO`, { stdio: 'inherit' });
                } catch (e) {}
            } else {
                execSync(`mkdir -p "${dest}" && cp -R "${src}/"* "${dest}/"`, { stdio: 'inherit' });
            }
        }
    });
    console.log('✅ Global Cache is up-to-date (Full Enterprise Mode).');

    // Sync Superpowers skills globally ONLY if explicitly requested
    const isGlobal = process.argv.includes('--global') || process.argv.includes('-g');
    if (isGlobal) {
        const { installSuperpowersGlobal } = require('./cli/logic/superpowers-installer');
        await installSuperpowersGlobal({ silent: false });
    }

    // 7. Initialize Workspace (Apply Scale Logic to Local Project)
    // Only copy specific rules to current directory based on Scale
    console.log(`\n📂 Initializing Workspace (Scale: ${projectScale.toUpperCase()})...`);
    
    const localAgentDir = path.join(process.cwd(), '.agent');
    const localRulesDir = path.join(localAgentDir, 'rules');

    // Create local .agent struct if not exists
    if (!fs.existsSync(localRulesDir)) fs.mkdirSync(localRulesDir, { recursive: true });

    // Define rules for each scale (GEMINI.md is generated at root only)
    const rulesToApply = {
        'instant': ['security.md', 'debug.md'], // Minimal
        'personal': ['security.md', 'debug.md'], // Legacy fallback
        'creative': null, // All Rules (Full Power)
        'sme': ['security.md', 'frontend.md', 'backend.md', 'debug.md', 'business.md', 'compliance.md', 'architecture-review.md'],
        'enterprise': null // All Rules
    };

    const targetRules = rulesToApply[projectScale];

    if (targetRules) {
        // Copy specific files from GLOBAL to LOCAL
        targetRules.forEach(file => {
            if (file === 'GEMINI.md') return;
            const globalFile = path.join(GLOBAL_DIR, 'rules', file);
            const localFile = path.join(localRulesDir, file);
            if (fs.existsSync(globalFile)) {
                 fs.copyFileSync(globalFile, localFile);
            }
        });
        console.log(`✅ Applied ${targetRules.length} rules to Workspace.`);
    } else {
        // Enterprise: Copy ALL rules from Global to Local (except GEMINI.md)
         const globalRulesDir = path.join(GLOBAL_DIR, 'rules');
         if (fs.existsSync(globalRulesDir)) {
             fs.readdirSync(globalRulesDir).forEach(file => {
                 if (file === 'GEMINI.md') return;
                 fs.copyFileSync(path.join(globalRulesDir, file), path.join(localRulesDir, file));
             });
         }
         console.log(`✅ Applied Full Enterprise rules to Workspace.`);
    }

    // 8. Inject Config into Workspace Root GEMINI.md (Single Constitution)
    const geminiRuleSrc = path.join(GLOBAL_DIR, 'rules', 'GEMINI.md');
    const rootGeminiPath = path.join(process.cwd(), 'GEMINI.md');
    if (fs.existsSync(geminiRuleSrc)) {
        let content = fs.readFileSync(geminiRuleSrc, 'utf-8');
        
        // Inject Agent Name
        if (agentName && agentName !== 'Antigravity') {
            content = content.replace(
                /Nhân dạng\*\*: Antigravity Orchestrator/g, 
                `Nhân dạng**: ${agentName} (Powered by Antigravity)`
            );
        }

        // Inject Industry Domain
        if (industryDomain) {
            content = content.replace(
                /Lĩnh vực hoạt động\*\*: GENERAL \(Mặc định\)/g, 
                `Lĩnh vực hoạt động**: ${industryDomain.toUpperCase()}`
            );
        }

        fs.writeFileSync(rootGeminiPath, content);
    }

    // Clean up duplicate GEMINI.md in .agent/rules/ or .agent/ if exists
    const duplicateAgentRulesGemini = path.join(localRulesDir, 'GEMINI.md');
    if (fs.existsSync(duplicateAgentRulesGemini)) {
        try { fs.unlinkSync(duplicateAgentRulesGemini); } catch (_) {}
    }
    const duplicateAgentGemini = path.join(localAgentDir, 'GEMINI.md');
    if (fs.existsSync(duplicateAgentGemini)) {
        try { fs.unlinkSync(duplicateAgentGemini); } catch (_) {}
    }

    // 3. Localize Workflows (Kept logic index same for simplicity, technically step 9 now)
    localizeWorkflows(lang);

    // FINAL SUMMARY (Premium Style)
    console.log('\n' + gradient.pastel.multiline(lang === 'vi' ? '📦 Đang cấu hình môi trường Antigravity IDE' : '📦 Configuring Antigravity IDE Environment'));
    console.log(gradient.atlas('━'.repeat(60)));
    
    console.log(chalk.green('√') + (lang === 'vi' ? ' Đồng bộ Global Rules (Chuẩn Enterprise)' : ' Global Rules Synced (Enterprise Standard)'));
    console.log(chalk.green('√') + (lang === 'vi' ? ' Đã bản địa hóa Workflows' : ' Workflows Localized'));
    console.log(chalk.green('√') + (lang === 'vi' ? ` Cấu hình Workspace (Chế độ ${projectScale.toUpperCase()})` : ` Workspace Configured (${projectScale.toUpperCase()} Mode)`));
    console.log(chalk.green('√') + (lang === 'vi' ? ' Đã nạp Context (Định danh & Lĩnh vực)' : ' Context Injected (Identity & Domain)'));
    
    console.log(gradient.rainbow(lang === 'vi' ? '\n✓ THÀNH CÔNG! Hệ thống đã sẵn sàng' : '\n✓ SUCCESS! System Ready'));
    console.log(gradient.atlas('━'.repeat(60)));

    console.log(chalk.bold.yellow(lang === 'vi' ? '\n🤖 Kích hoạt AI Agent (Bước tiếp theo):' : '\n🤖 Activate AI Agent (Next Steps):'));
    if (lang === 'vi') {
        console.log(`   1. Mở dự án:     ${chalk.cyan('cd <your-project>')}`);
        console.log(`   2. Mở Chat:      ${chalk.cyan('(Sử dụng AI Panel của IDE)')}`);
        console.log(`   3. Kích hoạt:    ${chalk.cyan('Đọc nội dung .agent/rules/GEMINI.md')}`);
        console.log(`\n   ✨ ${chalk.gray('AI sẽ tự động nhận diện danh tính ' + chalk.bold(agentName || 'Antigravity') + ' và lĩnh vực ' + chalk.bold(industryDomain || 'General'))}`);
    } else {
        console.log(`   1. Open Project: ${chalk.cyan('cd <your-project>')}`);
        console.log(`   2. Open Chat:    ${chalk.cyan('(Use IDE AI Panel)')}`);
        console.log(`   3. Activate:     ${chalk.cyan('Read .agent/rules/GEMINI.md')}`);
        console.log(`\n   ✨ ${chalk.gray('AI will automatically recognize ' + chalk.bold(agentName || 'Antigravity') + ' and ' + chalk.bold(industryDomain || 'General') + ' context.')}`);
    }
    console.log(gradient.atlas('━'.repeat(60)) + '\n');

    process.exit(0); // Exit properly to avoid that "Exit code 1"
}

function localizeWorkflows(lang) {
    // console.log('\n🌍 Localizing Workflows...'); // Suppress log
    try {
        const workflowsJSON = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, '.shared', 'i18n-master', 'workflows.json'), 'utf-8'));
        const workflowDir = path.join(GLOBAL_DIR, 'workflows');

        Object.keys(workflowsJSON).forEach(filename => {
            const filePath = path.join(workflowDir, filename);
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf-8');
                const desc = workflowsJSON[filename][lang];
                
                const newContent = content.replace(/^description:.*$/m, `description: ${desc}`);
                
                if (newContent !== content) {
                    fs.writeFileSync(filePath, newContent);
                    console.log(`   - Translated ${filename}`);
                }
            }
        });
        console.log('✅ Localization Complete.');
    } catch (err) {
        console.error('❌ Localization failed:', err.message);
    }
}

setup();
