const { registerValidator } = require("./registerValidator");
const { verifyOtpValidator } = require("./verifyOtpValidator");
const { loginValidator } = require("./loginValidator");
const { resendOtpValidator } = require("./resendOtpValidator");
const { forgotPasswordValidator } = require("./forgotPasswordValidator");
const { resetPasswordValidator } = require("./resetPasswordValidator");
const { validate2FALoginValidator } = require("./validate2FALoginValidator");

module.exports = {
    registerValidator,
    verifyOtpValidator,
    loginValidator,
    resendOtpValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    validate2FALoginValidator
};