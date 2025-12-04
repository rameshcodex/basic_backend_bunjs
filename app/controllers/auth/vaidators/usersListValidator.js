const { z } = require("zod");

const validateUser = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email format" }),

    password: z
        .string({ required_error: "Password is required" })   // VERY IMPORTANT
        .min(6, { message: "Password must be 6 chars" })
});

module.exports = { validateUser };
