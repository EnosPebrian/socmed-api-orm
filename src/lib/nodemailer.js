const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  auth: {
    user: process.env.nodemailer_email,
    pass: process.env.nodemailer_password,
  },
  host: "smtp.gmail",
  service: "gmail",
});

const mailer = async ({ subject, html, to, text }) => {
  await transport.sendMail({
    subject: subject || "testing by Enso",
    html: html || "<h1>Send By API Enos</h1>",
    to: to || "enospebrian1@gmail.com",
    text: text || "Hell-o MRdwnQdry",
  });
};

module.exports = mailer;
