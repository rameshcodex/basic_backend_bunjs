const { register, verifyOtp, login, resendOtp, forgotPassword, resetPassword } = require("../controllers/auth");

module.exports = async function (fastify) {

    fastify.post("/register", register);
    fastify.post("/verify-otp", verifyOtp);
    fastify.post("/login", login);
    fastify.post("/resend-otp", resendOtp);
    fastify.post("/forgot-password", forgotPassword);
    fastify.post("/reset-password", resetPassword);

};