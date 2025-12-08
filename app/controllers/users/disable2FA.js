const { Users } = require("../../models/usersModel");
const { authenticator } = require("otplib");
const { disable2FAValidator } = require("./validators");
const { zodValidate } = require("../../middleware/utils/zodValidate");

export const disable2FA = async (req, reply) => {
    try {
        const userId = req.user._id;

        // 1. Validate Input
        const result = await zodValidate(req, reply, disable2FAValidator);
        if (!result.success) return;

        const { token } = result.data;

        // 2. Get user with 2FA credentials
        const user = await Users.findById(userId).select("2fastatus 2fa_credentials").lean();

        if (!user) {
            return reply.code(404).send({
                success: false,
                result: null,
                message: "User not found",
            });
        }

        // 3. Check if 2FA is enabled
        if (!user["2fastatus"]) {
            return reply.code(400).send({
                success: false,
                result: null,
                message: "2FA is not enabled",
            });
        }

        // 4. Check if secret exists
        if (!user["2fa_credentials"] || !user["2fa_credentials"].secret) {
            return reply.code(400).send({
                success: false,
                result: null,
                message: "No 2FA credentials found",
            });
        }

        // 5. Verify the token before disabling
        const secret = user["2fa_credentials"].secret;
        const isValid = authenticator.verify({ token, secret });

        if (!isValid) {
            return reply.code(400).send({
                success: false,
                result: null,
                message: "Invalid 2FA token. Please try again.",
            });
        }

        // 6. Disable 2FA and clear credentials
        await Users.updateOne(
            { _id: userId },
            {
                $set: { "2fastatus": false },
                $unset: { "2fa_credentials": "" }
            }
        );

        return reply.code(200).send({
            success: true,
            result: null,
            message: "2FA disabled successfully. Your account is no longer protected with two-factor authentication.",
        });

    } catch (error) {
        console.error("Disable 2FA Error:", error);
        return reply.code(500).send({
            success: false,
            result: null,
            message: "Internal Server Error",
        });
    }
};

// module.exports = { disable2FA };
