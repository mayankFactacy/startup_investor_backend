import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS 
      },
    });

    const mailOptions = {
      from: "mayank@factacy.ai",
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error(error); // full error stack
    throw error;
  }
};

export default sendEmail;
