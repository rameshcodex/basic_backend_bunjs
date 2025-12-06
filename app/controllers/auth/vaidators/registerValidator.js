const { z } = require("zod");

const registerValidator = z.object({
    name: z
        .string({ error: "Name is required" })
        .refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: "Please enter Name" }
        ),

    username: z
        .string({ error: "Username is required" })
        .refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: "Please enter Username" }
        ),

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
        )
        .min(6, "Password must be at least 6 characters")
        .refine((val) => /[A-Z]/.test(val), { message: "Password must contain at least one uppercase letter" })
        .refine((val) => /[a-z]/.test(val), { message: "Password must contain at least one lowercase letter" })
        .refine((val) => /[0-9]/.test(val), { message: "Password must contain at least one number" })
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), { message: "Password must contain at least one symbol" })
        .refine((val) => !["password", "123456", "12345678", "qwerty", "admin"].includes(val.toLowerCase()), { message: "Password cannot be a common password" }),
})
// .superRefine((data, ctx) => {
//     if (data.email && data.password) {
//         const emailUsername = data.email.split("@")[0];
//         // Split username by common delimiters (., _, -) and also check the whole username
//         const parts = emailUsername.split(/[._-]/).filter(part => part.length >= 3);
//         parts.push(emailUsername); // Add regular username too

//         for (const part of parts) {
//             if (data.password.toLowerCase().includes(part.toLowerCase())) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: "Password cannot contain parts of your email username",
//                     path: ["password"],
//                 });
//                 return; // Exit after first match to avoid duplicates
//             }
//         }

//         if (data.password.toLowerCase().includes(data.email.toLowerCase())) {
//             ctx.addIssue({
//                 code: z.ZodIssueCode.custom,
//                 message: "Password cannot contain your email",
//                 path: ["password"],
//             });
//         }
//     }
// });

module.exports = { registerValidator };
