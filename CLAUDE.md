# CLAUDE.md - Exit Readiness Scorecard

## What This Project Is

The **Exit Readiness Scorecard** is a branded React web application built for **Legacy DNA**, a consulting firm that helps healthcare companies prepare for acquisitions/exits. Users complete a 10-question self-assessment across 5 business domains, receive an instant scored report (0–100), and can download a branded PDF. The app also captures leads into ActiveCampaign (CRM) and stores generated PDFs in Cloudflare R2.

## Tech Stack

- **Frontend**: React 18 (Create React App)
- **PDF Generation**: `html2pdf.js` — renders the results page HTML to a downloadable PDF
- **Icons**: `lucide-react`
- **Hosting**: Netlify (static site + serverless functions)
- **Backend**: Netlify Functions (Node.js serverless)
- **CRM**: ActiveCampaign API (contact sync, list management, tagging)
- **PDF Storage**: Cloudflare R2 (S3-compatible) — PDFs are uploaded and a public URL is stored on the contact record
- **Analytics**: Google Tag Manager (`GTM-MBLCKP3V`) embedded in `public/index.html`

## Project Structure

```
├── public/
│   ├── index.html              # HTML shell with GTM script
│   ├── favicon.ico
│   └── legacy-dna-logo.png     # Brand logo used in the app
├── src/
│   ├── index.js                # ReactDOM entry point
│   ├── index.css               # Global reset styles
│   ├── App.js                  # Root component, renders ExitReadinessScorecard
│   ├── ExitReadinessScorecard.jsx  # Main component (all UI + logic)
│   ├── ExitReadinessScorecard-OLD.jsx   # Legacy version (unused)
│   ├── ExitReadinessScorecard-OLD2.jsx  # Legacy version (unused)
│   └── ExitReadinessScorecard-REVISED.jsx  # Legacy version (unused)
├── netlify/
│   └── functions/
│       ├── submit-scorecard.js    # Active serverless function (R2 upload + AC sync)
│       └── package.json           # Dependencies for Netlify functions
├── submit-scorecard-fetch-version.js  # Alternative function using native fetch (reference)
├── netlify.toml                # Netlify build config
├── package.json                # Frontend dependencies & scripts
└── package-lock.json
```

## Key Commands

```bash
npm install        # Install dependencies
npm start          # Start dev server at http://localhost:3000
npm run build      # Production build (output to /build)
npm test           # Run tests (CRA default — minimal tests exist)
```

## How the Application Works

### User Flow (screens managed by `screen` state)

1. **`welcome`** — Landing page with value props and "Start Assessment" CTA
2. **`questions`** — 10 questions shown one at a time (`currentStep` 0–9), grouped into 5 domains (2 questions each):
   - Customer Clarity
   - Messaging Strength
   - Brand Positioning
   - Corporate Story
   - Market Presence
3. **`emailCapture`** — Collects user email before showing results (acts as lead gate)
4. **`fullResults`** — Displays scored results with heatmap, analysis, and download PDF button

### Scoring

Each question is scored 1–5. Domain scores are the average of 2 questions, scaled to 0–20 (each domain worth 20 points). Overall score = sum of all 5 domain scores (0–100). The scoring logic lives in the `getAnalysis()` function inside `ExitReadinessScorecard.jsx`.

### Lead Capture Flow

When the user transitions to `fullResults`:
1. A `useEffect` fires automatically after 1 second
2. `generatePDFBlob()` creates a PDF from the rendered results HTML
3. The PDF is converted to base64
4. A POST request is sent to `/.netlify/functions/submit-scorecard` with: `{ email, overallScore, pdfBase64 }`
5. The Netlify function uploads the PDF to Cloudflare R2, then syncs the contact to ActiveCampaign (creates/updates contact, adds to list, applies tags)
6. `sessionStorage` prevents duplicate submissions in the same session

### PDF Generation

Uses `html2pdf.js` which renders the results DOM to canvas then to PDF. The `generatePDFBlob()` function:
- Clones the results `ref` element
- Removes elements marked with `data-pdf-exclude`
- Generates a letter-format portrait PDF

The same function is used for both the user-facing download button and the backend submission.

### Iframe Embedding

The app supports being embedded in an iframe. A `useEffect` sends `postMessage` events (`scorecard-resize`) to the parent window with the document height so the parent can resize the iframe dynamically.

## Environment Variables (Netlify Functions)

These are configured in Netlify's environment settings, not in the repo:

| Variable | Purpose |
|---|---|
| `AC_API_URL` | ActiveCampaign API base URL |
| `AC_API_TOKEN` | ActiveCampaign API token |
| `AC_LIST_ID` | ActiveCampaign list ID to add contacts to |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account for R2 |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | R2 access key |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | R2 secret key |
| `CLOUDFLARE_R2_BUCKET_NAME` | R2 bucket name |
| `CLOUDFLARE_R2_PUBLIC_URL` | Public URL prefix for uploaded PDFs |

## Brand Colors

| Color | Hex |
|---|---|
| Primary Purple | `#34296A` |
| Teal | `#009DB9` |
| Light Blue | `#E2EEF2` |
| Supporting Blue | `#4E72B8` |
| Supporting Purple | `#822A8A` |
| Orange | `#F58220` |

## Architecture Notes

- **Single-component app**: Nearly all logic lives in `ExitReadinessScorecard.jsx` (~1700 lines) — screens, scoring, PDF generation, lead capture, and all UI.
- **No router**: Screen transitions are controlled by a `screen` state variable, not React Router.
- **No state management library**: All state is local `useState` in the single component.
- **Inline styles**: CSS is applied via inline style objects, not CSS modules or external stylesheets.
- **No test coverage**: The project has no meaningful test files beyond CRA defaults.
- **Legacy files**: `*-OLD.jsx`, `*-OLD2.jsx`, and `*-REVISED.jsx` in `src/` are unused prior versions kept for reference.
