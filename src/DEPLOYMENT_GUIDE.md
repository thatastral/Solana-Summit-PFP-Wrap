# Solana Summit Africa - Deployment Guide for Beginners

This guide will walk you through deploying your Solana Summit Africa PFP frame creator website so it's live on the internet.

## Prerequisites

- A GitHub account (free at [github.com](https://github.com))
- A Vercel account (free at [vercel.com](https://vercel.com) - you can sign up with GitHub)
- Your audio file ready (MP3 format recommended, named `SSummitSong.mp3`)

---

## Step 1: Export Your Project from Figma Make

1. In Figma Make, click the **"Export"** or **"Download"** button
2. Save the ZIP file to your computer
3. **Unzip the folder** - you should see all the files matching the structure shown above

---

## Step 2: Add Your Audio File

1. Navigate to the **`public`** folder in your unzipped project
2. Place your audio file (`SSummitSong.mp3`) directly inside the `public` folder
3. **Important:** The file must be named exactly `SSummitSong.mp3` (case-sensitive)

Your `public` folder should now look like:
```
public/
├── AUDIO_INSTRUCTIONS.md
└── SSummitSong.mp3  ← Your audio file here
```

### Audio File Recommendations:
- **Format:** MP3 (best browser compatibility)
- **Size:** Keep under 5MB for faster loading
- **Length:** 1-3 minutes (it will loop automatically)
- **Quality:** 128-192 kbps is sufficient for background music

---

## Step 3: Upload to GitHub

### Option A: Using GitHub Desktop (Easiest for Beginners)

1. **Download GitHub Desktop** from [desktop.github.com](c)
2. **Install and sign in** with your GitHub account
3. Click **"File" → "Add Local Repository"**
4. Select your unzipped project folder
5. Click **"Create Repository"** if prompted
6. Add a repository name: `solana-summit-africa`
7. Click **"Publish repository"**
8. Make sure **"Keep this code private"** is unchecked (unless you want it private)
9. Click **"Publish Repository"**

### Option B: Using GitHub Website (Alternative)

1. Go to [github.com/new](https://github.com/new)
2. Name your repository: `solana-summit-africa`
3. Leave it **Public**
4. Click **"Create repository"**
5. Follow the instructions to upload your files (you can drag and drop the entire folder)

---

## Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New" → "Project"**
3. **Import your GitHub repository:**
   - Find `solana-summit-africa` in the list
   - Click **"Import"**
4. **Configure your project:**
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist` (should auto-fill)
   - Install Command: `npm install`
5. **Add Environment Variables** (click "Environment Variables" dropdown):
   - Add your Supabase credentials if you haven't already:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **"Deploy"**
7. Wait 2-3 minutes for deployment to complete ⏳

---

## Step 5: Your Site is Live! 🎉

Once deployment completes:
- Vercel will give you a URL like: `https://solana-summit-africa.vercel.app`
- Click on it to see your live site
- Share this URL with anyone!

### Custom Domain (Optional)
You can add a custom domain like `summit.yourdomain.com` in Vercel's project settings.

---

## How the Audio Works

### When Your Site Goes Live:

✅ **Automatic Playback:**
- The audio will attempt to play automatically when someone visits the page
- It plays at 70% volume and loops continuously

⚠️ **Browser Restrictions:**
- Most browsers (Chrome, Safari, Firefox) **block autoplay with sound** until the user interacts with the page
- This means the audio will likely start playing when the visitor clicks anything (upload button, audio toggle, etc.)
- This is a browser security feature and cannot be bypassed

🔊 **Audio Controls:**
- The volume toggle button (top-right corner) lets users mute/unmute
- The audio state persists while they use the page

### Testing Your Audio:

1. **After deployment**, visit your live site
2. You may need to click somewhere on the page first
3. Click the **audio toggle button** (speaker icon) to test mute/unmute
4. Check your browser console (F12 → Console tab) for any audio loading errors

### If Audio Doesn't Play:

1. **Check the file exists:** Make sure `SSummitSong.mp3` is in the `public` folder before deploying
2. **Check the file name:** Must be exactly `SSummitSong.mp3` (case-sensitive)
3. **Redeploy:** If you added the audio file after deploying, you need to push changes and redeploy (GitHub Desktop → Commit → Push → Vercel auto-deploys)
4. **Browser console:** Press F12 and check the Console tab for error messages

---

## Making Updates After Deployment

### If You Need to Change Something:

**Important:** When you make changes in Figma Make, you'll need to export the updated files and replace them in your GitHub repository.

#### Option A: Using GitHub Desktop (Recommended)

1. **Export from Figma Make:**
   - Click **"Export"** or **"Download"** in Figma Make
   - Save and unzip the new version
   
2. **Replace files locally:**
   - Copy the updated files from Figma Make export
   - Paste them into your local project folder (the one connected to GitHub)
   - Overwrite the existing files when prompted
   - **Important:** Keep your `SSummitSong.mp3` file in the `public` folder
   
3. **Push to GitHub using GitHub Desktop:**
   - Open GitHub Desktop
   - It will automatically show all your changes
   - Add a commit message (e.g., "Updated footer spacing and rays positioning")
   - Click **"Commit to main"**
   - Click **"Push origin"** (top bar)
   
4. **Automatic deployment:**
   - Vercel will automatically detect your GitHub changes
   - It will rebuild and redeploy (takes 1-2 minutes)
   - You'll get a notification when deployment is complete
   
5. **View your updates:**
   - Refresh your live URL: `https://[your-project].vercel.app`
   - If changes don't appear, hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

#### Option B: Using GitHub Website

1. Export from Figma Make and unzip
2. Go to your repository on GitHub.com
3. Click **"Add file" → "Upload files"**
4. Drag and drop your updated files
5. Commit the changes
6. Vercel will auto-deploy

#### Option C: Quick File Updates (Single Files Only)

1. Go to your repository on GitHub.com
2. Navigate to the file you want to edit (e.g., `App.tsx`)
3. Click the **pencil icon** (Edit this file)
4. Make your changes directly in the browser
5. Scroll down, add a commit message, click **"Commit changes"**
6. Vercel will auto-deploy

### Monitoring Deployments:

- **Check deployment status:**
  - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
  - Click on your project
  - See recent deployments and their status
  
- **View deployment logs:**
  - Click on any deployment
  - See the build logs if something fails
  
- **Rollback if needed:**
  - Click on any previous successful deployment
  - Click **"Promote to Production"** to revert

---

## Key Features That Will Work:

✅ **PFP Frame Creation:** Users can upload profile pictures and get them framed  
✅ **Countdown Timer:** Live countdown to November 3rd, 2025 at 9:00 AM  
✅ **Animated Background:** Rotating rays of light  
✅ **Background Music:** Plays with toggle control (after user interaction)  
✅ **Download Counter:** Tracks how many frames have been downloaded  
✅ **Confetti Animation:** Triggers on download with Solana brand colors  
✅ **High-Quality Downloads:** 400x400px PNG files optimized for Twitter  

---

## Troubleshooting

### "Audio not found" error:
- Verify `SSummitSong.mp3` is in the `public` folder
- Check file name spelling and capitalization
- Redeploy after adding the file

### Site not updating:
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait 1-2 minutes for Vercel deployment to complete
- Check Vercel dashboard for deployment status

### Build failed on Vercel:
- Check the build logs in Vercel
- Ensure all dependencies are properly listed
- Contact support with the error message

---

## Support

If you run into issues:
1. Check the Vercel deployment logs
2. Check your browser console (F12 → Console)
3. Visit [Vercel's documentation](https://vercel.com/docs)
4. Ask for help in the Solana community

---

## Summary Checklist

- [ ] Export project from Figma Make
- [ ] Add `SSummitSong.mp3` to the `public` folder
- [ ] Create GitHub repository
- [ ] Upload project to GitHub
- [ ] Connect GitHub to Vercel
- [ ] Deploy on Vercel
- [ ] Test the live site (including audio)
- [ ] Share your URL!

**Your deployment URL will be:** `https://[your-project-name].vercel.app`

Good luck with your Solana Summit Africa event! 🚀
