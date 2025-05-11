const mongo = require('mongoose')
const mailSender = require('../utils/mailSender')
const otpMail = require('../mails/otp');

const otpSchema = new mongo.Schema({
    otp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: '15m',
    }
})

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
    // Create a transporter to send emails

    // Define the email options

    // Send the email
    try {
        await mailSender(
            email,
            "Verification Email",
            otpMail(otp)
        );

    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

async function sendVerificationPhone(phone, otp) {
    try {
        console.log(phone);
        console.log(otp);
        // console.log(typeof(Number(otp)))
        // return;
        var unirest = require("unirest");

        var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

        req.query({
            // "authorization": '',
            "authorization": process.env.FAST2SMSKEY,
            "variables_values": Number(otp),
            "route": "otp",
            "numbers": `${phone}`
        });

        req.headers({
            "cache-control": "no-cache"
        });


        req.end(function (res) {
            console.log(res.body);
        });
    } catch (err) {
        console.log(err);
    }
}

// Define a post-save hook to send email after the document has been saved
otpSchema.post("save", async function () {
    // Only send an email when a new document is created
    if (this.email) {
        await sendVerificationEmail(this.email, this.otp);
    }
    if (this.phone) {
        await sendVerificationPhone(this.phone, this.otp);
    }
});

module.exports = mongo.model('OTP', otpSchema);