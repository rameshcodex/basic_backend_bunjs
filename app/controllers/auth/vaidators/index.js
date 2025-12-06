const { registerValidator } = require("./registerValidator");
const { verifyOtpValidator } = require("./verifyOtpValidator");
const { loginValidator } = require("./loginValidator");

module.exports = { registerValidator, verifyOtpValidator, loginValidator };