# How to Upload Files to GitHub via Browser

## Quick Fix: Upload vercel.json and package.json

Since .npmrc isn't working, I've updated `vercel.json` and `package.json` to fix the npm registry issue directly.

### Step-by-Step Instructions:

1. **Download these two files from Figma Make:**
   - `vercel.json` 
   - `package.json`

2. **Go to your GitHub repository in your browser**
   - URL: `https://github.com/[your-username]/[your-repo-name]`

3. **For each file (vercel.json and package.json):**
   
   **Method 1: Edit existing file**
   - Click on the filename in the file list
   - Click the **pencil icon** (✏️) at the top right to edit
   - Delete ALL current content
   - Copy the new content from Figma Make
   - Paste it into the editor
   - Scroll down, add commit message: `Fix npm registry for Vercel`
   - Click **"Commit changes"**

   **Method 2: Upload to replace**
   - Click **"Add file"** → **"Upload files"**
   - Drag and drop the files
   - When it asks about replacing, confirm
   - Commit message: `Fix npm registry for Vercel`
   - Click **"Commit changes"**

### What Changed:

**vercel.json** now includes:
```json
{
  "buildCommand": "npm config set registry https://registry.npmjs.org/ && npm install && npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm config set registry https://registry.npmjs.org/ && npm install --registry=https://registry.npmjs.org/"
}
```

This explicitly tells npm to use the official registry during the Vercel build.

**package.json** now has:
- Exact versions (no `^` symbols)
- This prevents npm from trying to resolve versions in weird ways

### After Uploading:

1. **Wait 10 seconds** for GitHub to process the commit

2. **Check Vercel:**
   - Go to vercel.com
   - Click on your project
   - You should see a new deployment starting automatically
   - The build should now succeed!

3. **If it doesn't auto-deploy:**
   - Click "Deployments" tab
   - Click "..." menu on latest deployment
   - Click "Redeploy"
   - **UNCHECK** "Use existing Build Cache" 
   - Click "Redeploy"

### Expected Result:

```
✅ Installing dependencies with registry https://registry.npmjs.org/
✅ npm install --registry=https://registry.npmjs.org/
✅ Installing @supabase/supabase-js@2.45.4
✅ All dependencies installed
✅ Building with Vite
✅ Build completed
✅ Deployment successful
```

### If You Still Get Errors:

1. **Copy the EXACT error message** from Vercel build logs
2. **Share it** so I can see what's happening
3. **Check if files were uploaded:** 
   - Go to your repo on GitHub
   - Click on `package.json` - does it show the new content?
   - Click on `vercel.json` - does it show the new content?

---

## Alternative: Create Files Directly on GitHub

If download/upload isn't working, create them directly:

### Create/Update vercel.json:

1. Go to your repo on GitHub
2. Click `vercel.json` in the file list
3. Click the pencil icon ✏️ to edit
4. Replace ALL content with:
```json
{
  "buildCommand": "npm config set registry https://registry.npmjs.org/ && npm install && npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm config set registry https://registry.npmjs.org/ && npm install --registry=https://registry.npmjs.org/"
}
```
5. Commit changes

### Update package.json:

1. Click `package.json` in the file list
2. Click pencil icon ✏️
3. Find the "dependencies" section
4. Remove ALL `^` symbols from version numbers
5. Make sure `@supabase/supabase-js` is `2.45.4` (not `^2.45.4`)
6. Commit changes

---

## Why This Should Work:

The core issue is that npm was trying to use JSR registry for Supabase instead of the official npm registry.

By putting the registry configuration **directly in the build command**, we:
- ✅ Force npm to use the correct registry
- ✅ Don't rely on .npmrc being present
- ✅ Make it explicit and clear

This should resolve the `@jsr/supabase__supabase-js` error!
