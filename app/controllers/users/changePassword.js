const { Users } = require("../../models/usersModel");
const { changePasswordValidator } = require("./validators");
const { zodValidate } = require("../../middleware/utils/zodValidate");

export const changePassword = async (req, reply) => {
    try {
        const userId = req.user._id;

        // 1. Validate Input
        const result = await zodValidate(req, reply, changePasswordValidator);
        if (!result.success) return;

        const { oldPassword, newPassword } = result.data;

        // 2. Get user with password field
        const user = await Users.findById(userId).select("+password").lean();

        if (!user) {
            return reply.code(404).send({
                success: false,
                result: null,
                message: "User not found",
            });
        }

        // 3. Verify old password using Bun's password verification
        const isOldPasswordValid = await Bun.password.verify(oldPassword, user.password);

        if (!isOldPasswordValid) {
            return reply.code(400).send({
                success: false,
                result: null,
                message: "Old password is incorrect",
            });
        }

        // 4. Check if new password is same as old password
        if (oldPassword === newPassword) {
            return reply.code(400).send({
                success: false,
                result: null,
                message: "New password must be different from old password",
            });
        }

        // 5. Hash new password
        const hashedNewPassword = await Bun.password.hash(newPassword);

        // 6. Update password
        await Users.updateOne(
            { _id: userId },
            { $set: { password: hashedNewPassword } }
        );

        return reply.code(200).send({
            success: true,
            result: null,
            message: "Password changed successfully",
        });

    } catch (error) {
        console.error("Change Password Error:", error);
        return reply.code(500).send({
            success: false,
            result: null,
            message: "Internal Server Error",
        });
    }
};

// module.exports = { changePassword };
