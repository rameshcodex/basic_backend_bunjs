const { z } = require("zod");

const loginValidator = z.object({
    email: z
        .string({ error: "Email or Username is required" })
        .refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: "Please enter Email or Username" }
        ),
    password: z
        .string({ error: "Password is required" })
        .refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: "Please enter Password" }
        ),
});

module.exports = { loginValidator };
