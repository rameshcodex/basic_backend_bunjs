const { z } = require("zod");

const verifyOtpValidator = z.object({
    email: z
        .string({ error: "Email is required" })
        .refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: "Please enter email" }
        )
        .email({ error: "Please enter valid email" }),

    otp: z
        .string({ error: "OTP is required" })
        .refine((val) => val.toString().length === 6, { message: "OTP must be 6 digits" })
});

module.exports = { verifyOtpValidator };
