const { z } = require("zod");

const forgotPasswordValidator = z.object({
    email: z
        .string({ error: "Email is required" })
        .refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: "Please enter email" }
        )
        .email({ error: "Please enter valid email" }),
});

module.exports = { forgotPasswordValidator };
