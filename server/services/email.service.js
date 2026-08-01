import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (userEmail, userName) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Skipping Welcome Email: SMTP credentials missing from .env');
    return false;
  }

  const displayName = userName || 'Traveler';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #030712; color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <div style="background: linear-gradient(135deg, #1d4ed8 0%, #208AEF 100%); padding: 40px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 36px; color: #ffffff; font-weight: 800; letter-spacing: 1px;">Voyage Genie</h1>
        <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 18px;">Your AI Travel Companion</p>
      </div>
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #f8fafc; font-size: 24px; margin-top: 0;">Welcome aboard, ${displayName}! ✈️</h2>
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          We are absolutely thrilled to have you join Voyage Genie. Our AI is ready to help you plan the most magical, stress-free trips of your life.
        </p>
        
        <div style="background-color: #111827; border-left: 4px solid #208AEF; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #ffffff; margin-top: 0; font-size: 18px;">What's next?</h3>
          <ul style="color: #94a3b8; font-size: 15px; line-height: 1.6; padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 10px;">Chat with our AI to build your first personalized itinerary.</li>
            <li style="margin-bottom: 10px;">Track your budget and expenses in real-time.</li>
            <li>Export your plans to a beautiful PDF to share with friends.</li>
          </ul>
        </div>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
          If you ever need help, just reply to this email. We've got your back!
        </p>
        
        <div style="margin-top: 40px; text-align: center;">
          <p style="color: #64748b; font-size: 14px; margin-bottom: 5px;">Happy Travels,</p>
          <p style="color: #f8fafc; font-weight: bold; font-size: 16px; margin: 0;">The Voyage Genie Team</p>
        </div>
      </div>
      
      <div style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #1e293b;">
        <p style="color: #475569; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Voyage Genie. All rights reserved.
        </p>
      </div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Voyage Genie Team" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'Welcome to Voyage Genie! ✈️',
      html: htmlContent
    });

    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
};
