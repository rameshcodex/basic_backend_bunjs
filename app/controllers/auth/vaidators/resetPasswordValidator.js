const { z } = require("zod");

const resetPasswordValidator = z.object({
    email: z
        .string({ error: "Email is required" })
        .refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: "Please enter email" }
        )
        .email({ error: "Please enter valid email" }),

    otp: z
        .string({ error: "OTP is required" })
        .refine((val) => val.toString().length === 6, { message: "OTP must be 6 digits" }),

    newPassword: z
        .string({ error: "New password is required" })
        .min(8, { message: "New password must be at least 8 characters long" })
        .max(100, { message: "New password must not exceed 100 characters" })
        .regex(/[A-Z]/, { message: "New password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "New password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "New password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "New password must contain at least one special character" }),

    confirmPassword: z
        .string({ error: "Confirm password is required" })
        .min(1, { message: "Confirm password cannot be empty" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
});

module.exports = { resetPasswordValidator };
