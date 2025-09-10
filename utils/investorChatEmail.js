import nodemailer from "nodemailer"

const sendInvestorMail = async (to, from, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: "981mayankchauhan@gmail.com", 
        pass: "ligp zxur equv bchm", 
      },
    });

    const mailOptions = {
      from:`"${from}" <981mayankchauhan@gmail.com>`,
      to:to,
      subject,
      body,
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

export default sendInvestorMail;