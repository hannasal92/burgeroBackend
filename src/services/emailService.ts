import nodemailer from "nodemailer";

interface EmailOptions {
  name: string;
  email: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ name, email, subject, text, html }: EmailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your gmail address
        pass: process.env.GMAIL_PASS, // your gmail app password (use App Password)
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER, // where you want to receive emails
      subject,
      text, // plain text version
      html, // HTML version
    });

    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Error sending email:", err);
  }
}