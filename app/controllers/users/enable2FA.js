const { Users } = require("../../models/usersModel");
const { authenticator } = require("otplib");
const QRCode = require("qrcode");

export const enable2FA = async (req, reply) => {
    try {
        const userId = req.user._id;

        // 1. Get user
        const user = await Users.findById(userId).select("email name 2fastatus 2fa_credentials").lean();

        if (!user) {
            return reply.code(404).send({
                success: false,
                result: null,
                message: "User not found",
            });
        }

        // 2. Check if 2FA is already enabled
        if (user["2fastatus"]) {
            return reply.code(400).send({
                success: false,
                result: null,
                message: "2FA is already enabled. Disable it first to generate a new secret.",
            });
        }

        // 3. Generate TOTP secret
        const secret = authenticator.generateSecret();

        // 4. Generate OTP Auth URL for QR code
        // Format: otpauth://totp/AppName:user@email.com?secret=SECRET&issuer=AppName
        const appName = process.env.APP_NAME || "MyApp";
        const otpauthUrl = authenticator.keyuri(user.email, appName, secret);

        // 5. Generate QR Code as Data URL
        const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

        // 6. Store secret in database (but don't enable 2FA yet)
        await Users.updateOne(
            { _id: userId },
            {
                $set: {
                    "2fa_credentials": {
                        secret: secret,
                        qrCodeUrl: qrCodeDataUrl,
                    }
                }
            }
        );

        return reply.code(200).send({
            success: true,
            result: {
                qrCode: qrCodeDataUrl,
                secret: secret,
                message: "Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)",
            },
            message: "2FA setup initiated. Please scan the QR code and verify with a token to complete activation.",
        });

    } catch (error) {
        console.error("Enable 2FA Error:", error);
        return reply.code(500).send({
            success: false,
            result: null,
            message: "Internal Server Error",
        });
    }
};

// module.exports = { enable2FA };
