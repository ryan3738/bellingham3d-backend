import { createTransport, getTestMessageUrl } from 'nodemailer';

// For actual program will need to singup for transactional email service like "postmark" or "sendgrid"
const transport = createTransport({
  // @ts-ignore
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function emailTemplate(text: string) {
  return `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: left;
      border: 1px solid black;
      background-color: #d3d3d3;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 16px;
    ">
      <div style="
        max-width: 600px;
        margin: 2rem;
      ">
        <h1>Hello There!</h1>
        <div style="
          padding: 1rem 2rem;
          background-color: #f3f3f3;
          height: auto;
          border-radius: 6px;
        ">${text}</div>
      <p style="margin: 1rem 0;">-Bellingham3D</p>
      </div>
    </div>
  `;
}

async function sendPasswordResetEmail(resetToken: string, to: string): Promise<void> {
  // email the user a token
  const info = await transport.sendMail({
    to,
    from: process.env.MAIL_USER,
    subject: 'Your password reset token!',
    html: emailTemplate(`Your Password Reset Token is here!
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
    `),
  });
  // Checks for 'fake' email service and console logs the url
  if (process.env.MAIL_USER?.includes('ethereal.email')) {
    console.log(`Message Sent! Preview it at ${getTestMessageUrl(info)}`);
  }
}

async function sendMagicAuthEmail(resetToken: string, to: string): Promise<void> {
  // email the user a token
  const info = await transport.sendMail({
    to,
    from: process.env.MAIL_USER,
    subject: 'Your sign in link has arrived!',
    html: emailTemplate(`
    <h2>Please Sign In Below</h2>
      <a href="${process.env.FRONTEND_URL}/magicauth?token=${resetToken}&email=${to}">Click Here to Sign in</a>
      <p style="margin: 1rem 0;">
        If you received this email by mistake, simply delete it. You
        won&apos;t be signed in if you don&apos;t click the link above.
      </p>
      <p style="margin: 1rem 0;">
        For questions about this email, please contact: ${process.env.MAIL_USER}
      </p>
    `),
  });
  // Checks for 'fake' email service and console logs the url
  if (process.env.MAIL_USER?.includes('ethereal.email')) {
    console.log(`Message Sent! Preview it at ${getTestMessageUrl(info)}`);
  }
}

export { sendMagicAuthEmail, sendPasswordResetEmail };
