import logger from '../utils/logger';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
  const { to, subject, html } = payload;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Cosmalac Security <onboarding@resend.dev>';

  try {
    // 1. Resend Email Driver (Production)
    if (resendApiKey) {
      logger.info(`Sending email via Resend API to: ${to} | Subject: ${subject}`);
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject: subject,
          html: html
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        logger.error(`❌ Resend API Error: ${JSON.stringify(errData)}`);
        return false;
      }

      logger.info(`✅ Email successfully delivered via Resend to ${to}`);
      return true;
    }

    // 2. Development Mock Driver (Console Log with high visibility)
    logger.info(`\n======================================================\n✉️  [MOCK EMAIL DISPATCHED]
TO: ${to}
SUBJECT: ${subject}
BODY PREVIEW:
${html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300)}...
======================================================\n`);
    return true;
  } catch (error: any) {
    logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
    return false;
  }
};

export const sendOtpEmail = async (email: string, otp: string): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F6F3EC; margin: 0; padding: 40px 20px; }
          .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 40px 32px; border: 1px solid #D8D2C8; box-shadow: 0 4px 20px rgba(0,0,0,0.05); text-align: center; }
          .badge { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #D8A7B1; margin-bottom: 12px; }
          .title { font-size: 24px; font-weight: 800; color: #121110; margin: 0 0 12px; }
          .desc { font-size: 13px; color: #57534E; line-height: 1.6; margin: 0 0 28px; }
          .otp-box { background: #F1EFE7; border: 2px dashed #D8A7B1; border-radius: 16px; padding: 18px; font-size: 36px; font-weight: 900; letter-spacing: 0.25em; color: #121110; margin-bottom: 28px; }
          .footer { font-size: 11px; color: #A8A29E; line-height: 1.5; border-top: 1px solid #EBE7DC; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">COSMALAC CONTROL CENTER</div>
          <h1 class="title">Your One-Time Passcode</h1>
          <p class="desc">Enter the 6-digit verification code below to securely authenticate into the Cosmalac Administration Portal.</p>
          <div class="otp-box">${otp}</div>
          <p class="desc" style="font-size: 12px; color: #78716C; margin-bottom: 24px;">This security passcode expires in <strong>10 minutes</strong> and can only be used once.</p>
          <div class="footer">
            If you did not request this verification code, please ignore this email or contact security immediately.<br>
            © ${new Date().getFullYear()} COSMALAC. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `Your Cosmalac Access Code: ${otp}`,
    html
  });
};

export const sendInquiryNotification = async (inquiry: any) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cosmalac.com';
  const html = `
    <h2>New Lead Inquiry Received</h2>
    <p><strong>Name:</strong> ${inquiry.name}</p>
    <p><strong>Email:</strong> ${inquiry.email}</p>
    <p><strong>Phone:</strong> ${inquiry.phone}</p>
    <p><strong>Type:</strong> ${inquiry.type}</p>
    <p><strong>Message:</strong></p>
    <p>${inquiry.message}</p>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `[Cosmalac Inquiry] New ${inquiry.type} Message from ${inquiry.name}`,
    html
  });
};
