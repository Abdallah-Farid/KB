
# Windsurf IDE Integration Setup Guide

## Overview
This guide provides step-by-step instructions for integrating the S.P.A. (Software Production Agent) system with Windsurf IDE for seamless AI-powered development workflows.

## Prerequisites
- Windsurf IDE installed and configured
- Node.js 18+ installed
- Git configured
- Access to the S.P.A. System directory

## Installation Steps

### 1. Clone S.P.A. System
```bash
# If not already available
git clone <spa-system-repo> ~/SPA_System
cd ~/SPA_System
```

### 2. Install Dependencies
```bash
# Install core dependencies
npm install -g @spa-system/cli
npm install -g typescript
npm install -g @windsurf/spa-extension
```

### 3. Configure Windsurf IDE

#### 3.1 Install S.P.A. Extension
1. Open Windsurf IDE
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "S.P.A. System"
4. Install the official S.P.A. extension

#### 3.2 Configure Settings
Create or update `.vscode/settings.json` in your workspace:

```json
{
  "spa.system.path": "~/SPA_System",
  "spa.orchestrator.autoStart": true,
  "spa.agents.enabled": [
    "analyst",
    "product_manager",
    "architect",
    "design_architect",
    "developer",
    "devops_engineer",
    "qa_engineer"
  ],
  "spa.quality.gates.enabled": true,
  "spa.templates.autoSuggest": true,
  "spa.workflows.defaultType": "web_app",
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  }
}
```

#### 3.3 Configure Keybindings
Add to `.vscode/keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+s",
    "command": "spa.orchestrator.start",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+a",
    "command": "spa.agent.select",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+t",
    "command": "spa.task.execute",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+q",
    "command": "spa.quality.gate.check",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+w",
    "command": "spa.workflow.start",
    "when": "editorTextFocus"
  }
]
```

### 4. Project Configuration

#### 4.1 Initialize S.P.A. in Project
```bash
# In your project directory
spa init --type=web_app --template=startup_mvp
```

#### 4.2 Create S.P.A. Configuration
Create `spa.config.json` in your project root:

```json
{
  "project": {
    "name": "My Awesome App",
    "type": "web_app",
    "template": "startup_mvp"
  },
  "orchestrator": {
    "autoStart": true,
    "defaultWorkflow": "spa_development"
  },
  "agents": {
    "primary": ["developer", "architect", "qa_engineer"],
    "secondary": ["product_manager", "design_architect"]
  },
  "quality": {
    "gates": {
      "development": {
        "testCoverage": 80,
        "codeQuality": "high",
        "performance": "good"
      }
    }
  },
  "integrations": {
    "github": {
      "enabled": true,
      "autoCommit": false,
      "branchStrategy": "feature"
    },
    "deployment": {
      "platform": "vercel",
      "autoDeployment": false
    }
  }
}
```

## Using S.P.A. in Windsurf IDE

### 1. Starting the Orchestrator
- Use Command Palette (Ctrl+Shift+P)
- Type "S.P.A.: Start Orchestrator"
- Or use keybinding: Ctrl+Shift+S

### 2. Agent Interaction
- **Select Agent**: Ctrl+Shift+A
- **Execute Task**: Ctrl+Shift+T
- **Get Recommendations**: Right-click → "S.P.A. Suggestions"

### 3. Workflow Management
- **Start Workflow**: Ctrl+Shift+W
- **View Progress**: S.P.A. panel in sidebar
- **Quality Gates**: Ctrl+Shift+Q

### 4. Code Generation
- **Generate Component**: Right-click → "S.P.A.: Generate Component"
- **Create API Endpoint**: Command Palette → "S.P.A.: Create API"
- **Generate Tests**: Right-click → "S.P.A.: Generate Tests"

## Available Commands

### Core Commands
- `spa.orchestrator.start` - Start the S.P.A. orchestrator
- `spa.orchestrator.stop` - Stop the orchestrator
- `spa.orchestrator.status` - Check orchestrator status

### Agent Commands
- `spa.agent.select` - Select an agent for current task
- `spa.agent.list` - List all available agents
- `spa.agent.capabilities` - Show agent capabilities

### Task Commands
- `spa.task.execute` - Execute a specific task
- `spa.task.list` - List available tasks
- `spa.task.history` - Show task execution history

### Workflow Commands
- `spa.workflow.start` - Start a workflow
- `spa.workflow.pause` - Pause current workflow
- `spa.workflow.resume` - Resume paused workflow
- `spa.workflow.status` - Check workflow status

### Quality Commands
- `spa.quality.gate.check` - Run quality gate validation
- `spa.quality.metrics` - Show quality metrics
- `spa.quality.report` - Generate quality report

### Code Generation Commands
- `spa.generate.component` - Generate React component
- `spa.generate.api` - Generate API endpoint
- `spa.generate.test` - Generate test files
- `spa.generate.documentation` - Generate documentation

## Sidebar Panel Features

### S.P.A. Explorer
- Project overview
- Active workflows
- Agent status
- Task queue
- Quality metrics

### Agent Panel
- Available agents
- Agent capabilities
- Current assignments
- Performance metrics

### Quality Dashboard
- Quality gate status
- Code metrics
- Test coverage
- Performance indicators

## Customization

### Custom Agent Configurations
Create `.spa/agents/custom-agent.yaml`:

```yaml
agent_type: "custom_agent"
extends: "developer"
capabilities:
  - "custom_capability"
tools:
  - "custom_tool"
```

### Custom Workflows
Create `.spa/workflows/custom-workflow.yaml`:

```yaml
workflow_name: "custom_development"
extends: "spa_development"
phases:
  custom_phase:
    duration: "1 day"
    agents: ["custom_agent"]
```

### Custom Templates
Create `.spa/templates/custom-template/`:
```
custom-template/
├── package.json
├── src/
│   ├── components/
│   └── pages/
└── README.md
```

## Troubleshooting

### Common Issues

#### 1. Orchestrator Not Starting
```bash
# Check S.P.A. installation
spa --version

# Restart Windsurf IDE
# Check extension logs in Output panel
```

#### 2. Agent Not Responding
```bash
# Check agent status
spa agent status

# Restart specific agent
spa agent restart developer
```

#### 3. Quality Gates Failing
```bash
# Run quality check manually
spa quality check

# View detailed report
spa quality report --detailed
```

### Debug Mode
Enable debug mode in settings:
```json
{
  "spa.debug.enabled": true,
  "spa.debug.level": "verbose"
}
```

### Log Files
- S.P.A. logs: `~/.spa/logs/`
- Windsurf logs: Check Output panel → S.P.A. System

## Best Practices

### 1. Project Structure
```
my-project/
├── spa.config.json
├── .spa/
│   ├── agents/
│   ├── workflows/
│   └── templates/
├── src/
├── tests/
└── docs/
```

### 2. Agent Usage
- Use specific agents for specialized tasks
- Let orchestrator choose agents for complex workflows
- Monitor agent performance and adjust assignments

### 3. Quality Management
- Run quality gates frequently
- Address issues immediately
- Use automated quality checks in CI/CD

### 4. Workflow Optimization
- Customize workflows for your project needs
- Use templates for rapid project setup
- Monitor workflow performance and optimize

## Advanced Features

### 1. Multi-Project Management
```json
{
  "workspace": {
    "projects": [
      {
        "name": "frontend",
        "path": "./frontend",
        "type": "web_app"
      },
      {
        "name": "backend",
        "path": "./backend",
        "type": "api_service"
      }
    ]
  }
}
```

### 2. Team Collaboration
```json
{
  "team": {
    "members": [
      {
        "name": "Developer 1",
        "role": "frontend",
        "agents": ["developer", "design_architect"]
      }
    ],
    "shared": {
      "workflows": true,
      "quality_gates": true,
      "templates": true
    }
  }
}
```

### 3. CI/CD Integration
```yaml
# .github/workflows/spa-quality.yml
name: S.P.A. Quality Gates
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: spa-system/quality-action@v1
        with:
          config: spa.config.json
```

## Support and Resources

### Documentation
- [S.P.A. System Documentation](~/SPA_System/README.md)
- [Agent Specifications](~/SPA_System/Agent_Definitions/)
- [Workflow Guides](~/SPA_System/Workflows/)

### Community
- GitHub Issues: Report bugs and feature requests
- Discord: Real-time community support
- Documentation: Comprehensive guides and tutorials

### Updates
- Extension updates: Automatic through Windsurf IDE
- S.P.A. System updates: `spa update`
- Configuration migrations: Automatic with prompts
