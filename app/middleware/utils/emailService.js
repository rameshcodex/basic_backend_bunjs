const nodemailer = require('nodemailer');
/**
 * Sends email
 * @param {Object} data - data
 * @param {Function} callback - callback
 */
const sendEmail = async (data = {}, callback) => {
    const auth = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    const transporter = nodemailer.createTransport(auth);
    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
        to: `${data.user.email}`,
        subject: data.subject,
        html: data.htmlMessage
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.log(err, "email error");
            return callback(err);
        }
        return callback(true);
    });
};

/**
 * Prepares to send email
 * @param {Object} user - user object
    * @param {string} subject - subject
    * @param {string} htmlMessage - html message
    * @param {string | number} otp - otp code for logging
    */
const prepareToSendEmail = (user = {}, subject = '', htmlMessage = '', req = null) => {
    const data = {
        user,
        subject,
        htmlMessage
    };

    sendEmail(data, (messageSent) => {
        if (messageSent == true) {
            console.log(`Email SENT to: ${user.email}`);
            if (req) {
                req.log.emailotp({ email: user.email, status: 'success' }, 'OTP Email Sent Successfully');
            }
        } else {
            console.log(`Email FAILED to: ${user.email} ${JSON.stringify(messageSent)}`);
            if (req) {
                req.log.emailotp({ email: user.email, status: 'failed' }, JSON.stringify(messageSent));
            }
        }
    });
};

/**
 * Sends registration email
 * @param {Object} user - user object
    * @param {string} str - html content
    */
const sendRegistrationEmailMessage = (req, user = {}, str) => {
    // i18n.setLocale(locale);
    const subject = 'Verify OTP';
    prepareToSendEmail(user, subject, str, req);
};

module.exports = { sendRegistrationEmailMessage, prepareToSendEmail };
