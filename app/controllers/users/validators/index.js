const { changePasswordValidator } = require("./changePasswordValidator");
const { validate2FAValidator } = require("./validate2FAValidator");
const { disable2FAValidator } = require("./disable2FAValidator");

module.exports = { changePasswordValidator, validate2FAValidator, disable2FAValidator };
