const prompts = require('prompts');
const chalk = require('chalk');
const gradient = require('gradient-string');
const packageJson = require('../package.json');
const { execSync } = require('child_process');

// Import Logic Modules
const { skillCategories, getSkillsForCategories } = require('./logic/skill-definitions');
const { getScaleConfig } = require('./logic/scale-rules');
const { getProductConfig } = require('./logic/product-skills');
const { getWorkflows } = require('./logic/workflow-manager');

function checkPython() {
  try {
    execSync('python --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    try {
      execSync('python3 --version', { stdio: 'ignore' });
      return true;
    } catch (e2) {
      return false;
    }
  }
}

// Display concise banner with gradient
function displayBanner() {
  console.clear();
  console.log('');
  console.log(gradient.rainbow('━'.repeat(60)));
  console.log(gradient.pastel.multiline('    ___          __  _ ______                 _ __       '));
  console.log(gradient.pastel.multiline('   /   |  ____  / /_(_) ____/________ __   __(_) /___  __'));
  console.log(gradient.pastel.multiline('  / /| | / __ \\/ __/ / / __/ ___/ __ `/ | / / / __/ / / /'));
  console.log(gradient.pastel.multiline(' / ___ |/ / / / /_/ / /_/ / /  / /_/ /| |/ / / /_/ /_/ / '));
  console.log(gradient.pastel.multiline('/_/  |_/_/ /_/\\__/_/\\____/_/   \\__,_/ |___/_/\\__/\\__, /  '));
  console.log(gradient.pastel.multiline('                                                 /____/   '));
  console.log(chalk.gray(`  AntiGravity IDE • v${packageJson.version}`));
  console.log(chalk.gray('  ✨ System Core: 15 Rules • 22 Agents • 573 Skills • 30 Workflows • 2977 Patterns'));
  console.log(gradient.rainbow('━'.repeat(60)));
  console.log('');
}

async function getProjectConfig(skipPrompts = false, predefinedName = null) {
  let responses;

  if (skipPrompts) {
    responses = {
      language: 'en',
      projectName: predefinedName || 'my-agent-project',
      scale: 'creative', // Default to Creative for full experience
      productType: 'user_app', // Default
      agentName: 'Agent',
      industryDomain: 'other'
    };
  } else {
    // Check Python only if we are going to prompt (UX)
    const hasPython = checkPython();
    displayBanner();
    console.log(chalk.bold.cyan('🚀 Project Setup Wizard\n'));
    console.log(chalk.gray('Answer a few questions to configure your AI Agent project...\n'));

    responses = await prompts([
      {
        type: 'select',
        name: 'language',
        message: 'Select Language / Chọn ngôn ngữ:',
        choices: [
          { title: '1. English', value: 'en' },
          { title: '2. Tiếng Việt', value: 'vi' }
        ],
        initial: 1
      },
      {
        type: predefinedName ? null : 'text',
        name: 'projectName',
        message: (prev, values) => values.language === 'vi' ? 'Tên dự án (Project name):' : 'Project name:',
        initial: 'my-agent-project',
        validate: (value) => {
          if (value && !/^[a-z0-9-_]+$/.test(value)) {
            return 'Project name can only contain lowercase letters, numbers, hyphens, and underscores';
          }
          return true;
        }
      },
      {
        type: 'select',
        name: 'scale', // Maps to 'rules'
        message: (prev, values) => values.language === 'vi' ? 'Quy mô dự án:' : 'Project Scale:',
        choices: (prev, values) => values.language === 'vi' ? [
          { title: '🍜 Mì ăn liền (Instant) - MVP, nhanh gọn, tập trung Frontend', value: 'instant' },
          { title: '🎨 Sáng tạo (Creative) - Nghiên cứu, Sandbox, Full tính năng', value: 'creative' },
          { title: '🏢 SME (Enterprise) - Ổn định, Vận hành, Clean Code', value: 'sme' }
        ] : [
          { title: '🍜 Instant - MVP, Fast, Frontend Focus', value: 'instant' },
          { title: '🎨 Creative - Research, Sandbox, Full Features', value: 'creative' },
          { title: '🏢 SME - Stable, Operations, Clean Code', value: 'sme' }
        ],
        initial: 0
      },
      {
        type: 'select',
        name: 'productType',
        message: (prev, values) => values.language === 'vi' ? 'Loại sản phẩm (Product Type):' : 'Select Product Type:',
        choices: (prev, values) => values.language === 'vi' ? [
          { title: '📱 Ứng dụng Người dùng (App/Web/Mobile)', value: 'user_app' },
          { title: '🛠️ Công cụ Lập trình (CLI/Library/API)', value: 'dev_tool' },
          { title: '🤖 Trợ lý AI (Chatbot/Automation)', value: 'ai_agent' },
          { title: '🎨 Tài sản Số (Game/Template/Media)', value: 'digital_asset' }
        ] : [
          { title: '📱 User Application (App/Web/Mobile/Desktop)', value: 'user_app' },
          { title: '🛠️ Developer Tool (CLI/Library/API)', value: 'dev_tool' },
          { title: '🤖 AI Agent (Chatbot/Automation)', value: 'ai_agent' },
          { title: '🎨 Digital Asset (Game/Template/Media)', value: 'digital_asset' }
        ],
        initial: 0
      },
      {
        type: 'text',
        name: 'agentName',
        message: (prev, values) => values.language === 'vi' ? 'Đặt tên cho Agent (VD: Jarvis, Friday):' : 'Name your Agent (e.g., Jarvis, Friday):',
        validate: (value) => value.length < 2 ? (process.env.LANG?.includes('vi') ? 'Tên Agent phải có ít nhất 2 ký tự' : 'Name must be at least 2 characters long') : true
      }
    ], {
      onCancel: () => {
        console.log(chalk.red('\n✖ Operation cancelled'));
        process.exit(0);
      }
    });

    // Warning for missing Python in Advanced Modes
    if (responses.scale !== 'instant' && !hasPython) {
      console.log(chalk.yellow(`\n⚠️  Warning: Python is recommended for ${responses.scale.toUpperCase()} mode (AI & Data features).`));
      console.log(chalk.gray('   Follow Python installation guide in docs/INSTALL_NPX_GUIDE.vi.md if needed.'));
    }
  }

  // Inject predefined name if it exists (so logic downstream works)
  if (predefinedName) {
    responses.projectName = predefinedName;
  }
  
  if (!responses.projectName) responses.projectName = 'my-agent-project'; // Fallback

  console.log(`\n${chalk.green('✔')} Setup Complete! Generating Project Plan...`);

  // Default Industry to 'other' (General / All Fields)
  responses.industryDomain = 'other';

  // --- LOGIC INTEGRATION START ---

  // 1. Get Scale Configuration (Engine, Rules, Core Skills)
  const scaleConfig = getScaleConfig(responses.scale);

  // 2. Get Product Skills
  const { skills: productSkills, sharedModules } = getProductConfig(responses.productType);

  // 3. Combine Skills (Core + Product)
  const allSkills = new Set([...scaleConfig.coreSkillCategories, ...productSkills]);

  // 4. Get Workflows (combined from Scale and Product/Industry)
  const finalWorkflows = getWorkflows(
      responses.industryDomain, 
      responses.productType, 
      scaleConfig.baseWorkflows
  );

  const settings = {
    template: 'standard',
    rules: scaleConfig.rulesMode,
    workflows: finalWorkflows,
    packageManager: 'npm',
    engineMode: scaleConfig.engineMode,
    productType: responses.productType
  };
  
  // Return configuration
  return { ...responses, ...settings, skillCategories: Array.from(allSkills) };
}


async function confirmOverwrite(fileName, language = 'vi') {
  const isVi = language === 'vi';
  const response = await prompts({
    type: 'select',
    name: 'value',
    message: chalk.yellow(
      isVi 
        ? `⚠️  File "${fileName}" đã tồn tại. Bạn muốn xử lý thế nào?` 
        : `⚠️  File "${fileName}" already exists. How would you like to proceed?`
    ),
    choices: isVi ? [
      { title: '❌ Không ghi đè (Tạo file dự phòng .new.md, giữ nguyên file cũ)', value: false },
      { title: '⚠️ Ghi đè (Thay thế bằng file cấu hình mới)', value: true }
    ] : [
      { title: '❌ Do not overwrite (Create .new.md backup, preserve current file)', value: false },
      { title: '⚠️ Overwrite (Replace with new configuration)', value: true }
    ],
    initial: 0
  });
  return Boolean(response && response.value);
}

module.exports = {
  getProjectConfig,
  getSkillsForCategories,
  skillCategories,
  confirmOverwrite
};
