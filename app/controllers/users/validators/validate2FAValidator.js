const { z } = require("zod");

const validate2FAValidator = z.object({
    token: z
        .string({ error: "2FA token is required" })
        .length(6, { message: "2FA token must be exactly 6 digits" })
        .regex(/^\d{6}$/, { message: "2FA token must contain only numbers" }),
});

module.exports = { validate2FAValidator };
