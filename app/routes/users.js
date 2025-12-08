const { profile } = require("../controllers/users/profile");
const { updateProfile } = require("../controllers/users/updateProfile");
const { changePassword } = require("../controllers/users/changePassword");
const { validateToken } = require("../middleware/authMiddleware");

module.exports = async function (fastify) {
    // POST /profile as requested
    fastify.post("/profile", { preHandler: validateToken("user") }, profile);

    // PUT /update-profile for updating user profile
    fastify.put("/update-profile", { preHandler: validateToken("user") }, updateProfile);

    // PUT /change-password for changing user password
    fastify.put("/change-password", { preHandler: validateToken("user") }, changePassword);
}

