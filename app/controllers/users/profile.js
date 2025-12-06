const { Users } = require("../../models/usersModel");

const profile = async (req, reply) => {
    try {
        const userId = req.user._id; // Payload structure from login: { id, username, email, ... }

        // Optimized Query: Select specific fields, lean
        const user = await Users.findById(userId)
            .select("name username email verifyStatus unique_id profile_picture createdAt")
            .lean();

        if (!user) {
            return reply.code(404).send({
                success: false,
                message: "User not found",
            });
        }

        return reply.code(200).send({
            success: true,
            message: "Profile retrieved successfully",
            result: user,
        });

    } catch (error) {
        console.error("Profile Error:", error);
        return reply.code(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { profile };
