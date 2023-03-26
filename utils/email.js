const catchAsync = require('./catchAsync');

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //Activate in gmail "less secure app" option
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Xmar jeet <hello@xmar.io',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //   console.log(
  //     process.env.EMAIL_HOST,
  //     process.env.EMAIL_PORT,
  //     process.env.EMAIL_USERNAME,
  //     process.env.EMAIL_PASSWORD
  //   );
  //console.log(mailOptions);
  //3) Actually send the email

  await transporter.sendMail(mailOptions);

  //console.log('from mail', result);
  // next();
};

module.exports = sendEmail;
