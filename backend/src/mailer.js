import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendMail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"Minha Geladeira" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}
