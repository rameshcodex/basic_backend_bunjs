const { profile } = require("../controllers/users/profile");
const { validateToken } = require("../middleware/authMiddleware");

module.exports = async function (fastify) {
    // POST /profile as requested
    fastify.post("/profile", { preHandler: validateToken("user") }, profile);
}

