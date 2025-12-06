const { register, verifyOtp, login } = require("../controllers/auth");

module.exports = async function (fastify) {

    fastify.post("/register", register);
    fastify.post("/verify-otp", verifyOtp);
    fastify.post("/login", login);

};