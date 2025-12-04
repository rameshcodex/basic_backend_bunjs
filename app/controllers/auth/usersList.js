const { validateUser } = require("./vaidators");
const { zodValidate } = require("../../middleware/utils");

const usersList = async (req, reply) => {
    var result = await zodValidate(req, reply, validateUser);

    console.log(result, "ahfioaf");
    return reply
        .code(200) // same as res.status(200)
        .send({
            success: true,
            message: "Dummy User List",
            users: [
                { id: 1, username: "John Doe" }
            ]
        });
};

module.exports = { usersList };
