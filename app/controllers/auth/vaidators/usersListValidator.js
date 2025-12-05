const { z } = require("zod");

const validateUser = z.object({
    email: z
        .string({ error: "Email is required" })
        .refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: "Please enter email" }
        )
        .email({ error: "Please enter valid email" }),

    password: z
        .string({ error: "Password is required" })
        .refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: "Please enter Password" }
        ),

    age: z
        .number({ error: "Age is required" })
        .refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: "Please enter Age" }
        ),

    userObjet: z.any(), // anything Like object or any other Data Type
    userArray: z.array(z.any()).nullable(),
});

module.exports = { validateUser };
