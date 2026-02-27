# CLAUDE.md - Exit Readiness Scorecard

## What This Project Is

The **Exit Readiness Scorecard** is a branded React web application built for **Legacy DNA**, a consulting firm that helps healthcare companies prepare for acquisitions/exits. Users complete a 10-question self-assessment across 5 business domains, receive an instant scored report (0–100), and can download a branded PDF. The app captures leads into ActiveCampaign (CRM) and stores generated PDFs in Netlify Blobs.

## Tech Stack

- **Frontend**: React 18 (Create React App)
- **PDF Generation**: `html2pdf.js` — renders the results page HTML to a downloadable PDF
- **Icons**: `lucide-react`
- **Hosting**: Netlify (static site + serverless functions)
- **Backend**: Netlify Functions (Node.js serverless)
- **CRM**: ActiveCampaign API (contact sync, list management, tagging)
- **PDF Storage**: Netlify Blobs (built into Netlify, no external account needed)
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
│   └── ExitReadinessScorecard.jsx  # Main component (all UI + logic)
├── netlify/
│   └── functions/
│       ├── submit-scorecard.js    # Lead capture (Blobs upload + AC sync)
│       ├── serve-pdf.js           # Serves stored PDFs from Blobs
│       ├── health.js              # Health check endpoint (tests AC connectivity)
│       ├── log-error.js           # Frontend error logging endpoint
│       └── package.json           # Dependencies for Netlify functions
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

Each question is scored 1–5. The overall score uses a normalized formula: `((total - 10) / 40) * 90 + 10`, producing a 10–100 range. The scoring logic lives in the `getAnalysis()` and `calculateScore()` functions inside `ExitReadinessScorecard.jsx`.

### Lead Capture Flow

When the user transitions to `fullResults`:
1. A `useEffect` fires automatically after 1 second (with proper cleanup to prevent race conditions)
2. `generatePDFBlob()` creates a PDF from the rendered results HTML
3. The PDF is converted to base64
4. A POST request is sent to `/.netlify/functions/submit-scorecard` with: `{ email, overallScore, pdfBase64 }`
5. The Netlify function uploads the PDF to Netlify Blobs, then syncs the contact to ActiveCampaign (creates/updates contact, adds to list, applies tags)
6. `sessionStorage` prevents duplicate submissions — only set on confirmed success
7. On failure: user sees an error overlay with retry option (max 3 attempts)

### Backend Error Handling

The `submit-scorecard` function:
- Uses `AbortController` with 8-second timeouts on all fetch calls
- Retries failed API calls (2 attempts with 1s backoff)
- Validates all API responses (list addition, tag creation, tag application)
- Returns structured responses with `submissionId` for log correlation
- **List addition failure is a hard error** (ensures email automations trigger)
- Tag failures are tracked as warnings but don't block the response

### PDF Generation

Uses `html2pdf.js` which renders the results DOM to canvas then to PDF. The `generatePDFBlob()` function:
- Clones the results `ref` element
- Removes elements marked with `data-pdf-exclude`
- Generates a letter-format portrait PDF

### Iframe Embedding

The app supports being embedded in an iframe. A `useEffect` sends `postMessage` events (`scorecard-resize`) to the parent window with the document height so the parent can resize the iframe dynamically.

## Serverless Functions

| Endpoint | Method | Purpose |
|---|---|---|
| `/.netlify/functions/submit-scorecard` | POST | Stores PDF in Blobs, syncs contact to ActiveCampaign |
| `/.netlify/functions/serve-pdf?id=<key>` | GET | Serves a stored PDF by filename |
| `/.netlify/functions/health` | GET | Tests ActiveCampaign connectivity |
| `/.netlify/functions/log-error` | POST | Logs frontend errors for debugging |

## Environment Variables (Netlify Functions)

These are configured in Netlify's environment settings, not in the repo:

| Variable | Purpose |
|---|---|
| `AC_API_URL` | ActiveCampaign API base URL |
| `AC_API_TOKEN` | ActiveCampaign API token |
| `AC_LIST_ID` | ActiveCampaign list ID to add contacts to |

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
- **Email validation**: Uses regex validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) for the email capture field.
