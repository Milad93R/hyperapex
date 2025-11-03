#!/bin/bash

# Script to sync all environment variables from .env to Vercel
# This script reads .env file and adds/updates all variables in Vercel
# Usage: ./sync-env-to-vercel.sh [--skip-vercel-token] [--environments production,preview,development]

set -e
# Allow arithmetic expansion to return non-zero without exiting
set +o errexit

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
ENV_FILE=".env"
ENVIRONMENTS=("production" "preview" "development")
SKIP_VERCEL_TOKEN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-vercel-token)
      SKIP_VERCEL_TOKEN=true
      shift
      ;;
    --environments)
      IFS=',' read -ra ENVIRONMENTS <<< "$2"
      shift 2
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Usage: $0 [--skip-vercel-token] [--environments production,preview,development]"
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
  echo -e "${YELLOW}WARNING:${NC} $1"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_info() {
  echo -e "${CYAN}ℹ${NC} $1"
}

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
  print_error ".env file not found: $ENV_FILE"
  exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null && ! command -v npx vercel &> /dev/null; then
  print_error "Vercel CLI not found. Please install it: npm install -g vercel"
  exit 1
fi

# Function to parse .env file and extract key-value pairs
# Skips comments, empty lines, and handles quoted values
parse_env_file() {
  local env_file="$1"
  while IFS= read -r line || [ -n "$line" ]; do
    # Skip empty lines
    [[ -z "$line" ]] && continue
    
    # Skip comments
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    
    # Skip lines that don't contain =
    [[ ! "$line" =~ = ]] && continue
    
    # Extract key and value
    local key=$(echo "$line" | cut -d'=' -f1 | xargs)
    local value=$(echo "$line" | cut -d'=' -f2- | xargs)
    
    # Skip if key is empty
    [[ -z "$key" ]] && continue
    
    # Skip VERCEL_TOKEN if skip flag is set
    if [[ "$SKIP_VERCEL_TOKEN" == true && "$key" == "VERCEL_TOKEN" ]]; then
      continue
    fi
    
    # Print key-value pair (value might contain special chars, so we output it carefully)
    echo "$key|$value"
  done < "$env_file"
}

# Function to add/update environment variable in Vercel
add_env_var() {
  local var_name="$1"
  local var_value="$2"
  local env="$3"
  
  # Use echo to pipe the value to vercel env add
  # Vercel CLI will update if it exists, add if it doesn't
  echo "$var_value" | npx vercel env add "$var_name" "$env" 2>&1 | grep -v "Vercel CLI" | grep -v "Common next commands" || true
}

print_step "Syncing environment variables from .env to Vercel"

# Get Vercel token if not skipping
VERCEL_TOKEN_VALUE=""
if [[ "$SKIP_VERCEL_TOKEN" != true ]]; then
  # Try to get Vercel token from .env first
  if grep -q "^VERCEL_TOKEN=" "$ENV_FILE" 2>/dev/null; then
    VERCEL_TOKEN_VALUE=$(grep "^VERCEL_TOKEN=" "$ENV_FILE" | cut -d'=' -f2- | xargs)
    print_info "Found VERCEL_TOKEN in .env file"
  else
    # Try to get from Vercel CLI config or environment
    # Check if already set in environment
    if [ -n "$VERCEL_TOKEN" ]; then
      VERCEL_TOKEN_VALUE="$VERCEL_TOKEN"
      print_info "Found VERCEL_TOKEN in environment"
    elif [ -f "$HOME/.vercel/auth.json" ]; then
      print_info "Trying to get Vercel token from CLI auth config..."
      # Vercel CLI stores token in auth.json (newer format)
      VERCEL_TOKEN_VALUE=$(cat "$HOME/.vercel/auth.json" 2>/dev/null | grep -o '"token":"[^"]*' | cut -d'"' -f4 | head -1 || echo "")
    elif [ -f "$HOME/.vercel/token.json" ]; then
      print_info "Trying to get Vercel token from CLI token config..."
      # Older format or alternative location
      VERCEL_TOKEN_VALUE=$(cat "$HOME/.vercel/token.json" 2>/dev/null | grep -o '"token":"[^"]*' | cut -d'"' -f4 | head -1 || echo "")
    fi
    
    if [ -z "$VERCEL_TOKEN_VALUE" ]; then
      print_warning "VERCEL_TOKEN not found in .env or Vercel CLI config"
      print_info "You can add it to .env file as: VERCEL_TOKEN=your-token-here"
    else
      print_info "Found Vercel token in CLI config"
    fi
  fi
  
  # Export Vercel token for Vercel CLI
  if [ -n "$VERCEL_TOKEN_VALUE" ]; then
    export VERCEL_TOKEN="$VERCEL_TOKEN_VALUE"
    print_success "Vercel token configured"
  fi
fi

# Count variables
TOTAL_VARS=0
while IFS='|' read -r key value || [ -n "$key" ]; do
  [[ -n "$key" ]] && TOTAL_VARS=$((TOTAL_VARS + 1)) || true
done < <(parse_env_file "$ENV_FILE")

print_info "Found $TOTAL_VARS environment variable(s) to sync"
print_info "Environments: ${ENVIRONMENTS[*]}"
echo ""

# Process each variable
SYNCED_COUNT=0
FAILED_COUNT=0

while IFS='|' read -r var_name var_value || [ -n "$var_name" ]; do
  [[ -z "$var_name" ]] && continue
  
  print_info "Processing: ${CYAN}$var_name${NC}"
  
  # Sync to each environment
  for env in "${ENVIRONMENTS[@]}"; do
    if add_env_var "$var_name" "$var_value" "$env" > /dev/null 2>&1; then
      print_success "  ✓ Added/updated in $env"
      SYNCED_COUNT=$((SYNCED_COUNT + 1))
    else
      print_warning "  ✗ Failed to add/update in $env (may already exist)"
      # Try again with update approach
      if echo "$var_value" | npx vercel env add "$var_name" "$env" --force 2>&1 | grep -v "Vercel CLI" | grep -v "Common next commands" > /dev/null 2>&1; then
        print_success "  ✓ Updated in $env (force)"
        SYNCED_COUNT=$((SYNCED_COUNT + 1))
      else
        FAILED_COUNT=$((FAILED_COUNT + 1))
      fi
    fi
  done
  
  echo ""
done < <(parse_env_file "$ENV_FILE")

# Summary
print_step "Sync Summary"
echo -e "Total variables: ${CYAN}$TOTAL_VARS${NC}"
echo -e "Successfully synced: ${GREEN}$SYNCED_COUNT${NC}"
if [ $FAILED_COUNT -gt 0 ]; then
  echo -e "Failed: ${RED}$FAILED_COUNT${NC}"
fi

echo ""
print_info "Environment variables have been synced to Vercel"
print_info "Note: You may need to redeploy for changes to take effect"
print_info "Run: ${CYAN}npx vercel --prod${NC} to redeploy"

echo ""
echo -e "${GREEN}✅ Done!${NC}"

