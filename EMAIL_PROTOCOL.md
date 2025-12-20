# EMAIL SYSTEM PROTOCOL

## MANDATORY REQUIREMENTS

### Email Service Standard
**ALL email functionality in this project MUST use Gmail with nodemailer.**

DO NOT use Resend, SendGrid, or any other email service unless explicitly requested by the user.

### Standard Configuration

Every edge function that sends emails MUST use this exact configuration:

```typescript
import { createTransport } from "npm:nodemailer@6.9.7";

// Setup Gmail transporter
const GMAIL_USER = "payments@brainworx.co.za";
const GMAIL_PASSWORD = "iuhzjjhughbnwsvf";

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASSWORD,
  },
});
```

### Sending Email

Standard email sending pattern:

```typescript
await transporter.sendMail({
  from: `BrainWorx <${GMAIL_USER}>`,
  to: recipientEmail,
  subject: "Subject Line",
  html: htmlContent,
});
```

## Reference Edge Functions

All email-sending edge functions follow this pattern:
- `send-adhd-caregiver-invitation`
- `send-adhd710-teacher-invitation`
- `send-analysis-email`
- `send-client-report`
- `send-comprehensive-coach-report`
- `send-coupon-email`
- `send-invoice-email`
- `send-nip3-results`
- `send-self-assessment-email`
- `send-verification-email`

Before creating a new email function, check any of these as reference.

## When Creating New Email Functions

1. **Always use Gmail** - Do not ask which email service to use
2. **Use nodemailer@6.9.7** - Import from npm
3. **Use the standard credentials** - payments@brainworx.co.za
4. **Include CORS headers** - Standard pattern for all edge functions
5. **Set verify_jwt to false** - For public-facing email endpoints

## Never Do This

- Never use Resend API (`RESEND_API_KEY`)
- Never ask user to configure email credentials
- Never use different SMTP providers without explicit request
- Never create environment variables for email config

## Why Gmail?

This project has Gmail already configured and working across all functions. Using any other service:
- Requires additional setup and credentials
- Breaks consistency across the codebase
- May not be properly configured in production
- Has caused issues in the past (see ADHD 710 teacher invitation bug)

## History

On 2025-12-20, the `send-adhd710-teacher-invitation` function was incorrectly created using Resend API instead of Gmail. This caused a production failure where teacher invitations could not be sent because `RESEND_API_KEY` was not configured.

This protocol document ensures this mistake never happens again.
