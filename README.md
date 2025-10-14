# Exit Readiness Scorecard™ - Setup & Integration Guide

## 🎯 Overview

This is a fully-branded React application for Legacy DNA's Exit Readiness Scorecard with PDF generation capability. Users complete a 5-question assessment and receive:

- Instant Exit Readiness Score (0-100)
- Visual heatmap showing gaps
- Personalized analysis
- **Downloadable branded PDF report**
- CTAs for booking diagnostic and exploring Sprint

## 📋 What's Included

1. **ExitReadinessScorecard.jsx** - Main React component
2. **ExitReadinessPDF.jsx** - PDF document component with Legacy DNA branding
3. **package.json** - All required dependencies

## 🚀 Installation

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `react` & `react-dom` - Core React libraries
- `lucide-react` - Icon library
- `@react-pdf/renderer` - PDF generation library

### Step 2: Run the App

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📦 How It Works

### User Flow:
1. User sees welcome screen with value props
2. User completes 5 questions (1-5 scale)
3. User enters email on "preview" screen
4. User sees full results with **Download PDF button**
5. PDF generates instantly with all results + branding
6. User downloads PDF and can share with team

### PDF Features:
- ✅ Legacy DNA branded header
- ✅ Exit Readiness Score prominently displayed
- ✅ Complete heatmap table (color-coded)
- ✅ Personalized analysis
- ✅ CTAs with clickable links
- ✅ Professional footer
- ✅ Uses Helvetica fonts (built-in, always render correctly)

## 📧 ActiveCampaign Email Integration (Option A)

Since you're using Option A, here's how to set up the email automation:

### Setup in ActiveCampaign:

1. **Create an Automation** triggered when contact submits form
2. **Trigger**: When email is captured from scorecard
3. **Action**: Send email with PDF attached

### Method 1: Use a Template Email (Recommended)

In ActiveCampaign:
1. Create email template
2. Add personalization:
   - `%FIRSTNAME%` - Their name
   - `%EMAIL%` - Their email
3. Attach the PDF manually to template (users get same branded PDF)
4. Or generate unique PDFs server-side and attach via webhook

### Method 2: Zapier/Make.com Integration

If you want to send the exact PDF they generated:

1. **Webhook from App** → Capture email + scorecard data
2. **Generate PDF server-side** using the same React PDF component
3. **Send to ActiveCampaign** via API with PDF attachment

### Email Template Example:

```
Subject: Your Exit Readiness Report is Ready 🎯

Hi [First Name],

Thanks for completing the Exit Readiness Scorecard™!

Your Exit Readiness Score: [SCORE]/100

🎁 Attached is your complete Exit Readiness Report with:
- Your domain-by-domain breakdown
- Personalized gap analysis
- Actionable next steps

Ready to accelerate your exit readiness?

[CTA Button: Book Your Diagnostic Session]

Best,
The Legacy DNA Team
```

## 🎨 Branding

All colors match Legacy DNA brand guidelines:

- Primary Purple: `#34296A`
- Teal: `#009DB9`
- Light Blue: `#E2EEF2`
- Supporting: `#4E72B8`, `#822A8A`, `#F58220`

Fonts in PDF:
- Headings: `Helvetica-Bold`
- Body: `Helvetica`
- Professional, clean, matches your brand

## 🔧 Customization

### To Update Questions:
Edit the `questions` array in `ExitReadinessScorecard.jsx`

### To Update Branding:
Edit colors in both:
- `ExitReadinessScorecard.jsx` (inline styles)
- `ExitReadinessPDF.jsx` (StyleSheet)

### To Update CTAs:
Update the links in the `fullResults` screen:
- Diagnostic: `https://calendly.com/legacydna/discoverycall`
- Sprint: `https://www.legacy-dna.com/exit-readiness-sprint`

## 📊 Data Collection

The app captures:
- Email address
- All 5 scorecard responses
- Timestamp (can add if needed)

### To Send Data to ActiveCampaign:

Add this function after user submits email:

```javascript
const sendToActiveCampaign = async (email, score, answers) => {
  // Your ActiveCampaign API endpoint
  await fetch('YOUR_ACTIVECAMPAIGN_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      score: score,
      customerClarity: answers.customerClarity,
      messagingStrength: answers.messagingStrength,
      brandPositioning: answers.brandPositioning,
      corporateStory: answers.corporateStory,
      marketPresence: answers.marketPresence
    })
  });
};
```

Call this function when user clicks "Show My Full Results"

## 🚨 Common Issues

### PDF Not Generating:
- Check console for errors
- Ensure `@react-pdf/renderer` is installed
- Browser might block download - check browser settings

### Styling Issues:
- PDFs use limited CSS (no Tailwind, no external fonts)
- Use inline styles in PDF component
- Stick to basic Helvetica fonts

### Large Bundle Size:
- `@react-pdf/renderer` adds ~500KB
- Consider code-splitting if needed
- Or generate PDFs server-side for smaller bundle

## 📱 Mobile Responsive

The app is fully responsive and works on:
- Desktop (optimized)
- Tablet (works well)
- Mobile (fully functional, PDF downloads work)

## 🔐 Security Notes

- No sensitive data stored in browser
- Email validation on frontend
- Consider adding honeypot field for spam protection
- Rate limiting recommended on backend

## 🎯 Next Steps

1. **Test the full flow** end-to-end
2. **Set up ActiveCampaign automation** with email template
3. **Add tracking** (Google Analytics, Facebook Pixel, etc.)
4. **A/B test** different CTAs and copy
5. **Monitor conversion rates** from scorecard → diagnostic bookings

## 💡 Pro Tips

- **Pre-fill email if they're logged in** to reduce friction
- **Add social proof** on welcome screen (testimonials, logos)
- **Test different score ranges** to see what drives bookings
- **Follow up with non-converters** via email sequence
- **Use PDF as lead magnet** in other marketing materials

## 🆘 Need Help?

Common questions:
- **How do I deploy?** → Build with `npm run build`, deploy to Netlify/Vercel
- **How do I customize?** → Edit the JSX files, restart dev server
- **How do I add my logo to PDF?** → Upload logo and use `<Image>` component
- **Can I add more questions?** → Yes, just add to `questions` array

## 📞 Support

For issues or questions about:
- React/Code: Check React docs or Stack Overflow
- ActiveCampaign: Check AC docs or their support
- PDF generation: Check @react-pdf/renderer docs

---

Built for Legacy DNA by Claude 🤖
Version 1.0 - January 2025
