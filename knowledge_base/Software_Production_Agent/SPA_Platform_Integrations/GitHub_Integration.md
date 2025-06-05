
# GitHub Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Repository Setup](#repository-setup)
4. [Workflow Automation](#workflow-automation)
5. [CI/CD Configuration](#cicd-configuration)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Overview

GitHub integration is a cornerstone of the S.P.A. ecosystem, providing version control, collaboration, and automated deployment capabilities. This guide covers complete setup and configuration of GitHub with S.P.A. System, including repository management, workflow automation, and CI/CD pipelines.

### Key Benefits
- **Automated Workflows**: GitHub Actions integration for CI/CD
- **Version Control**: Complete project history and collaboration
- **Quality Gates**: Automated code review and testing
- **Deployment Automation**: Seamless deployment to production
- **Team Collaboration**: Issue tracking and project management

## Prerequisites

### Required Accounts and Permissions
- **GitHub Account**: Free or paid account
- **Repository Access**: Admin permissions for target repositories
- **GitHub Actions**: Enabled for your repositories
- **Personal Access Token**: With appropriate scopes

### System Requirements
- Git 2.25+ installed locally
- SSH key configured for GitHub (recommended)
- Command line access
- S.P.A. System properly installed

### Knowledge Prerequisites
- Basic Git commands and concepts
- Understanding of YAML syntax
- Familiarity with GitHub interface
- Basic command line usage

## Repository Setup

### Step 1: Create Personal Access Token

1. **Navigate to GitHub Settings**:
   - Go to GitHub.com → Settings → Developer settings
   - Click "Personal access tokens" → "Tokens (classic)"
   - Click "Generate new token (classic)"

2. **Configure Token Permissions**:
   ```
   Required Scopes:
   ✓ repo (Full control of private repositories)
   ✓ workflow (Update GitHub Action workflows)
   ✓ admin:repo_hook (Admin access to repository hooks)
   ✓ delete_repo (Delete repositories - optional)
   ✓ user:email (Access user email addresses)
   ```

3. **Save Token Securely**:
   ```bash
   # Store in environment variables
   export GITHUB_TOKEN="ghp_your_token_here"
   export GITHUB_USERNAME="your_username"
   
   # Add to shell profile for persistence
   echo 'export GITHUB_TOKEN="ghp_your_token_here"' >> ~/.bashrc
   echo 'export GITHUB_USERNAME="your_username"' >> ~/.bashrc
   source ~/.bashrc
   ```

### Step 2: Configure Git Locally

```bash
# Set global Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Configure credential helper
git config --global credential.helper store

# Test authentication
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

### Step 3: Create S.P.A. Repository Template

1. **Create Repository from Template**:
   ```bash
   # Using GitHub CLI (recommended)
   gh repo create my-spa-project --template spa-system/spa-template --private
   
   # Or using curl
   curl -X POST \
     -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/repos/spa-system/spa-template/generate \
     -d '{"owner":"your_username","name":"my-spa-project","private":true}'
   ```

2. **Clone and Initialize**:
   ```bash
   # Clone the repository
   git clone https://github.com/your_username/my-spa-project.git
   cd my-spa-project
   
   # Initialize S.P.A. configuration
   cp -r ~/SPA_System/Templates/project-template/* .
   git add .
   git commit -m "Initialize S.P.A. project structure"
   git push origin main
   ```

## Workflow Automation

### GitHub Actions Setup

1. **Create Workflow Directory**:
   ```bash
   mkdir -p .github/workflows
   ```

2. **S.P.A. CI/CD Workflow**:
   Create `.github/workflows/spa-ci-cd.yml`:
   ```yaml
   name: S.P.A. CI/CD Pipeline
   
   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]
   
   env:
     NODE_VERSION: '18'
     PYTHON_VERSION: '3.9'
   
   jobs:
     quality-gates:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout code
           uses: actions/checkout@v4
   
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: ${{ env.NODE_VERSION }}
             cache: 'npm'
   
         - name: Setup Python
           uses: actions/setup-python@v4
           with:
             python-version: ${{ env.PYTHON_VERSION }}
   
         - name: Install dependencies
           run: |
             npm ci
             pip install -r requirements.txt
   
         - name: Run S.P.A. Quality Gates
           run: |
             npm run spa:lint
             npm run spa:security-check
             npm run spa:test
             npm run spa:build
   
         - name: Upload test results
           uses: actions/upload-artifact@v3
           if: always()
           with:
             name: test-results
             path: |
               coverage/
               test-results/
   
     deploy:
       needs: quality-gates
       runs-on: ubuntu-latest
       if: github.ref == 'refs/heads/main'
       steps:
         - name: Checkout code
           uses: actions/checkout@v4
   
         - name: Deploy to Netlify
           uses: netlify/actions/cli@master
           with:
             args: deploy --prod --dir=dist
           env:
             NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
             NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
   ```

3. **Quality Gates Workflow**:
   Create `.github/workflows/quality-gates.yml`:
   ```yaml
   name: S.P.A. Quality Gates
   
   on:
     push:
       branches: [ '**' ]
     pull_request:
       branches: [ main, develop ]
   
   jobs:
     code-quality:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '18'
             cache: 'npm'
   
         - name: Install dependencies
           run: npm ci
   
         - name: ESLint
           run: npm run lint
   
         - name: Prettier
           run: npm run format:check
   
         - name: TypeScript Check
           run: npm run type-check
   
     security-scan:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         
         - name: Run Snyk Security Scan
           uses: snyk/actions/node@master
           env:
             SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
   
         - name: OWASP Dependency Check
           run: |
             npm audit --audit-level moderate
   
     performance-test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '18'
             cache: 'npm'
   
         - name: Install dependencies
           run: npm ci
   
         - name: Build application
           run: npm run build
   
         - name: Lighthouse CI
           run: |
             npm install -g @lhci/cli@0.12.x
             lhci autorun
   ```

## CI/CD Configuration

### Environment Setup

1. **Repository Secrets**:
   Go to Repository Settings → Secrets and variables → Actions:
   ```
   Required Secrets:
   - NETLIFY_AUTH_TOKEN: Your Netlify personal access token
   - NETLIFY_SITE_ID: Your Netlify site ID
   - SNYK_TOKEN: Snyk security scanning token (optional)
   - DATABASE_URL: Production database connection (if applicable)
   - API_KEYS: Any required API keys for your application
   ```

2. **Environment Variables**:
   Create `.github/workflows/env.yml`:
   ```yaml
   env:
     NODE_ENV: production
     BUILD_PATH: ./dist
     PUBLIC_URL: https://your-app.netlify.app
   ```

### Branch Protection Rules

1. **Configure Branch Protection**:
   ```bash
   # Using GitHub CLI
   gh api repos/:owner/:repo/branches/main/protection \
     --method PUT \
     --field required_status_checks='{"strict":true,"contexts":["quality-gates"]}' \
     --field enforce_admins=true \
     --field required_pull_request_reviews='{"required_approving_review_count":1}' \
     --field restrictions=null
   ```

2. **Required Checks**:
   - S.P.A. Quality Gates must pass
   - Code review required
   - Up-to-date branches required
   - Admin enforcement enabled

### Deployment Strategies

1. **Staging Environment**:
   ```yaml
   # .github/workflows/staging-deploy.yml
   name: Deploy to Staging
   
   on:
     push:
       branches: [ develop ]
   
   jobs:
     deploy-staging:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         
         - name: Deploy to Staging
           run: |
             # Deploy to staging environment
             netlify deploy --dir=dist --alias=staging
   ```

2. **Production Deployment**:
   ```yaml
   # Production deployment on main branch
   on:
     push:
       branches: [ main ]
     release:
       types: [ published ]
   ```

## Best Practices

### Repository Structure
```
my-spa-project/
├── .github/
│   ├── workflows/
│   │   ├── spa-ci-cd.yml
│   │   ├── quality-gates.yml
│   │   └── staging-deploy.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── src/
├── tests/
├── docs/
├── .spa/
│   ├── config.yml
│   └── quality-gates.yml
├── package.json
├── README.md
└── .gitignore
```

### Commit Message Standards
```bash
# Use conventional commits
feat: add user authentication system
fix: resolve login redirect issue
docs: update API documentation
test: add unit tests for user service
refactor: optimize database queries
```

### Pull Request Workflow
1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/user-authentication
   git push -u origin feature/user-authentication
   ```

2. **Development Process**:
   - Make small, focused commits
   - Run local quality gates before pushing
   - Keep PRs small and reviewable
   - Include tests for new features

3. **Review Process**:
   - Automated quality gates must pass
   - At least one code review required
   - Address all feedback before merging
   - Use squash and merge for clean history

### Security Considerations
- Never commit secrets or API keys
- Use GitHub Secrets for sensitive data
- Enable vulnerability alerts
- Regular dependency updates
- Code scanning with CodeQL

## Troubleshooting

### Common Issues and Solutions

**Problem**: GitHub Actions workflow fails with permission errors
**Solution**:
```bash
# Check token permissions
curl -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/user

# Verify repository access
gh repo view your_username/your_repo
```

**Problem**: Quality gates failing on valid code
**Solution**:
```bash
# Run quality gates locally
npm run spa:lint -- --fix
npm run spa:format
npm run spa:test

# Check specific failing rules
npm run spa:lint -- --debug
```

**Problem**: Deployment fails with build errors
**Solution**:
```bash
# Test build locally
npm run build

# Check environment variables
echo $NODE_ENV
echo $PUBLIC_URL

# Verify dependencies
npm ci
npm audit fix
```

**Problem**: Branch protection preventing merges
**Solution**:
- Ensure all required checks pass
- Get required code reviews
- Update branch with latest main
- Check admin settings if needed

### Performance Optimization

1. **Workflow Optimization**:
   ```yaml
   # Cache dependencies
   - name: Cache node modules
     uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   
   # Parallel job execution
   strategy:
     matrix:
       node-version: [16, 18, 20]
   ```

2. **Build Optimization**:
   ```bash
   # Use npm ci instead of npm install
   npm ci
   
   # Enable build caching
   npm run build -- --cache
   ```

### Monitoring and Alerts

1. **Workflow Notifications**:
   ```yaml
   # Add Slack notifications
   - name: Slack Notification
     uses: 8398a7/action-slack@v3
     with:
       status: ${{ job.status }}
       channel: '#deployments'
     env:
       SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
   ```

2. **Performance Monitoring**:
   - Enable GitHub Insights
   - Monitor workflow run times
   - Track deployment frequency
   - Monitor failure rates

This comprehensive GitHub integration ensures your S.P.A. projects maintain high quality standards while enabling rapid, reliable deployment cycles.
