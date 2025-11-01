# How to View Environment Variables in Vercel Dashboard

## Quick Access Steps

### 1. **Login to Vercel**
   - Go to: https://vercel.com/login
   - Sign in with your account

### 2. **Navigate to Your Project**
   - Go to: https://vercel.com/dashboard
   - Find and click on your project: **apex**

### 3. **Open Settings**
   - Click on the **Settings** tab (top navigation)

### 4. **View Environment Variables**
   - In the left sidebar, click on **Environment Variables**
   - You'll see all your configured environment variables listed here

## What You'll See

```
Environment Variables for apex

Production Environment:
✅ API_KEY          [••••••••]  Encrypted
✅ SWAGGER_USERNAME [••••••••]  Encrypted  
✅ SWAGGER_PASSWORD [••••••••]  Encrypted
✅ DEBUG_SECRET     [••••••••]  Encrypted

Preview Environment:
✅ API_KEY          [••••••••]  Encrypted
✅ SWAGGER_USERNAME [••••••••]  Encrypted
✅ SWAGGER_PASSWORD [••••••••]  Encrypted
✅ DEBUG_SECRET     [••••••••]  Encrypted

Development Environment:
✅ API_KEY          [••••••••]  Encrypted
✅ SWAGGER_USERNAME [••••••••]  Encrypted
✅ SWAGGER_PASSWORD [••••••••]  Encrypted
✅ DEBUG_SECRET     [••••••••]  Encrypted
```

## Direct URL

You can access it directly at:
```
https://vercel.com/[your-team]/apex/settings/environment-variables
```

Or navigate:
1. Dashboard → Your Project → Settings → Environment Variables

## What You Can Do

### View Variables
- See all environment variables for each environment (Production, Preview, Development)
- Variables are shown as encrypted (for security)

### Edit Variables
- Click on any variable name to edit its value
- You can change which environments it applies to
- Update values as needed

### Add New Variables
- Click **Add New** button
- Enter variable name and value
- Select which environments to apply to
- Click **Save**

### Delete Variables
- Click the **...** menu next to any variable
- Select **Delete**

### View Variable History
- Some plans show when variables were last updated
- Useful for tracking changes

## Important Notes

⚠️ **Security:**
- Values are encrypted and hidden (shown as `[••••••••]`)
- You can only see/edit values, not view plain text for security
- Changes take effect on next deployment

⚠️ **Deployment Required:**
- After adding/editing variables, you need to **redeploy** for changes to take effect
- You can trigger a redeploy from the Deployments tab

## Quick Actions

### Trigger Redeploy After Changing Variables
1. Go to **Deployments** tab
2. Click **...** on the latest deployment
3. Select **Redeploy**

Or via CLI:
```bash
vercel --prod
```

## Alternative: View via CLI

If you prefer command line:
```bash
# List all environment variables
npx vercel env ls

# Pull environment variables to local .env file (for local dev)
npx vercel env pull
```

## Troubleshooting

### Can't find Environment Variables?
- Make sure you're in the correct project (apex)
- Check you're in Settings → Environment Variables (not Project Settings)
- Verify you have the correct permissions (project owner/admin)

### Variables not working after setting?
- Wait for the next deployment (or trigger a redeploy)
- Check variable names match exactly (case-sensitive)
- Verify variables are enabled for the correct environment

