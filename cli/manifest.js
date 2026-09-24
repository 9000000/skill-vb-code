/**
 * Antigravity Resource Manifest
 * Defines the whitelist of agents, rules, and workflows for each operation mode.
 */

const MANIFEST = {
    "eco": {
        "rules": [
            "GEMINI.md",
            "security.md"
        ],
        "agents": [
            "orchestrator.md",
            "project-planner.md",
            "frontend-specialist.md",
            "backend-specialist.md",
            "debugger.md"
        ],
        "workflows": [
            "create.md",
            "plan.md",
            "debug.md",
            "orchestrate.md",
            "status.md",
            "log-error.md"
        ],
        "skills": [
            "api-patterns",
            "auth-implementation-patterns",
            "bash-linux",
            "bash-pro",
            "cicd-automation-workflow-automate",
            "clean-code",
            "debugger",
            "docker-expert",
            "e2e-testing-patterns",
            "full-stack-scaffold",
            "git-collaboration-master",
            "github-mcp",
            "github-workflow-automation",
            "llm-app-patterns",
            "nextjs-app-router-patterns",
            "prompt-engineering-patterns",
            "python-patterns",
            "react-patterns",
            "react-ui-patterns",
            "systematic-debugging",
            "tailwind-patterns",
            "tdd-master-workflow",
            "web-design-guidelines",
            "writing-plans",
            "ponytail",
            "ponytail-review"
        ],
        "shared": [
            "i18n-master",
            "design-philosophy",
            "ai-master"
        ],
        "core": "*",
        "scripts": [
            "checklist.py",
            "verify_all.py"
        ]
    },
    "pro": {
        "rules": [
            "GEMINI.md",
            "security.md",
            "frontend.md",
            "backend.md",
            "debug.md",
            "ponytail.md"
        ],
        "agents": [
            "orchestrator.md",
            "project-planner.md",
            "frontend-specialist.md",
            "backend-specialist.md",
            "debugger.md",
            "devops-architect.md",
            "documentation-writer.md",
            "test-engineer.md",
            "codebase-expert.md",
            "security-auditor.md"
        ],
        "workflows": [
            "create.md",
            "plan.md",
            "debug.md",
            "orchestrate.md",
            "status.md",
            "test.md",
            "deploy.md",
            "monitor.md",
            "audit.md",
            "document.md",
            "log-error.md"
        ],
        "skills": [
            "ai-engineer",
            "api-design-principles",
            "api-patterns",
            "api-security-best-practices",
            "architecture",
            "auth-implementation-patterns",
            "bash-linux",
            "bash-pro",
            "canvas-design",
            "cicd-automation-workflow-automate",
            "clean-code",
            "clerk-auth",
            "debugger",
            "docker-expert",
            "e2e-testing-patterns",
            "fastapi-pro",
            "frontend-design",
            "frontend-trends-2026",
            "full-stack-scaffold",
            "git-collaboration-master",
            "github-mcp",
            "github-workflow-automation",
            "llm-app-patterns",
            "mobile-design",
            "mobile-developer",
            "modern-web-performance",
            "nextjs-app-router-patterns",
            "nextjs-best-practices",
            "nextjs-react-expert",
            "nextjs-supabase-auth",
            "nodejs-best-practices",
            "pricing-strategy",
            "prompt-engineering-patterns",
            "python-patterns",
            "react-best-practices",
            "react-native-architecture",
            "react-native-best-practices",
            "react-patterns",
            "react-ui-patterns",
            "security-scanning-security-hardening",
            "systematic-debugging",
            "tailwind-design-system",
            "tailwind-patterns",
            "tdd-master-workflow",
            "testing-automation-mcp",
            "ui-ux-designer",
            "web-design-guidelines",
            "writing-plans",
            "ponytail",
            "ponytail-audit",
            "ponytail-debt",
            "ponytail-gain",
            "ponytail-help",
            "ponytail-review"
        ],
        "shared": [
            "i18n-master",
            "design-philosophy",
            "ai-master",
            "api-standards",
            "database-master",
            "design-system",
            "dx-toolkit",
            "metrics",
            "security-armor",
            "testing-master"
        ],
        "core": "*",
        "scripts": [
            "checklist.py",
            "verify_all.py",
            "translate_workflows.py",
            "verify_shared_modules.js"
        ]
    },
    "ultra": {
        "rules": "*",
        "agents": "*",
        "workflows": "*",
        "skills": "*",
        "shared": "*",
        "core": "*",
        "scripts": "*"
    }
};

module.exports = MANIFEST;
