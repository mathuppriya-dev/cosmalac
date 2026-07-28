import logger from '../utils/logger';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
  const { to, subject, html } = payload;
  
  // Checking configured driver
  const provider = process.env.EMAIL_PROVIDER || 'mock';

  try {
    if (provider === 'sendgrid' && process.env.SENDGRID_API_KEY) {
      logger.info(`Sending email via SendGrid to: ${to} | Subject: ${subject}`);
      // Simulated SendGrid SDK call
      return true;
    } 
    
    if (provider === 'smtp' && process.env.SMTP_HOST) {
      logger.info(`Sending email via SMTP to: ${to} | Subject: ${subject}`);
      // Simulated SMTP Transporter call
      return true;
    }

    // Default: Mock Logging to console (Winston)
    logger.info(`✉️  [MOCK EMAIL SENT]
      TO: ${to}
      SUBJECT: ${subject}
      BODY: ${html.replace(/<[^>]*>/g, '').substring(0, 200)}...`);
    return true;
  } catch (error: any) {
    logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
    return false;
  }
};

export const sendInquiryNotification = async (inquiry: any) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cosmalac.com';
  const html = `
    <h2>New Inquiry Received</h2>
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
