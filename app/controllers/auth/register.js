const { Users } = require("../../models/usersModel");
const { registerValidator } = require("./vaidators");
const { zodValidate } = require("../../middleware/utils/zodValidate");
const { sendRegistrationEmailMessage } = require("../../middleware/utils/emailService");
const ejs = require("ejs");

// ⭐ Bun replacement for path.join(__dirname, "..")
const templatePath = new URL("../../../views/verifyOtp.ejs", import.meta.url);

const register = async (req, reply) => {
    try {
        // 1. Validate Input
        const result = await zodValidate(req, reply, registerValidator);
        if (!result.success) return;
        const { name, username, email, password } = result.data;

        // 2. Check duplicate user
        const existingUser = await Users.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return reply.code(409).send({
                success: false,
                message:
                    existingUser.email === email
                        ? "Email already registered"
                        : "Username already taken",
            });
        }

        // 3. Hash Password (Bun-native)
        const hashedPassword = await Bun.password.hash(password);

        // 4. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // 5. Save New User
        const newUser = await Users.create({
            name,
            username,
            email,
            password: hashedPassword,
            emailotp: otp,
        });

        // 6. Load & render EJS template (Fast Bun I/O)
        const template = await Bun.file(templatePath).text();
        const emailHtml = ejs.render(template, {
            otp,
            username: newUser.name,
        });

        // 7. Send email
        await sendRegistrationEmailMessage(req, newUser, emailHtml);

        return reply.code(201).send({
            success: true,
            message: "User registered successfully. Check your email for OTP.",
            result: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
            },
        });

    } catch (error) {
        console.error("Register Error:", error);
        return reply.code(500).send({
            success: false,
            result: null,
            message: "Internal Server Error",
        });
    }
};

module.exports = { register };
