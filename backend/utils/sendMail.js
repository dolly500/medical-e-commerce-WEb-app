const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  // const transporter = nodemailer.createTransport({
  //     host: process.env.SMPT_HOST,
  //     port: process.env.SMPT_PORT,
  //     service: process.env.SMPT_SERVICE,
  //     auth:{
  //         user: process.env.SMPT_MAIL,
  //         pass: process.env.SMPT_PASSWORD,
  //     },
  //     secure: true, // Use SSL
  //     tls: {
  //         // Trust self-signed certificate
  //         rejectUnauthorized: false,

  //     },
  // });
  const transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
