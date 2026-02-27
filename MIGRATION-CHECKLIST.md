# Migration Checklist (Quick Reference)

Use this checklist alongside the full [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md).

---

## Accounts Needed

- [ ] GitHub account — [github.com/signup](https://github.com/signup)
- [ ] Netlify account — [netlify.com](https://netlify.com)

_(ActiveCampaign and Google Tag Manager are already yours — no changes needed)_

---

## Migration Steps

### 1. Source Code
- [ ] Create new private repo in your GitHub
- [ ] Upload all project files

### 2. Netlify Deployment
- [ ] Connect GitHub repo to Netlify
- [ ] Verify build settings:
  - Build command: `npm install && npm run build`
  - Publish directory: `build`
- [ ] Deploy site
- [ ] Note your new site URL: `_______________`

### 3. Environment Variables (in Netlify)
Add these 3 variables in **Site Configuration > Environment Variables**:

- [ ] `AC_API_URL` = `https://legacydna.api-us1.com`
- [ ] `AC_API_TOKEN` = _(from ActiveCampaign > Settings > Developer)_
- [ ] `AC_LIST_ID` = _(your list ID)_

### 4. Verify
- [ ] Health check returns "healthy": `https://YOUR-SITE.netlify.app/.netlify/functions/health`
- [ ] Complete a test assessment with a test email
- [ ] Verify contact appears in ActiveCampaign with correct score and tags
- [ ] Verify PDF link in custom field 21 works
- [ ] Verify follow-up email is received (requires AC automation — see Step 7 in guide)

### 5. Update Your Website
- [ ] Update iframe `src` to your new Netlify URL
- [ ] Test the embedded version works correctly

### 6. ActiveCampaign Automation (CRITICAL)
- [ ] Create automation: Tag `exit-readiness-completed` is added → Send email
- [ ] Include PDF link using `%FIELD:21%` in the email template
- [ ] Activate the automation

### 7. Monitoring (Optional)
- [ ] Set up UptimeRobot to monitor the health endpoint
- [ ] Configure email alerts

---

## Done!

Once all items are checked, you have full ownership of the application. The old deployment can be shut down.
