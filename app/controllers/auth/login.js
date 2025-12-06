const { Users } = require("../../models/usersModel");
const { loginValidator } = require("./vaidators");
const { zodValidate } = require("../../middleware/utils/zodValidate");
const { generateToken } = require("../../middleware/utils/pasetoService");

const login = async (req, reply) => {
    try {
        const result = await zodValidate(req, reply, loginValidator);
        if (!result.success) return;

        const { email, password } = result.data;

        // Find user by email OR username using the 'email' input field
        // Find user by email OR username using the 'email' input field
        const user = await Users.findOne({
            $or: [{ email: email }, { username: email }],
        })
            .select("+password name username email verifyStatus") // password might be excluded by default in schema, standard practice, but here explicitly selecting everything needed. assuming schema implementation.
            // If password is NOT select: false in schema, then we don't need +password. But to be safe and optimized:
            .lean();

        if (!user) {
            return reply.code(401).send({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Verify Password
        const isMatch = await Bun.password.verify(password, user.password);
        if (!isMatch) {
            return reply.code(401).send({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Check Verify Status
        if (!user.verifyStatus) {
            return reply.code(403).send({ // 403 Forbidden seems appropriate for unverified
                success: false,
                result: null, // As requested "error email and password match all are checked" -> implies we found the user and password matched, BUT verify failure.
                message: "Please verify your email first",
            });
        }

        const token = await generateToken({
            id: user._id,
            username: user.username,
            email: user.email,
        });

        // Success
        return reply.code(200).send({
            success: true,
            message: "Login successful",
            result: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                verifyStatus: user.verifyStatus,
                token,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        return reply.code(500).send({
            success: false,
            result: null,
            message: "Internal Server Error",
        });
    }
};

module.exports = { login };
