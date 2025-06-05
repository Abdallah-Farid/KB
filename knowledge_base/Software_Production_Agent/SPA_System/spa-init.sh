
#!/bin/bash

# S.P.A. System Initialization Script
# Quick setup script for new projects

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# S.P.A. System banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║    🤖 S.P.A. System - Software Production Agent              ║"
echo "║                                                               ║"
echo "║    Accelerating software development from concept to deploy   ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Check if S.P.A. System directory exists
SPA_SYSTEM_DIR="$HOME/SPA_System"
if [ ! -d "$SPA_SYSTEM_DIR" ]; then
    print_error "S.P.A. System not found at $SPA_SYSTEM_DIR"
    print_status "Please ensure the S.P.A. System is properly installed"
    exit 1
fi

print_status "S.P.A. System found at $SPA_SYSTEM_DIR"

# Function to show available project templates
show_templates() {
    print_header "Available Project Templates"
    echo "1. SaaS MVP - Complete SaaS application with auth and payments"
    echo "2. Web App - Modern single-page application"
    echo "3. API Service - RESTful API with documentation"
    echo "4. Mobile App - Cross-platform mobile application"
    echo "5. Enterprise App - Large-scale enterprise application"
    echo "6. AI Application - AI-powered application template"
    echo "7. E-commerce - Online store platform"
    echo "8. Custom - Start with basic structure"
}

# Function to show available workflows
show_workflows() {
    print_header "Available Workflows"
    echo "1. SPA Development - Single Page Application workflow"
    echo "2. API Development - RESTful API development workflow"
    echo "3. Mobile Development - Mobile app development workflow"
    echo "4. Enterprise Development - Enterprise application workflow"
    echo "5. Microservices - Microservices architecture workflow"
    echo "6. AI Application - AI-powered application workflow"
}

# Function to initialize project
init_project() {
    local project_name="$1"
    local template="$2"
    local workflow="$3"
    
    print_header "Initializing Project: $project_name"
    
    # Create project directory
    if [ -d "$project_name" ]; then
        print_warning "Directory $project_name already exists"
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Project initialization cancelled"
            exit 0
        fi
    fi
    
    mkdir -p "$project_name"
    cd "$project_name"
    
    # Copy template if specified
    case $template in
        "saas_mvp")
            print_status "Copying SaaS MVP template..."
            cp -r "$SPA_SYSTEM_DIR/Project_Templates/Startup_MVP/saas_mvp/"* .
            ;;
        "web_app")
            print_status "Creating web app structure..."
            # Create basic web app structure
            mkdir -p src/{components,pages,styles,utils}
            echo '{"name": "'$project_name'", "version": "1.0.0"}' > package.json
            ;;
        "api_service")
            print_status "Creating API service structure..."
            mkdir -p src/{routes,controllers,models,middleware}
            echo '{"name": "'$project_name'", "version": "1.0.0"}' > package.json
            ;;
        *)
            print_status "Creating basic project structure..."
            mkdir -p src
            echo '{"name": "'$project_name'", "version": "1.0.0"}' > package.json
            ;;
    esac
    
    # Create S.P.A. configuration
    cat > spa.config.json << EOF
{
  "project": {
    "name": "$project_name",
    "type": "$template",
    "workflow": "$workflow"
  },
  "orchestrator": {
    "autoStart": true,
    "defaultWorkflow": "$workflow"
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
  }
}
EOF
    
    # Create basic README
    cat > README.md << EOF
# $project_name

## Overview
This project was initialized using the S.P.A. (Software Production Agent) System.

## Template
- **Type**: $template
- **Workflow**: $workflow

## Getting Started

### Development
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### S.P.A. System Integration
\`\`\`bash
# Start S.P.A. orchestrator (when CLI is available)
spa start

# Run quality gates
spa quality check

# Deploy
spa deploy
\`\`\`

## Project Structure
\`\`\`
$project_name/
├── src/                 # Source code
├── spa.config.json      # S.P.A. System configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
\`\`\`

## S.P.A. System Features
- 🤖 AI-powered development agents
- 📋 Automated task management
- ✅ Built-in quality gates
- 🚀 Streamlined deployment

## Documentation
- [S.P.A. System Guide]($SPA_SYSTEM_DIR/README.md)
- [Quick Start Guide]($SPA_SYSTEM_DIR/QUICK_START.md)
- [Workflow Documentation]($SPA_SYSTEM_DIR/Workflows/README.md)

EOF
    
    # Initialize git repository
    git init
    echo "node_modules/" > .gitignore
    echo ".env" >> .gitignore
    echo "dist/" >> .gitignore
    echo ".spa/" >> .gitignore
    
    git add .
    git commit -m "Initial commit - S.P.A. System project setup"
    
    print_status "Project $project_name initialized successfully!"
    print_status "Location: $(pwd)"
    print_status "Configuration: spa.config.json"
    
    echo -e "\n${GREEN}Next Steps:${NC}"
    echo "1. cd $project_name"
    echo "2. npm install (if using Node.js)"
    echo "3. Follow the README.md for development instructions"
    echo "4. Integrate with your IDE using the S.P.A. guides"
}

# Main script logic
main() {
    if [ $# -eq 0 ]; then
        # Interactive mode
        print_header "S.P.A. System Project Initialization"
        
        # Get project name
        read -p "Enter project name: " project_name
        if [ -z "$project_name" ]; then
            print_error "Project name is required"
            exit 1
        fi
        
        # Show and select template
        show_templates
        echo
        read -p "Select template (1-8): " template_choice
        
        case $template_choice in
            1) template="saas_mvp" ;;
            2) template="web_app" ;;
            3) template="api_service" ;;
            4) template="mobile_app" ;;
            5) template="enterprise_app" ;;
            6) template="ai_application" ;;
            7) template="ecommerce" ;;
            8) template="custom" ;;
            *) template="custom" ;;
        esac
        
        # Show and select workflow
        show_workflows
        echo
        read -p "Select workflow (1-6): " workflow_choice
        
        case $workflow_choice in
            1) workflow="spa_development" ;;
            2) workflow="api_development" ;;
            3) workflow="mobile_development" ;;
            4) workflow="enterprise_development" ;;
            5) workflow="microservices_development" ;;
            6) workflow="ai_development" ;;
            *) workflow="spa_development" ;;
        esac
        
        init_project "$project_name" "$template" "$workflow"
        
    else
        # Command line mode
        case $1 in
            "help"|"-h"|"--help")
                echo "S.P.A. System Initialization Script"
                echo
                echo "Usage:"
                echo "  $0                           # Interactive mode"
                echo "  $0 <project-name> [template] [workflow]"
                echo "  $0 help                      # Show this help"
                echo
                echo "Examples:"
                echo "  $0 my-saas saas_mvp spa_development"
                echo "  $0 my-api api_service api_development"
                ;;
            *)
                project_name="$1"
                template="${2:-custom}"
                workflow="${3:-spa_development}"
                init_project "$project_name" "$template" "$workflow"
                ;;
        esac
    fi
}

# Run main function
main "$@"
