const { register } = require("./register");
const { verifyOtp } = require("./verifyOtp");
const { login } = require("./login");
const { resendOtp } = require("./resendOtp");
const { forgotPassword } = require("./forgotPassword");
const { resetPassword } = require("./resetPassword");

module.exports = { register, verifyOtp, login, resendOtp, forgotPassword, resetPassword };