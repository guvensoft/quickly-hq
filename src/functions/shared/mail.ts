import nodemailer from "nodemailer";
import { googleAuthGmailKey } from '../../configrations/secrets';

const INFO_ADDRESS = 'info@quickly.com.tr';
const SUPPORT_ADDRESS = 'support@quickly.com.tr';

const Transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: INFO_ADDRESS,
    serviceClient: googleAuthGmailKey.client_id,
    privateKey: googleAuthGmailKey.private_key,
  },
});

export const sendMail = async (sent_to: string, title: string, message: string , extras?: nodemailer.SendMailOptions) => {
  try {
    await Transporter.verify();
    await Transporter.sendMail({
      from: INFO_ADDRESS,
      to: sent_to,
      subject: title,
      text: message,
      ...extras
    });
  } catch (err) {
    console.error(err);
  }
} 