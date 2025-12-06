const { validateUser } = require('./usersListValidator')
const { registerValidator } = require('./registerValidator')
module.exports = {
    validateUser,
    registerValidator
}