const { Users } = require("../../models/usersModel");
const { resetPasswordValidator } = require("./vaidators");
const { zodValidate } = require("../../middleware/utils/zodValidate");

export const resetPassword = async (req, reply) => {
    try {
        // 1. Validate Input
        const result = await zodValidate(req, reply, resetPasswordValidator);
        if (!result.success) return;

        const { email, otp, newPassword } = result.data;

        // 2. Find user with forgot password OTP
        const user = await Users.findOne({ email }).select("forgotPasswordOtp email").lean();

        if (!user) {
            return reply.code(404).send({
                success: false,
                result: null,
                message: "Email not found",
            });
        }

        // 3. Check if OTP exists
        if (!user.forgotPasswordOtp) {
            return reply.code(400).send({
                success: false,
                result: null,
                message: "No password reset request found. Please request a new OTP.",
            });
        }

        // 4. Verify OTP
        if (user.forgotPasswordOtp != otp) {
            return reply.code(400).send({
                success: false,
                result: null,
                message: "Invalid OTP",
            });
        }

        // 5. Hash new password
        const hashedPassword = await Bun.password.hash(newPassword);

        // 6. Update password and clear OTP fields
        await Users.updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { forgotPasswordOtp: "", lastForgotPasswordOtpSentAt: "" }
            }
        );

        return reply.code(200).send({
            success: true,
            result: null,
            message: "Password reset successfully. You can now login with your new password.",
        });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return reply.code(500).send({
            success: false,
            result: null,
            message: "Internal Server Error",
        });
    }
};

// module.exports = { resetPassword };
