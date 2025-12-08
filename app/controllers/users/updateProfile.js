const { Users } = require("../../models/usersModel");
const path = require("path");
const fs = require("fs").promises;
const crypto = require("crypto");

const updateProfile = async (req, reply) => {
    try {
        const userId = req.user._id;

        // Get multipart data
        const data = await req.file();

        if (!data) {
            return reply.code(400).send({
                success: false,
                message: "No data provided",
            });
        }

        // Extract fields from FormData
        let name = null;
        let profilePictureUrl = null;

        // Check if there's a file (profile picture)
        if (data.file) {
            // Generate unique filename
            const fileExtension = path.extname(data.filename);
            const uniqueFilename = `${userId}_${crypto.randomBytes(8).toString('hex')}${fileExtension}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads");
            const filePath = path.join(uploadDir, uniqueFilename);

            // Validate file type (only images)
            const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedMimeTypes.includes(data.mimetype)) {
                return reply.code(400).send({
                    success: false,
                    message: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
                });
            }

            // Save file to disk using Bun's fast I/O
            const buffer = await data.toBuffer();
            await Bun.write(filePath, buffer);

            // Create URL for the uploaded image
            profilePictureUrl = `${process.env.BACKEND_URL}/uploads/${uniqueFilename}`;
        }

        // Get name from fields if provided
        const fields = data.fields;
        if (fields && fields.name) {
            name = fields.name.value;
        }

        // Build update object
        const updateData = {};
        if (name) updateData.name = name;
        if (profilePictureUrl) {
            // Delete old profile picture if exists
            const user = await Users.findById(userId).select("profile_picture").lean();
            if (user && user.profile_picture) {
                const oldFilePath = path.join(process.cwd(), user.profile_picture.replace('/public/', 'public/'));
                try {
                    await fs.unlink(oldFilePath);
                } catch (err) {
                    console.log("Old profile picture not found or already deleted");
                }
            }
            updateData.profile_picture = profilePictureUrl;
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return reply.code(400).send({
                success: false,
                message: "No valid fields to update",
            });
        }

        // Update user profile
        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select("name username email profile_picture unique_id").lean();

        return reply.code(200).send({
            success: true,
            message: "Profile updated successfully",
            result: updatedUser,
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        return reply.code(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { updateProfile };
