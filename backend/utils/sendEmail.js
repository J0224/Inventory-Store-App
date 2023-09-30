const nodemailer = require("nodemailer");

//This is an async function called sendEmail to send an email link to the user to change the password

const sendEmail = async (subject, message, send_to, sent_from, reply_to ) => {
  //Create the email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS,

    },
    tls:{
      rejectUnauthorized: false
    }
  })

  //Option for sending email 
  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,
  }

  //Send Email

  transporter.sendMail(options, function(err, info){
    if (err){
      console.log(err);
    } else{
      console.log(info);
    }
  });

};

module.exports = sendEmail