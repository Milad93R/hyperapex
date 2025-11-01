#!/bin/bash

# Deployment script for hyperapex project on Vercel
# Usage: ./deploy.sh [--token YOUR_TOKEN] [--skip-build] [--preview]

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="hyperapex"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
SKIP_BUILD=false
DEPLOY_TO_PREVIEW=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --token)
      VERCEL_TOKEN="$2"
      shift 2
      ;;
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --preview)
      DEPLOY_TO_PREVIEW=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Usage: $0 [--token YOUR_TOKEN] [--skip-build] [--preview]"
      exit 1
      ;;
  esac
done

# Function to print colored messages
print_step() {
  echo -e "\n${BLUE}==>${NC} ${GREEN}$1${NC}\n"
}

print_error() {
  echo -e "\n${RED}ERROR:${NC} $1\n"
}

print_warning() {
  echo -e "\n${YELLOW}WARNING:${NC} $1\n"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
  print_step "Checking Vercel CLI installation..."
  if ! command -v vercel &> /dev/null && ! command -v npx vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel@latest || {
      print_error "Failed to install Vercel CLI"
      exit 1
    }
  fi
  echo -e "${GREEN}✓${NC} Vercel CLI is available"
}

# Check if project is linked
check_project_link() {
  print_step "Checking project linkage..."
  if [ ! -f ".vercel/project.json" ]; then
    print_warning "Project not linked. Linking to $PROJECT_NAME..."
    if [ -n "$VERCEL_TOKEN" ]; then
      npx vercel@latest link --project "$PROJECT_NAME" --yes --token "$VERCEL_TOKEN" || {
        print_error "Failed to link project"
        exit 1
      }
    else
      npx vercel@latest link --project "$PROJECT_NAME" --yes || {
        print_error "Failed to link project. Try with --token option"
        exit 1
      }
    fi
  else
    LINKED_PROJECT=$(cat .vercel/project.json | grep -o '"projectName":"[^"]*"' | cut -d'"' -f4)
    if [ "$LINKED_PROJECT" != "$PROJECT_NAME" ]; then
      print_warning "Project linked to '$LINKED_PROJECT', but we need '$PROJECT_NAME'"
      print_step "Re-linking to $PROJECT_NAME..."
      if [ -n "$VERCEL_TOKEN" ]; then
        npx vercel@latest link --project "$PROJECT_NAME" --yes --token "$VERCEL_TOKEN" || {
          print_error "Failed to link project"
          exit 1
        }
      else
        npx vercel@latest link --project "$PROJECT_NAME" --yes || {
          print_error "Failed to link project. Try with --token option"
          exit 1
        }
      fi
    else
      echo -e "${GREEN}✓${NC} Project is linked to $PROJECT_NAME"
    fi
  fi
}

# Build the project
build_project() {
  if [ "$SKIP_BUILD" = true ]; then
    print_warning "Skipping build (--skip-build flag set)"
    return
  fi

  print_step "Building project..."
  if ! npm run build; then
    print_error "Build failed. Please fix the errors and try again."
    exit 1
  fi
  echo -e "${GREEN}✓${NC} Build completed successfully"
}

# Check environment variables (optional)
check_env_vars() {
  print_step "Checking environment variables in Vercel..."
  
  if [ -n "$VERCEL_TOKEN" ]; then
    ENV_VARS=$(npx vercel@latest env ls --token "$VERCEL_TOKEN" 2>/dev/null || echo "")
    if [ -z "$ENV_VARS" ]; then
      print_warning "Could not fetch environment variables. They may need to be set in Vercel dashboard."
      echo "Required variables:"
      echo "  - API_KEY"
      echo "  - SWAGGER_USERNAME"
      echo "  - SWAGGER_PASSWORD"
      echo "  - DEBUG_SECRET"
      echo "  - TELEGRAM_BOT_TOKEN (optional)"
      echo "  - TELEGRAM_GROUP_ID (optional)"
      echo ""
      echo "Visit: https://vercel.com/dashboard"
    else
      echo -e "${GREEN}✓${NC} Environment variables are configured"
      echo "$ENV_VARS"
    fi
  else
    print_warning "No Vercel token provided. Cannot check environment variables."
    echo "Set them manually at: https://vercel.com/dashboard"
  fi
}

# Deploy to Vercel
deploy_to_vercel() {
  print_step "Deploying to Vercel..."
  
  DEPLOY_FLAGS="--yes"
  if [ "$DEPLOY_TO_PREVIEW" = true ]; then
    DEPLOY_FLAGS="$DEPLOY_FLAGS"
    echo "Deploying to preview environment..."
  else
    DEPLOY_FLAGS="$DEPLOY_FLAGS --prod"
    echo "Deploying to production..."
  fi

  if [ -n "$VERCEL_TOKEN" ]; then
    DEPLOY_OUTPUT=$(npx vercel@latest $DEPLOY_FLAGS --token "$VERCEL_TOKEN" 2>&1)
  else
    DEPLOY_OUTPUT=$(npx vercel@latest $DEPLOY_FLAGS 2>&1)
  fi

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Deployment successful!"
    echo "$DEPLOY_OUTPUT"
    
    # Extract deployment URL
    DEPLOYMENT_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^ ]*\.vercel\.app' | head -1)
    if [ -n "$DEPLOYMENT_URL" ]; then
      echo ""
      echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
      echo -e "${GREEN}🚀 Deployment URL:${NC} $DEPLOYMENT_URL"
      echo -e "${GREEN}📚 API Docs:${NC} $DEPLOYMENT_URL/api/docs"
      echo -e "${GREEN}🔧 API Endpoint:${NC} $DEPLOYMENT_URL/api"
      echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    fi
  else
    print_error "Deployment failed"
    echo "$DEPLOY_OUTPUT"
    exit 1
  fi
}

# Main execution
main() {
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║   Hyperapex Vercel Deployment Script    ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
  echo ""

  # Check if we're in the project directory
  if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
  fi

  check_vercel_cli
  check_project_link
  build_project
  check_env_vars
  deploy_to_vercel

  echo ""
  echo -e "${GREEN}✓${NC} All done! Your project is deployed."
  echo ""
}

# Run main function
main

