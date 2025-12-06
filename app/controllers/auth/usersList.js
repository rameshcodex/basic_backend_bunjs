// usersList.js
const { validateUser } = require("./vaidators");
const { zodValidate } = require("../../middleware/utils/zodValidate");

const usersList = async (req, reply) => {
    const result = await zodValidate(req, reply, validateUser);

    // // If validation failed, STOP here
    // if (!result.success) return;

    // console.log(result.data, "validated_data");

    return reply
        .code(200)
        .send({
            success: true,
            message: "Dummy User List",
            result: null
        });
};

module.exports = { usersList };
