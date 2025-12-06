const { usersList, register } = require("../controllers/auth");

module.exports = async function (fastify, opts) {

    fastify.get("/", usersList)

    fastify.post("/register", register);

};