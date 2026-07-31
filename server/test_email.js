import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'support.packwise@gmail.com',
    pass: 'aksb mxwf edmc zkqa'
  }
});

transporter.verify()
  .then(() => console.log('SMTP Connection Success'))
  .catch(e => console.error('SMTP Connection Error', e));
