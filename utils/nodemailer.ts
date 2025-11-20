import nodemailer from "nodemailer";
// Create a test account or replace with real credentials.
const username=process.env.EMAIL_USERNAME!;
const password=process.env.EMAIL_PASSWORD!;
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user:username,
    pass:password,
  },
});

// await transporter.verify();
console.log("Server is ready to take our messages");

export default transporter;