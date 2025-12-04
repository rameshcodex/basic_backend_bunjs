const { usersList } = require("../controllers/auth");
const { validateUser } = require("../controllers/auth/vaidators");

module.exports = async function (fastify, opts) {

    fastify.post("/", usersList);

};