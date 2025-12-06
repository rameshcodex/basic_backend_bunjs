const { Users } = require("../../models/usersModel");
const { verifyOtpValidator } = require("./vaidators");
const { zodValidate } = require("../../middleware/utils/zodValidate");

const verifyOtp = async (req, reply) => {
    try {
        const result = await zodValidate(req, reply, verifyOtpValidator);
        if (!result.success) return;

        const { email, otp } = result.data;

        const user = await Users.findOne({ email }).select("verifyStatus emailotp").lean();

        if (!user) {
            return reply.code(404).send({
                success: false,
                result: null,
                message: "Email not found",
            });
        }

        if (user.verifyStatus) {
            return reply.code(400).send({
                success: false,
                result: null,
                message: "User already verified",
            });
        }

        if (user.emailotp != otp) {
            return reply.code(400).send({
                success: false,
                result: null,
                message: "Invalid OTP",
            });
        }

        // Verify successful
        await Users.updateOne({ _id: user._id }, { $set: { verifyStatus: true, emailotp: null } });

        return reply.code(200).send({
            success: true,
            result: null,
            message: "Email verified successfully",
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return reply.code(500).send({
            success: false,
            result: null,
            message: "Internal Server Error",
        });
    }
};

module.exports = { verifyOtp };
