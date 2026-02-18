# Exit Readiness Scorecard - Migration Guide

This guide will help you take full ownership of the Exit Readiness Scorecard application. Follow each section in order.

---

## Table of Contents

1. [Overview - What You're Getting](#1-overview---what-youre-getting)
2. [Prerequisites](#2-prerequisites)
3. [Step 1: Get the Source Code](#step-1-get-the-source-code)
4. [Step 2: Set Up Your GitHub Repository](#step-2-set-up-your-github-repository)
5. [Step 3: Set Up Cloudflare R2 (PDF Storage)](#step-3-set-up-cloudflare-r2-pdf-storage)
6. [Step 4: Deploy to Netlify](#step-4-deploy-to-netlify)
7. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
8. [Step 6: Update Your Website Embed](#step-6-update-your-website-embed)
9. [Step 7: Update Google Tag Manager (Optional)](#step-7-update-google-tag-manager-optional)
10. [Verification Checklist](#verification-checklist)
11. [Troubleshooting](#troubleshooting)
12. [Technical Reference](#technical-reference)

---

## 1. Overview - What You're Getting

### The Application
- **Exit Readiness Scorecard** - A 10-question assessment tool
- Generates PDF reports for leads
- Integrates with ActiveCampaign CRM
- Stores PDFs in cloud storage

### Components to Migrate

| Component | Current Location | What You Need |
|-----------|-----------------|---------------|
| Source Code | GitHub (developer's repo) | Your own GitHub account |
| Website Hosting | Netlify | Your own Netlify account (free tier works) |
| PDF Storage | Cloudflare R2 | Your own Cloudflare account |
| CRM | ActiveCampaign | Already yours - no change needed |
| Analytics | Google Tag Manager | Already yours - no change needed |

### Estimated Time
- **Total time**: 1-2 hours
- **Technical skill required**: Basic (copy/paste, clicking buttons)

---

## 2. Prerequisites

Before starting, make sure you have:

- [ ] A GitHub account (free) - [Create one here](https://github.com/signup)
- [ ] A Netlify account (free) - [Create one here](https://netlify.com)
- [ ] A Cloudflare account (free) - [Create one here](https://cloudflare.com)
- [ ] Access to your ActiveCampaign account
- [ ] Access to your Google Tag Manager account (optional)

---

## Step 1: Get the Source Code

### Option A: Download as ZIP (Easiest)

1. Go to the GitHub repository: `https://github.com/TexasBedouin/exit-readiness-scorecard`
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Save and extract the ZIP file to your computer

### Option B: Use Git (If you're comfortable with command line)

```bash
git clone https://github.com/TexasBedouin/exit-readiness-scorecard.git
cd exit-readiness-scorecard
```

---

## Step 2: Set Up Your GitHub Repository

### Create Your Repository

1. Log in to [GitHub](https://github.com)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name it: `exit-readiness-scorecard` (or whatever you prefer)
4. Set to **Private** (recommended)
5. Click **"Create repository"**

### Upload the Code

**If you downloaded the ZIP:**

1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop ALL files from the extracted folder
3. Click **"Commit changes"**

**If you used Git:**

```bash
# Remove the old remote
git remote remove origin

# Add your new repository as remote
git remote add origin https://github.com/YOUR-USERNAME/exit-readiness-scorecard.git

# Push the code
git push -u origin main
```

---

## Step 3: Set Up Cloudflare R2 (PDF Storage)

Cloudflare R2 stores the PDF reports. You need to create your own bucket.

### 3.1 Create a Cloudflare Account

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Sign up or log in

### 3.2 Create an R2 Bucket

1. In the left sidebar, click **"R2 Object Storage"**
2. Click **"Create bucket"**
3. Name it: `legacy-dna-pdfs` (or any name you prefer)
4. Click **"Create bucket"**

### 3.3 Enable Public Access

1. Click on your new bucket
2. Go to **"Settings"** tab
3. Under **"Public access"**, click **"Allow Access"**
4. Choose **"Connect domain"** or use the R2.dev subdomain:
   - Click **"Enable R2.dev subdomain"**
   - Copy the URL (looks like: `https://pub-abc123.r2.dev`)

### 3.4 Create API Credentials

1. Go back to **R2 Object Storage** main page
2. Click **"Manage R2 API Tokens"** (right side)
3. Click **"Create API token"**
4. Configure:
   - Name: `Exit Scorecard Access`
   - Permissions: **Object Read & Write**
   - Specify bucket: Select your bucket
5. Click **"Create API Token"**
6. **IMPORTANT**: Copy and save these values immediately:
   - Access Key ID
   - Secret Access Key
   - Account ID (shown at top of page)

### 3.5 Record Your R2 Details

Save these somewhere safe - you'll need them in Step 5:

```
CLOUDFLARE_ACCOUNT_ID = [Your Account ID from dashboard URL]
CLOUDFLARE_R2_ACCESS_KEY_ID = [Access Key ID from step 3.4]
CLOUDFLARE_R2_SECRET_ACCESS_KEY = [Secret Access Key from step 3.4]
CLOUDFLARE_R2_BUCKET_NAME = legacy-dna-pdfs (or your bucket name)
CLOUDFLARE_R2_PUBLIC_URL = https://pub-xxx.r2.dev (from step 3.3)
```

---

## Step 4: Deploy to Netlify

Netlify hosts the website and runs the backend code.

### 4.1 Connect GitHub to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"GitHub"**
4. Authorize Netlify to access your GitHub
5. Select your `exit-readiness-scorecard` repository

### 4.2 Configure Build Settings

Netlify should auto-detect these, but verify:

| Setting | Value |
|---------|-------|
| Branch to deploy | `main` |
| Build command | `npm install && npm run build` |
| Publish directory | `build` |

Click **"Deploy site"**

### 4.3 Get Your New Site URL

After deployment (2-3 minutes):
1. Netlify assigns a random URL like `random-name-123.netlify.app`
2. You can customize this:
   - Go to **Site settings** → **Domain management**
   - Click **"Options"** → **"Edit site name"**
   - Change to something like `legacydna-scorecard.netlify.app`

---

## Step 5: Configure Environment Variables

This is the most important step. These secrets connect everything together.

### 5.1 Open Environment Settings

1. In Netlify, go to your site
2. Click **"Site configuration"** (left sidebar)
3. Click **"Environment variables"**
4. Click **"Add a variable"**

### 5.2 Add Each Variable

Add these variables one by one:

#### ActiveCampaign (Your CRM)

| Key | Value | Description |
|-----|-------|-------------|
| `AC_API_URL` | `https://legacydna.api-us1.com` | Your AC API endpoint |
| `AC_API_TOKEN` | `[Your API Token]` | Get from AC: Settings → Developer |
| `AC_LIST_ID` | `17` | The list ID for scorecard leads |

**To find your ActiveCampaign API Token:**
1. Log in to ActiveCampaign
2. Go to Settings → Developer
3. Copy your API Key

#### Cloudflare R2 (PDF Storage)

| Key | Value |
|-----|-------|
| `CLOUDFLARE_ACCOUNT_ID` | `[From Step 3.5]` |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | `[From Step 3.5]` |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | `[From Step 3.5]` |
| `CLOUDFLARE_R2_BUCKET_NAME` | `[From Step 3.5]` |
| `CLOUDFLARE_R2_PUBLIC_URL` | `[From Step 3.5]` |

### 5.3 Redeploy

After adding all variables:
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**

---

## Step 6: Update Your Website Embed

Update the iframe on your website to point to your new Netlify URL.

### Find and Replace the Embed Code

**Old code (remove this):**
```html
<iframe
  src="https://exit-readiness-scorecard.netlify.app"
  ...
></iframe>
```

**New code (use this):**
```html
<iframe
  src="https://YOUR-SITE-NAME.netlify.app"
  width="100%"
  height="800"
  frameborder="0"
  style="border: none; width: 100%;"
  id="scorecard-iframe"
></iframe>

<script>
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'resize') {
      document.getElementById('scorecard-iframe').style.height = event.data.height + 'px';
    }
  });
</script>
```

Replace `YOUR-SITE-NAME` with your actual Netlify site name.

---

## Step 7: Update Google Tag Manager (Optional)

The current GTM container ID is `GTM-MBLCKP3V`. If this is already your container, no changes needed.

If you want to use a different GTM container:

1. Open `public/index.html` in your code
2. Find `GTM-MBLCKP3V` (appears twice)
3. Replace with your GTM container ID
4. Commit and push the change
5. Netlify will auto-deploy

---

## Verification Checklist

After completing all steps, verify everything works:

### Basic Functionality
- [ ] Visit your Netlify URL directly
- [ ] Complete the 10-question assessment
- [ ] Enter an email address
- [ ] View your results
- [ ] Download the PDF report

### Integration Tests
- [ ] Check ActiveCampaign - new contact should appear
- [ ] Check Cloudflare R2 bucket - PDF should be uploaded
- [ ] Check your website - iframe should load correctly

### PDF Storage Test
1. Complete an assessment
2. Go to Cloudflare R2 → Your bucket
3. You should see a new PDF file like `LegacyDNA-abc123.pdf`

---

## Troubleshooting

### "Site failed to deploy"

**Check the build log:**
1. Go to Deploys in Netlify
2. Click the failed deploy
3. Look for red error messages

**Common fixes:**
- Make sure `package.json` is in the root folder
- Verify build command is `npm install && npm run build`

### "PDF not uploading to R2"

**Check environment variables:**
1. Verify all 5 Cloudflare variables are set
2. Check for typos in the values
3. Make sure the bucket name matches exactly

**Check R2 permissions:**
1. Go to Cloudflare R2 → API Tokens
2. Verify your token has "Object Read & Write" permission

### "ActiveCampaign not receiving leads"

**Check API credentials:**
1. Verify `AC_API_URL` includes `https://`
2. Verify `AC_API_TOKEN` is correct
3. Test your API key in ActiveCampaign Developer settings

### "Iframe not displaying"

**Check the URL:**
1. Make sure the Netlify URL is correct
2. Try visiting the URL directly in a browser

**Check CORS/security:**
1. Your website must use HTTPS
2. The iframe URL must use HTTPS

---

## Technical Reference

### File Structure

```
exit-readiness-scorecard/
├── public/
│   ├── index.html          ← Google Tag Manager code here
│   └── legacy-dna-logo.png ← Your logo
├── src/
│   ├── ExitReadinessScorecard.jsx  ← Main application
│   ├── App.js
│   └── index.js
├── netlify/
│   └── functions/
│       └── submit-scorecard.js  ← Backend (R2 + ActiveCampaign)
├── netlify.toml            ← Build configuration
└── package.json            ← Dependencies
```

### Making Changes to the Scorecard

**To change questions, colors, or text:**
1. Edit `src/ExitReadinessScorecard.jsx`
2. Commit and push to GitHub
3. Netlify auto-deploys changes

**To change the logo:**
1. Replace `public/legacy-dna-logo.png`
2. Keep the same filename, or update the reference in the code

### Environment Variables Reference

| Variable | Purpose |
|----------|---------|
| `AC_API_URL` | ActiveCampaign API endpoint |
| `AC_API_TOKEN` | ActiveCampaign authentication |
| `AC_LIST_ID` | Which list to add contacts to |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | R2 authentication |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | R2 authentication |
| `CLOUDFLARE_R2_BUCKET_NAME` | Which bucket to store PDFs |
| `CLOUDFLARE_R2_PUBLIC_URL` | Public URL for PDF downloads |

---

## Support

If you encounter issues not covered here:

1. Check Netlify build logs for errors
2. Check browser console (F12) for JavaScript errors
3. Verify all environment variables are set correctly

---

## Summary

After completing this migration, you will own:

- ✅ The source code in your GitHub
- ✅ The hosting on your Netlify account
- ✅ The PDF storage in your Cloudflare account
- ✅ Full control to make changes and updates

The original developer's accounts are no longer needed.
