const { profile } = require("../controllers/users/profile");
const { updateProfile } = require("../controllers/users/updateProfile");
const { changePassword } = require("../controllers/users/changePassword");
const { enable2FA } = require("../controllers/users/enable2FA");
const { validate2FA } = require("../controllers/users/validate2FA");
const { disable2FA } = require("../controllers/users/disable2FA");
const { validateToken } = require("../middleware/authMiddleware");

module.exports = async function (fastify) {
    // POST /profile as requested
    fastify.post("/profile", { preHandler: validateToken("user") }, profile);

    // PUT /update-profile for updating user profile
    fastify.put("/update-profile", { preHandler: validateToken("user") }, updateProfile);

    // PUT /change-password for changing user password
    fastify.put("/change-password", { preHandler: validateToken("user") }, changePassword);

    // 2FA Routes
    fastify.post("/enable-2fa", { preHandler: validateToken("user") }, enable2FA);
    fastify.post("/validate-2fa", { preHandler: validateToken("user") }, validate2FA);
    fastify.post("/disable-2fa", { preHandler: validateToken("user") }, disable2FA);
}

