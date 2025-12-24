// services/whatsappService.js
import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = "whatsapp:+14155238886"; // Twilio sandbox number

const client = Twilio(accountSid, authToken);

export const sendWhatsAppMessage = async (to: any, message: any) => {
  try {
    const msg = await client.messages.create({
      from: whatsappFrom,
      to: `whatsapp:${to}`, // user phone number in international format
      body: message,
    });
    console.log("WhatsApp message sent:", msg.sid);
    return msg;
  } catch (err) {
    console.error("Failed to send WhatsApp message:", err);
    throw err;
  }
};