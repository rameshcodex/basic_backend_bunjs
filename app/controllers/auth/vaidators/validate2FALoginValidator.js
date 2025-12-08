const { z } = require("zod");

const validate2FALoginValidator = z.object({
    userId: z
        .string({ error: "User ID is required" })
        .min(1, { message: "User ID cannot be empty" }),

    token: z
        .string({ error: "2FA token is required" })
        .length(6, { message: "2FA token must be exactly 6 digits" })
        .regex(/^\d{6}$/, { message: "2FA token must contain only numbers" }),
});

module.exports = { validate2FALoginValidator };
