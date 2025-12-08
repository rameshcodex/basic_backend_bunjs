const { Users } = require("../../models/usersModel");
const { forgotPasswordValidator } = require("./vaidators");
const { zodValidate } = require("../../middleware/utils/zodValidate");
const { prepareToSendEmail } = require("../../middleware/utils/emailService");
const ejs = require("ejs");

// ⭐ Bun replacement for path.join(__dirname, "..")
const templatePath = new URL("../../../views/verifyOtp.ejs", import.meta.url);

export const forgotPassword = async (req, reply) => {
    try {
        // 1. Validate Input
        const result = await zodValidate(req, reply, forgotPasswordValidator);
        if (!result.success) return;

        const { email } = result.data;

        // 2. Check if user exists
        const user = await Users.findOne({ email }).select("email name verifyStatus lastForgotPasswordOtpSentAt").lean();

        if (!user) {
            return reply.code(404).send({
                success: false,
                result: null,
                message: "Email not found",
            });
        }

        // 3. Check if user is verified
        if (!user.verifyStatus) {
            return reply.code(400).send({
                success: false,
                result: null,
                message: "Please verify your email first before resetting password",
            });
        }

        // 4. Check if OTP was sent within the last 1 minute (rate limiting)
        if (user.lastForgotPasswordOtpSentAt) {
            const currentTime = new Date();
            const lastSentTime = new Date(user.lastForgotPasswordOtpSentAt);
            const timeDifferenceInSeconds = (currentTime - lastSentTime) / 1000;

            if (timeDifferenceInSeconds < 60) {
                const remainingSeconds = Math.ceil(60 - timeDifferenceInSeconds);
                return reply.code(429).send({
                    success: false,
                    result: null,
                    message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
                });
            }
        }

        // 5. Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // 6. Update user with new OTP and timestamp
        await Users.updateOne(
            { _id: user._id },
            { $set: { forgotPasswordOtp: otp, lastForgotPasswordOtpSentAt: new Date() } }
        );

        // 7. Load & render EJS template (Fast Bun I/O)
        const template = await Bun.file(templatePath).text();
        const emailHtml = ejs.render(template, {
            otp,
            username: user.name,
        });

        // 8. Send email
        const subject = "Reset Your Password - OTP";
        prepareToSendEmail(user, subject, emailHtml, req);

        return reply.code(200).send({
            success: true,
            result: null,
            message: "Password reset OTP sent to your email. Please check your inbox.",
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return reply.code(500).send({
            success: false,
            result: null,
            message: "Internal Server Error",
        });
    }
};

// module.exports = { forgotPassword };
