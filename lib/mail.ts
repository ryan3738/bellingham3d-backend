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

function makeANiceEmail(text: string) {
  return `
    <div style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text}</p>

    <p>-Bellingham3D</p>
    </div>
  `;
}

async function sendPasswordResetEmail(resetToken: string, to: string): Promise<void> {
  // email the user a token
  const info = await transport.sendMail({
    to,
    from: process.env.MAIL_USER,
    subject: 'Your password reset token!',
    html: makeANiceEmail(`Your Password Reset Token is here!
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
    subject: 'Your magic auth link!',
    html: makeANiceEmail(`Click the magic auth link to sign in!
      <a href="${process.env.FRONTEND_URL}/magicauth?token=${resetToken}">Click Here to Sign in</a>
    `),
  });
  // Checks for 'fake' email service and console logs the url
  if (process.env.MAIL_USER?.includes('ethereal.email')) {
    console.log(`Message Sent! Preview it at ${getTestMessageUrl(info)}`);
  }
}

export { sendMagicAuthEmail, sendPasswordResetEmail };
