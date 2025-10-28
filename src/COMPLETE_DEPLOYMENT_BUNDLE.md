# 🚀 Complete Deployment Bundle for Solana Summit Africa PFP Creator

This file contains EVERYTHING you need to deploy to Vercel successfully.

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Create New GitHub Repository

1. Go to https://github.com/new
2. Repository name: `solana-summit-pfp-creator` (or whatever you want)
3. Set to **Public** or **Private**
4. **DO NOT** check "Add README" or "Add .gitignore" - leave them unchecked
5. Click **"Create repository"**

### Step 2: Upload Files to GitHub

You'll upload ALL files from your Figma Make project. Here's how:

#### Option A: Using GitHub Web Interface (Recommended)

1. **Download ALL files** from Figma Make as a ZIP
2. **Extract the ZIP** on your computer
3. Go to your new empty GitHub repository
4. Click **"uploading an existing file"** link (or "Add file" → "Upload files")
5. **Drag ALL folders and files** from the extracted folder into GitHub
6. Commit message: `Initial commit - Solana Summit PFP Creator`
7. Click **"Commit changes"**

#### Option B: Using GitHub Desktop (if you have it)

1. Clone the new repo
2. Copy all files from Figma Make
3. Commit and push

### Step 3: Create Critical Root Files on GitHub

After uploading, you need to add these three critical files **in the root directory**:

---

## 📄 FILE 1: `.npmrc`

**How to create:**
1. In your GitHub repo, click **"Add file"** → **"Create new file"**
2. Filename: `.npmrc` (with the dot at the start!)
3. Paste this content:

```
registry=https://registry.npmjs.org/
@supabase:registry=https://registry.npmjs.org/
auto-install-peers=true
legacy-peer-deps=false
```

4. Commit message: `Add .npmrc`
5. Click **"Commit new file"**

---

## 📄 FILE 2: `.gitignore`

**How to create:**
1. Click **"Add file"** → **"Create new file"**
2. Filename: `.gitignore` (with the dot!)
3. Paste this content:

```
# Dependencies
node_modules

# Build output
dist
dist-ssr
*.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.production.local
.env.development.local

# Vercel
.vercel
```

4. Commit message: `Add .gitignore`
5. Click **"Commit new file"**

---

## 📄 FILE 3: `.vercelignore`

**How to create:**
1. Click **"Add file"** → **"Create new file"**
2. Filename: `.vercelignore`
3. Paste this content:

```
*.md
!README.md
guidelines/
.github/
```

4. Commit message: `Add .vercelignore`
5. Click **"Commit new file"**

---

## 🔧 VERIFY/UPDATE THESE FILES

Make sure these files have the EXACT content shown below:

### `package.json`

Click on `package.json` in your repo, then click the pencil icon to edit. Make sure it looks EXACTLY like this:

```json
{
  "name": "solana-summit-africa-pfp",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "2.45.4",
    "canvas-confetti": "1.9.3",
    "lucide-react": "0.400.0",
    "motion": "10.16.2",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.6.4",
    "@types/node": "^20.11.5",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.11"
  }
}
```

**Important:** Notice there are NO `^` symbols in the dependencies section (only in devDependencies).

---

### `vercel.json`

Click on `vercel.json`, edit it, and make sure it's EXACTLY:

```json
{
  "buildCommand": "npm install --registry=https://registry.npmjs.org/ && npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install --registry=https://registry.npmjs.org/ --no-package-lock"
}
```

---

### `vite.config.ts`

Verify this file exists and contains:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import figmaAssetsPlugin from './vite-plugin-figma-assets'

export default defineConfig({
  plugins: [react(), figmaAssetsPlugin()],
  resolve: {
    alias: {
      './components': '/components',
      './utils': '/utils',
      './imports': '/imports',
      './styles': '/styles',
    },
  },
  server: {
    port: 5173,
  },
})
```

---

## 🎯 Step 4: Connect to Vercel

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. **Import** your GitHub repository
4. Vercel will auto-detect settings

### Configure Environment Variables:

Click **"Environment Variables"** and add these:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://wzywxhmdhzapmjurlxqw.supabase.co`

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: (your Supabase anon key from Figma Make)

### Build Settings:

Vercel should auto-detect these from `vercel.json`, but verify:
- **Framework Preset:** Vite
- **Build Command:** `npm install --registry=https://registry.npmjs.org/ && npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install --registry=https://registry.npmjs.org/ --no-package-lock`

4. Click **"Deploy"**

---

## ✅ Expected Result:

You should see:

```
✓ Installing dependencies
✓ npm install --registry=https://registry.npmjs.org/
✓ Installing @supabase/supabase-js@2.45.4
✓ All dependencies installed
✓ Running build command
✓ tsc && vite build
✓ Building Vite project
✓ Build completed successfully
✓ Deployment successful
```

---

## 🐛 Troubleshooting

### If you still get the JSR error:

1. **Check that `.npmrc` exists:**
   - Go to your GitHub repo
   - You should see `.gitignore` and `.npmrc` in the file list at the root
   - If not, you need to create them (see above)

2. **Check file contents:**
   - Click on `.npmrc` 
   - Make sure it has the exact content shown above
   - No extra spaces or characters

3. **Clear Vercel cache:**
   - In Vercel, go to Settings → General
   - Scroll to "Build & Development Settings"
   - Click "Clear Cache"
   - Try deploying again

4. **Manual redeploy:**
   - Go to Deployments tab
   - Click "..." menu on latest deployment
   - Click "Redeploy"
   - **UNCHECK** "Use existing Build Cache"
   - Click "Redeploy"

### If build succeeds but site doesn't work:

Check browser console for errors. Most likely missing environment variables.

---

## 📦 What Files Should Be in Your GitHub Repo:

**Root level files:**
- ✅ `.npmrc` (hidden, but should appear in file list)
- ✅ `.gitignore` (hidden, but should appear in file list)
- ✅ `.vercelignore` (optional but helpful)
- ✅ `package.json`
- ✅ `vercel.json`
- ✅ `vite.config.ts`
- ✅ `vite-plugin-figma-assets.ts`
- ✅ `tsconfig.json`
- ✅ `tsconfig.node.json`
- ✅ `index.html`
- ✅ `App.tsx`

**Folders:**
- ✅ `components/`
- ✅ `imports/`
- ✅ `public/`
- ✅ `src/`
- ✅ `styles/`
- ✅ `supabase/`
- ✅ `utils/`

---

## 🎉 Success Checklist:

- [ ] New GitHub repo created
- [ ] All files uploaded to GitHub
- [ ] `.npmrc` file created and visible in file list
- [ ] `.gitignore` file created and visible in file list
- [ ] `package.json` has exact versions (no ^ in dependencies)
- [ ] `vercel.json` has registry URL in commands
- [ ] Vercel project created and connected
- [ ] Environment variables added in Vercel
- [ ] Build succeeds without errors
- [ ] Site loads successfully
- [ ] PFP creator works (upload image, download PNG)
- [ ] Counter increments in Supabase

---

## 💡 Pro Tips:

1. **Hidden files on GitHub:** Files starting with `.` are hidden by default in some views, but they WILL show up in the main file list on GitHub if created correctly.

2. **Verify .npmrc is working:** In Vercel build logs, look for:
   ```
   npm install --registry=https://registry.npmjs.org/
   ```
   If you see `@jsr/supabase` anywhere, the `.npmrc` isn't being read.

3. **Nuclear option:** If all else fails, add this to the top of `package.json`:
   ```json
   "packageManager": "npm@10.2.5",
   ```

---

## 🆘 Still Having Issues?

If you complete all steps and still get errors:

1. **Take a screenshot** of:
   - Your GitHub repo file list (showing .npmrc and .gitignore)
   - The Vercel build error logs (the FULL error)
   - Your vercel.json content

2. **Check these common mistakes:**
   - `.npmrc` has extra spaces or wrong content
   - `package.json` still has `^` symbols in dependencies
   - Environment variables not set in Vercel
   - Wrong repository branch selected in Vercel

3. **Last resort - Use npm instead of trying to force the registry:**
   In `vercel.json`, change installCommand to:
   ```json
   "installCommand": "rm -rf node_modules package-lock.json && npm cache clean --force && npm install --registry=https://registry.npmjs.org/ @supabase/supabase-js@2.45.4 canvas-confetti@1.9.3 lucide-react@0.400.0 motion@10.16.2 react@18.2.0 react-dom@18.2.0"
   ```

This bundle should get you deployed! 🚀
