import 'dotenv/config';
import { sendWelcomeEmail } from './services/email.service.js';

const run = async () => {
  console.log('Sending test welcome email...');
  const success = await sendWelcomeEmail('support.packwise@gmail.com', 'Antigravity User');
  if (success) {
    console.log('Email sent successfully!');
  } else {
    console.log('Failed to send email.');
  }
};

run();
