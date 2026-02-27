# Exit Readiness Scorecard

A branded React web application for **Legacy DNA** — a consulting firm that helps healthcare companies prepare for acquisitions/exits.

Users complete a 10-question self-assessment across 5 business domains, receive an instant score (0–100), and can download a branded PDF report. The app captures leads into ActiveCampaign and stores PDFs in Netlify Blobs.

## Quick Start

```bash
npm install
npm start          # Dev server at http://localhost:3000
npm run build      # Production build (output to /build)
```

## How It Works

1. **Welcome screen** — Landing page with value propositions
2. **10 questions** — Grouped into 5 domains (2 questions each): Customer Clarity, Messaging Strength, Brand Positioning, Corporate Story, Market Presence
3. **Email capture** — Collects email before showing results (lead gate)
4. **Results page** — Scored report (0–100), heatmap, domain analysis, and PDF download

### Behind the Scenes

When a user reaches the results page:
- A PDF is generated from the results HTML using `html2pdf.js`
- The PDF is stored in **Netlify Blobs**
- The user's email, score, and PDF link are synced to **ActiveCampaign**
- The contact is added to the mailing list and tagged for automation

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Create React App) |
| PDF Generation | html2pdf.js |
| Icons | lucide-react |
| Hosting | Netlify (static site + serverless functions) |
| Backend | Netlify Functions (Node.js) |
| PDF Storage | Netlify Blobs |
| CRM | ActiveCampaign API |
| Analytics | Google Tag Manager |

## Environment Variables

Configure these in **Netlify > Site Configuration > Environment Variables**:

| Variable | Purpose |
|---|---|
| `AC_API_URL` | ActiveCampaign API base URL |
| `AC_API_TOKEN` | ActiveCampaign API token |
| `AC_LIST_ID` | ActiveCampaign list ID for contacts |

## Project Structure

```
├── public/
│   ├── index.html              # HTML shell with GTM script
│   ├── favicon.ico
│   └── legacy-dna-logo.png     # Brand logo
├── src/
│   ├── index.js                # ReactDOM entry point
│   ├── index.css               # Global reset styles
│   ├── App.js                  # Root component
│   └── ExitReadinessScorecard.jsx  # Main component (all UI + logic)
├── netlify/
│   └── functions/
│       ├── submit-scorecard.js # Lead capture (Blobs upload + AC sync)
│       ├── serve-pdf.js        # Serves stored PDFs
│       ├── health.js           # Health check endpoint
│       ├── log-error.js        # Frontend error logging
│       └── package.json        # Function dependencies
├── netlify.toml                # Netlify build config
└── package.json                # Frontend dependencies
```

## Serverless Functions

| Endpoint | Purpose |
|---|---|
| `POST /.netlify/functions/submit-scorecard` | Accepts email + score + PDF, stores PDF, syncs to ActiveCampaign |
| `GET /.netlify/functions/serve-pdf?id=<key>` | Serves a stored PDF by filename |
| `GET /.netlify/functions/health` | Returns health status of ActiveCampaign integration |
| `POST /.netlify/functions/log-error` | Logs frontend errors for debugging |

## Deployment

The app is deployed automatically via Netlify when changes are pushed to the main branch. See [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) for full setup instructions.

## Brand Colors

| Color | Hex |
|---|---|
| Primary Purple | `#34296A` |
| Teal | `#009DB9` |
| Light Blue | `#E2EEF2` |
| Supporting Blue | `#4E72B8` |
| Supporting Purple | `#822A8A` |
| Orange | `#F58220` |
