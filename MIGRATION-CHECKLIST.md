# Migration Checklist (Quick Reference)

Use this checklist alongside the full [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md).

---

## Accounts Needed (All Free Tier)

- [ ] GitHub account - [github.com/signup](https://github.com/signup)
- [ ] Netlify account - [netlify.com](https://netlify.com)
- [ ] Cloudflare account - [cloudflare.com](https://cloudflare.com)

---

## Migration Steps

### 1. Source Code
- [ ] Download ZIP from current GitHub repo
- [ ] Create new private repo in your GitHub
- [ ] Upload all files to your new repo

### 2. Cloudflare R2 (PDF Storage)
- [ ] Create R2 bucket named `legacy-dna-pdfs`
- [ ] Enable public access (R2.dev subdomain)
- [ ] Create API token with Read/Write permissions
- [ ] Save these credentials:
  - Account ID: `_______________`
  - Access Key ID: `_______________`
  - Secret Access Key: `_______________`
  - Bucket Name: `_______________`
  - Public URL: `_______________`

### 3. Netlify Deployment
- [ ] Connect GitHub repo to Netlify
- [ ] Verify build settings:
  - Build command: `npm install && npm run build`
  - Publish directory: `build`
- [ ] Deploy site
- [ ] Note your new site URL: `_______________`

### 4. Environment Variables (in Netlify)
Add these 8 variables in Site Configuration → Environment Variables:

**ActiveCampaign:**
- [ ] `AC_API_URL` = `https://legacydna.api-us1.com`
- [ ] `AC_API_TOKEN` = (from AC Settings → Developer)
- [ ] `AC_LIST_ID` = `17`

**Cloudflare R2:**
- [ ] `CLOUDFLARE_ACCOUNT_ID` = (from step 2)
- [ ] `CLOUDFLARE_R2_ACCESS_KEY_ID` = (from step 2)
- [ ] `CLOUDFLARE_R2_SECRET_ACCESS_KEY` = (from step 2)
- [ ] `CLOUDFLARE_R2_BUCKET_NAME` = (from step 2)
- [ ] `CLOUDFLARE_R2_PUBLIC_URL` = (from step 2)

### 5. Redeploy
- [ ] Trigger new deploy in Netlify after adding env vars

### 6. Update Website
- [ ] Replace iframe URL on your website with new Netlify URL

---

## Verification Tests

- [ ] Complete a test assessment on new URL
- [ ] Verify PDF downloads correctly
- [ ] Check new contact appears in ActiveCampaign
- [ ] Check PDF file appears in Cloudflare R2 bucket
- [ ] Verify iframe works on your website

---

## What You'll Own After Migration

| Asset | Your Account |
|-------|-------------|
| Source code | Your GitHub |
| Website hosting | Your Netlify |
| PDF storage | Your Cloudflare |
| CRM data | Your ActiveCampaign (already yours) |
| Analytics | Your GTM (already yours) |

---

## Need Help?

See the detailed [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) for step-by-step instructions with screenshots descriptions.
