# Exit Readiness Scorecard - PDF Integration Guide

## 📄 What's New: PDF Generation

Your Exit Readiness Scorecard now includes a **professional, branded PDF report** that users can download after completing the assessment.

### ✨ Features

- **Branded Design**: Uses Legacy DNA colors and branding throughout
- **Complete Report**: Includes all scores, analysis, and recommendations
- **Professional Layout**: Clean, print-ready design with proper spacing and typography
- **Personalized**: Includes user's name and email in the report
- **Instant Download**: Generated client-side, no server required
- **Call-to-Action**: Includes Calendly link for booking diagnostics

---

## 🚀 Quick Start

### 1. Install Dependencies

First, install the new PDF library:

```bash
npm install @react-pdf/renderer
```

Or if using yarn:

```bash
yarn add @react-pdf/renderer
```

### 2. Add the Files

Copy these files to your `src/` directory:

- **ExitReadinessPDF.jsx** - The PDF document component
- **ExitReadinessScorecard.jsx** - Updated main component with PDF download
- **App.js** - App wrapper
- **index.js** - Entry point

### 3. Update package.json

Replace your package.json with the provided one that includes `@react-pdf/renderer`.

### 4. Run the App

```bash
npm start
```

---

## 📦 File Structure

```
src/
├── App.js                          # Main app wrapper
├── index.js                        # React entry point
├── ExitReadinessScorecard.jsx      # Main scorecard component with PDF button
└── ExitReadinessPDF.jsx            # PDF document component
```

---

## 🎨 PDF Features

### 1. Branded Header
- Legacy DNA branding colors
- Professional title and subtitle
- User personalization (name if provided)

### 2. Score Display
- Large, prominent overall score
- Color-coded readiness indicator
- Clear "out of 5.0" context

### 3. Detailed Heatmap
- All 5 domains with scores
- Color-coded readiness levels:
  - **Red**: Critical (≤1)
  - **Orange**: Low (2)
  - **Yellow**: Moderate (3)
  - **Blue**: Good (4)
  - **Green**: Excellent (5)

### 4. Personalized Analysis
- Custom insights based on overall score
- Specific action items and recommendations
- Timeline suggestions for improvement

### 5. Call-to-Action
- Prominent CTA section with Calendly link
- Encourages booking the free diagnostic

### 6. Professional Footer
- Copyright and branding
- User email (if provided)
- Website link

---

## 🎯 How It Works

### The PDF Generation Flow

1. **User completes assessment** → 5 questions answered
2. **Email gate appears** → User enters email (and optionally name)
3. **Results page displays** → Shows scores and insights
4. **PDF download button** → Uses `@react-pdf/renderer` to generate PDF
5. **PDF downloads** → Professional branded report saved to user's device

### Key Components

#### ExitReadinessPDF.jsx

This component defines the PDF structure using `@react-pdf/renderer`:

```jsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const ExitReadinessPDF = ({ scores, userEmail, userName }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* PDF content here */}
      </Page>
    </Document>
  );
};
```

#### ExitReadinessScorecard.jsx

The main component now includes the PDF download button:

```jsx
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExitReadinessPDF from './ExitReadinessPDF';

// In the results screen:
<PDFDownloadLink
  document={<ExitReadinessPDF scores={scores} userEmail={email} userName={name} />}
  fileName={`Exit-Readiness-Report-${name || 'Results'}.pdf`}
>
  {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF Report')}
</PDFDownloadLink>
```

---

## 🎨 Customization

### Changing Colors

Edit the colors in `ExitReadinessPDF.jsx`:

```javascript
const styles = StyleSheet.create({
  // Primary purple: #34296A
  // Teal accent: #009DB9
  // Light blue: #E2EEF2
});
```

### Modifying Content

The PDF analysis text adapts based on the user's score:

- **≥ 4.0**: Excellent readiness message
- **3.0 - 3.9**: Moderate readiness with improvement suggestions
- **< 3.0**: Critical gaps identified with urgent recommendations

To customize these thresholds or messages, edit the conditional logic in `ExitReadinessPDF.jsx`.

### Adding Logo

To add your logo to the PDF:

1. Convert your logo to base64 or host it online
2. Add the Image component:

```jsx
import { Image } from '@react-pdf/renderer';

<Image 
  src="https://your-logo-url.com/logo.png" 
  style={styles.logo}
/>
```

---

## 📧 Email Integration (Future Enhancement)

Currently, the PDF is downloaded directly to the user's device. To **email the PDF** as well:

### Option 1: Client-Side Email Service

Use a service like **EmailJS** or **Resend**:

```bash
npm install @emailjs/browser
```

```javascript
import emailjs from '@emailjs/browser';

// After user submits email
const pdfBlob = await pdf(<ExitReadinessPDF {...props} />).toBlob();

emailjs.send(
  'service_id',
  'template_id',
  {
    user_email: email,
    user_name: name,
    pdf_attachment: pdfBlob
  }
);
```

### Option 2: Backend API

Send the PDF to your server, which then emails it:

```javascript
// Generate PDF blob
const pdfBlob = await pdf(<ExitReadinessPDF {...props} />).toBlob();

// Send to your API
const formData = new FormData();
formData.append('pdf', pdfBlob);
formData.append('email', email);

await fetch('https://your-api.com/send-pdf', {
  method: 'POST',
  body: formData
});
```

---

## 🔧 Troubleshooting

### PDF not generating?

1. Check that `@react-pdf/renderer` is installed:
   ```bash
   npm list @react-pdf/renderer
   ```

2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Styles not applying?

- `@react-pdf/renderer` uses its own styling system (similar to React Native)
- Standard CSS won't work - use the StyleSheet.create() pattern
- Supported properties are limited (no `display: grid`, for example)

### PDF rendering slowly?

- The first PDF generation may take 1-2 seconds
- Consider showing a loading state
- The PDF is generated client-side, so performance depends on user's device

---

## 📋 Testing Checklist

Before deploying:

- [ ] PDF downloads successfully
- [ ] All scores display correctly
- [ ] Colors match Legacy DNA branding
- [ ] Text is readable and properly formatted
- [ ] User's name appears (if provided)
- [ ] User's email appears in footer
- [ ] Calendly link is correct
- [ ] Analysis changes based on score
- [ ] Works on mobile devices
- [ ] Works in different browsers

---

## 🚀 Deployment

### Deploy to Netlify (if not already done)

1. Build your app:
   ```bash
   npm run build
   ```

2. Deploy the `build/` folder to Netlify

3. Or use Netlify CLI:
   ```bash
   netlify deploy --prod
   ```

### Environment Variables (for future email integration)

If you add email functionality later, store API keys in Netlify environment variables:

1. Go to Site Settings → Environment Variables
2. Add your email service keys
3. Access them in your code via `process.env.REACT_APP_*`

---

## 📚 Resources

- **@react-pdf/renderer docs**: https://react-pdf.org/
- **Styling guide**: https://react-pdf.org/styling
- **Components reference**: https://react-pdf.org/components

---

## 🎯 Next Steps

### Immediate
1. ✅ Install dependencies
2. ✅ Copy files to src/
3. ✅ Test PDF generation
4. ✅ Deploy to production

### Future Enhancements
- [ ] Email PDF automatically to user
- [ ] Add to ActiveCampaign automation
- [ ] Track PDF downloads in analytics
- [ ] A/B test different PDF designs
- [ ] Add charts/graphs to PDF
- [ ] Multi-language support

---

## 💡 Tips

1. **Test the PDF in multiple viewers**: Chrome, Firefox, Adobe Reader, Preview (Mac)
2. **Keep file size small**: Currently ~50KB - avoid large images
3. **Mobile testing**: PDFs work great on mobile devices
4. **Print testing**: Ensure it prints well from the PDF

---

## ❓ Questions?

If you run into any issues or need modifications:

1. Check the `@react-pdf/renderer` documentation
2. Common issues are usually styling-related
3. The PDF component is fully customizable - edit styles in `ExitReadinessPDF.jsx`

---

**Your branded Exit Readiness PDF is ready to go! 🎉**
