# Environment Variables Setup

## Why `.env` is not in GitHub

The `.env` file contains **sensitive credentials** (API keys, passwords, secrets) and is correctly excluded from git via `.gitignore` for security.

## Setting Up Environment Variables

### For Local Development

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** with your actual values:
   ```env
   API_KEY=your-actual-api-key
   SWAGGER_USERNAME=admin
   SWAGGER_PASSWORD=your-secure-password
   DEBUG_SECRET=your-debug-secret
   CUSTOM_DOMAIN=your-domain.com  # Optional
   ```

### For Vercel Deployment

Environment variables must be set in the **Vercel Dashboard** or via CLI:

#### Option 1: Vercel Dashboard (Recommended)

1. Go to your project: https://vercel.com/dashboard
2. Select your project: **apex**
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - `API_KEY` = your-api-key
   - `SWAGGER_USERNAME` = admin
   - `SWAGGER_PASSWORD` = your-password
   - `DEBUG_SECRET` = your-debug-secret
   - `CUSTOM_DOMAIN` = your-domain.com (optional)
5. Select environments: **Production**, **Preview**, **Development**
6. Click **Save**
7. **Redeploy** your project for changes to take effect

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add API_KEY production
vercel env add SWAGGER_USERNAME production
vercel env add SWAGGER_PASSWORD production
vercel env add DEBUG_SECRET production
vercel env add CUSTOM_DOMAIN production  # Optional

# For preview/development environments, add without 'production':
vercel env add API_KEY preview
vercel env add SWAGGER_USERNAME preview
# ... etc
```

## Required Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `API_KEY` | API key for authentication | Yes | - |
| `SWAGGER_USERNAME` | Swagger UI basic auth username | Yes | admin |
| `SWAGGER_PASSWORD` | Swagger UI basic auth password | Yes | admin123 |
| `DEBUG_SECRET` | Secret for enabling debug mode | Yes | - |
| `CUSTOM_DOMAIN` | Custom domain for OpenAPI spec | No | - |

## Verifying Environment Variables

### Local Development
```bash
# The /api/debug-env endpoint shows your env config
curl http://localhost:3168/api/debug-env
```

### Production (Vercel)
Visit: `https://your-app.vercel.app/api/debug-env`

**Note:** This endpoint shows configuration status without exposing actual values (for security).

## Security Best Practices

✅ **DO:**
- Keep `.env` in `.gitignore` (already configured)
- Use strong, unique values for production
- Set different values for development/production
- Use Vercel's environment variable feature for deployments
- Regularly rotate secrets

❌ **DON'T:**
- Commit `.env` files to git
- Share `.env` files via email/messaging
- Use weak passwords or default values in production
- Expose environment variables in client-side code

## Troubleshooting

### "Environment variable not found" errors

1. **Check Vercel Dashboard:**
   - Ensure variables are set in the correct environment (Production/Preview/Development)
   - Verify variable names match exactly (case-sensitive)

2. **Redeploy after adding variables:**
   - Variables are injected at build time
   - New variables require a new deployment

3. **Check `/api/debug-env`:**
   - This endpoint shows which variables are configured
   - Useful for debugging configuration issues

### Build fails on Vercel

- Ensure all **required** variables are set
- Check variable names for typos
- Verify variables are enabled for the correct environment

## Quick Setup Checklist

- [ ] `.env.example` exists in the repository (template)
- [ ] Created `.env` locally (not committed to git)
- [ ] Set all environment variables in Vercel Dashboard
- [ ] Verified with `/api/debug-env` endpoint
- [ ] Tested deployment on Vercel

