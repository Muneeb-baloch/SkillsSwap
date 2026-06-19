// Free, no-backend email sending for the signup verification code — same
// "call a third-party API straight from the client" pattern this app
// already uses for Cloudinary uploads (no Cloud Functions / Blaze plan).
//
// Setup (one-time, free):
//   1. Create an account at https://www.emailjs.com
//   2. Add an Email Service (e.g. connect your Gmail) → copy its Service ID
//   3. Create an Email Template with a {{code}} and {{to_email}} variable →
//      copy its Template ID. Example template body:
//        "Your SkillsSwap verification code is {{code}}. It expires in 10 minutes."
//   4. Account → General → copy your Public Key
export const EMAILJS_SERVICE_ID = 'REPLACE_WITH_SERVICE_ID';
export const EMAILJS_TEMPLATE_ID = 'REPLACE_WITH_TEMPLATE_ID';
export const EMAILJS_PUBLIC_KEY = 'REPLACE_WITH_PUBLIC_KEY';
export const EMAILJS_SEND_URL = 'https://api.emailjs.com/api/v1.0/email/send';
