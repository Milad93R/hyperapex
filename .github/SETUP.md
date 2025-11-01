# CI/CD Setup Instructions

## GitHub Secrets Configuration

For better security, add your Vercel token as a GitHub Secret:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

### Required Secrets

- **VERCEL_TOKEN**: Your Vercel API token (`5IJ813gfeVQBN6Z3glEzkKkv`)
  - This token is used to authenticate deployments to Vercel
  - Once added as a secret, the workflow will use it automatically
  - Remove the hardcoded fallback token from the workflow file after adding the secret

### Optional Secrets (if linking a different project)

- **VERCEL_ORG_ID**: Your Vercel organization ID (optional, auto-detected from `.vercel/project.json`)
- **VERCEL_PROJECT_ID**: Your Vercel project ID (optional, auto-detected from `.vercel/project.json`)

## How It Works

1. **Trigger**: The workflow runs automatically when code is pushed to the `main` branch
2. **Build**: First, it installs dependencies and builds the project to catch any errors
3. **Deploy**: If the build succeeds, it deploys to Vercel production

## Manual Trigger

You can also trigger the workflow manually:
- Go to **Actions** tab in GitHub
- Select **CI/CD Pipeline**
- Click **Run workflow**

