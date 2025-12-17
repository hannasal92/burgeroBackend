import nodemailer from "nodemailer";

export async function sendEmail({ name, email, subject, message }: { name: string; email: string; subject: string; message: string }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your gmail address
        pass: process.env.GMAIL_PASS, // your gmail app password
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER, // where you want to receive the emails
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });

    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Error sending email:", err);
  }
}