const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount(); // use if we do not have real mail id

  //smpt server connection.
  let transport = await nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "1da19cs141.cs@drait.edu.in",
      pass: "samipg123",
    },
  });

  let details = {
    from: "1da19cs141.cs@drait.edu.in",
    to: "samippokhrel17@gmail.com",
    subject: "NodeMailer Testing",
    text: "We successfully received the mail",
  };

  transport.sendMail(details, (err) => {
    if (err) {
      console.log("it has an error", err);
    } else {
      console.log("Email send successfully");
    }
  });

  res.send("sending mail");
};

module.exports = { sendMail };
