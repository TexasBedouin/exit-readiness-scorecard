# Exit Readiness Scorecard — Migration Guide

This guide walks you through setting up the Exit Readiness Scorecard on your own accounts. After completing these steps, you will fully own and control the application.

---

## What You Need

| Component | What You Need | Cost |
|---|---|---|
| Source Code | GitHub account | Free |
| Hosting + Backend + PDF Storage | Netlify account | Free tier works |
| CRM | ActiveCampaign | Already yours — no change |
| Analytics | Google Tag Manager | Already yours — no change |

**Estimated time: 30–60 minutes**

---

## Step 1: Set Up Your GitHub Repository

1. Go to [github.com/signup](https://github.com/signup) and create an account (or sign in)
2. Create a new **private** repository named `exit-readiness-scorecard`
3. Upload all project files to the repository (or use `git push`)

---

## Step 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and create an account (or sign in)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub account and select your `exit-readiness-scorecard` repository
4. Verify these build settings:
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `build`
5. Click **Deploy site**
6. Wait for the build to complete — note your new site URL (e.g., `https://your-site.netlify.app`)

---

## Step 3: Configure Environment Variables

In Netlify, go to **Site Configuration → Environment Variables** and add these 3 variables:

| Variable | Value | Where to Find It |
|---|---|---|
| `AC_API_URL` | `https://legacydna.api-us1.com` | ActiveCampaign → Settings → Developer |
| `AC_API_TOKEN` | Your API token | ActiveCampaign → Settings → Developer → API Access |
| `AC_LIST_ID` | Your list ID (e.g., `17`) | ActiveCampaign → Lists → click your list → look at URL for the ID |

After adding the variables, **trigger a redeploy** (Deploys → Trigger deploy → Deploy site).

---

## Step 4: Verify the Health Check

Visit `https://your-site.netlify.app/.netlify/functions/health` in your browser.

You should see:
```json
{ "status": "healthy", "checks": { "activecampaign": "ok" }, "timestamp": "..." }
```

If ActiveCampaign shows "error", double-check your `AC_API_URL` and `AC_API_TOKEN` values.

---

## Step 5: Test the Full Flow

1. Open your new site URL
2. Complete all 10 questions
3. Enter a **test email address**
4. Verify in ActiveCampaign:
   - Contact was created with the test email
   - Contact was added to your list
   - Tags `exit-readiness-completed` and `score-XX` were applied
   - Custom field 20 (score) is populated
   - Custom field 21 (PDF URL) contains a link
5. Click the PDF link in field 21 — verify it downloads a valid PDF

---

## Step 6: Update Your Website Embed

If the scorecard is embedded as an iframe on your website, update the `src` to your new Netlify URL:

```html
<iframe
  src="https://your-site.netlify.app"
  width="100%"
  style="border: none; min-height: 800px;"
  id="scorecard-iframe"
></iframe>

<script>
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'scorecard-resize') {
      document.getElementById('scorecard-iframe').style.height = event.data.height + 'px';
    }
  });
</script>
```

---

## Step 7: Set Up ActiveCampaign Automation (Critical)

For follow-up emails to actually be sent, you need an automation in ActiveCampaign:

1. Go to **Automations** → **Create an Automation**
2. Set the trigger to: **Tag is added** → `exit-readiness-completed`
3. Add an action: **Send an email**
4. Design the email (include a link to their PDF using the custom field `%FIELD:21%`)
5. **Activate the automation**

Without this automation, no follow-up emails will be sent. The scorecard only adds contacts and tags — it does not send emails itself.

---

## Step 8: Set Up Monitoring (Optional but Recommended)

1. Sign up for [UptimeRobot](https://uptimerobot.com/) (free)
2. Add a new HTTP(s) monitor pointing to: `https://your-site.netlify.app/.netlify/functions/health`
3. Set check interval to every 5 minutes
4. Add your email for alerts

This will notify you if your ActiveCampaign integration goes down.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Health check shows AC error | Verify `AC_API_URL` and `AC_API_TOKEN` in Netlify environment variables |
| Contacts created but no email sent | Check that the ActiveCampaign automation (Step 7) is active |
| PDF link returns 404 | PDFs are stored in Netlify Blobs — make sure the site is deployed to the same Netlify account |
| Build fails | Check Netlify deploy logs for errors |
| Site loads but scorecard is blank | Check browser console (F12) for JavaScript errors |

---

## Custom Domain (Optional)

To use a custom domain like `scorecard.legacy-dna.com`:

1. In Netlify, go to **Domain Management** → **Add a custom domain**
2. Follow Netlify's instructions to update your DNS records
3. Netlify will automatically provision an SSL certificate

---

## Technical Reference

- **Frontend:** React 18 (Create React App)
- **Backend:** Netlify Functions (Node.js serverless)
- **PDF Storage:** Netlify Blobs (built into Netlify, no separate account needed)
- **CRM Integration:** ActiveCampaign API v3
- **Analytics:** Google Tag Manager (`GTM-MBLCKP3V`)
