const { Users } = require("../../models/usersModel");
const { authenticator } = require("otplib");
const { validate2FALoginValidator } = require("./vaidators");
const { zodValidate } = require("../../middleware/utils/zodValidate");
const { generateToken } = require("../../middleware/utils/pasetoService");

export const validate2FALogin = async (req, reply) => {
    try {
        // 1. Validate Input
        const result = await zodValidate(req, reply, validate2FALoginValidator);
        if (!result.success) return;

        const { userId, token } = result.data;

        // 2. Get user with 2FA credentials
        const user = await Users.findById(userId).select("name username email verifyStatus 2fastatus 2fa_credentials").lean();

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
                message: "2FA is not enabled for this account",
            });
        }

        // 4. Check if secret exists
        if (!user["2fa_credentials"] || !user["2fa_credentials"].secret) {
            return reply.code(500).send({
                success: false,
                result: null,
                message: "2FA configuration error. Please contact support.",
            });
        }

        // 5. Verify the token
        const secret = user["2fa_credentials"].secret;
        const isValid = authenticator.verify({ token, secret });

        if (!isValid) {
            return reply.code(401).send({
                success: false,
                result: null,
                message: "Invalid 2FA code. Please try again.",
            });
        }

        // 6. Generate auth token
        const authToken = await generateToken({
            id: user._id,
            username: user.username,
            email: user.email,
        });

        return reply.code(200).send({
            success: true,
            message: "2FA verification successful. Login complete.",
            result: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                verifyStatus: user.verifyStatus,
                token: authToken,
            },
        });

    } catch (error) {
        console.error("Validate 2FA Login Error:", error);
        return reply.code(500).send({
            success: false,
            result: null,
            message: "Internal Server Error",
        });
    }
};

// module.exports = { validate2FALogin };
