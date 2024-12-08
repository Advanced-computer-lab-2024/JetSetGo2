const nodemailer = require("nodemailer");

const sendEmailFlag = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service
    auth: {
      user: "marwanallam163@gmail.com", // Your email
      pass: "himy vxuv rfvz znqw", // Your email password
    },
  });

  const mailOptions = {
    from: "marwanallam163@gmail.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmailFlag;