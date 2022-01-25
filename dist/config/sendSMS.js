"use strict";
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = void 0;
const twilio_1 = require("twilio");
// and set the environment variables. See http://twil.io/secure
const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;
const from = `${process.env.TWILIO_PHONE_NUMBER}`;
const client = new twilio_1.Twilio(accountSid, authToken);
const sendSms = (to, body, txt) => {
    try {
        client.messages
            .create({
            body: `blog hiep ${txt} - ${body}`,
            from,
            to
        })
            .then((message) => console.log(message.sid));
    }
    catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    }
};
exports.sendSms = sendSms;
