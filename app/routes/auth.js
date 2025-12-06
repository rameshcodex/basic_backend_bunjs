const { usersList, addEurPair } = require("../controllers/auth");
const { validateUser } = require("../controllers/auth/vaidators");

module.exports = async function (fastify, opts) {

    fastify.get("/", usersList);

    fastify.post("/addEurPair", addEurPair);

};