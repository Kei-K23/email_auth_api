import nodemailer, { SendMailOptions } from "nodemailer";
import config from "config";
import { logger } from "./logger";
//! testing creds for only first time to get creds
// async function createTestCred() {
//   const cred = await nodemailer.createTestAccount();
// }

// createTestCred();
const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>("smtp");
const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) return logger.error("error while sending email");
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;
