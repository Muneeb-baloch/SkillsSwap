import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SEND_URL,
} from '../config/emailjs';

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 30;

export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// EmailJS' REST endpoint is designed to be called directly from a client
// with the public key — no secret key, no backend, same trust model as
// Cloudinary's unsigned upload preset.
export async function sendOtpEmail(toEmail, code) {
  const res = await fetch(EMAILJS_SEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: toEmail,
        code,
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to send verification email');
  }
}
