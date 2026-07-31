import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'support.packwise@gmail.com',
    pass: 'aksb mxwf edmc zkqa'
  }
});

transporter.sendMail({
  from: '"Voyage Genie" <support.packwise@gmail.com>',
  to: 'support.packwise@gmail.com',
  subject: 'Test Email from Local',
  text: 'This is a test email.'
})
.then(() => console.log('Email sent successfully'))
.catch(err => console.error('Error sending email:', err));
