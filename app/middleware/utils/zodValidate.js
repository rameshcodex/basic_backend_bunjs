// zodValidate.js
const { formatZodErrors } = require("./formatZodErrors");

async function zodValidate(req, reply, schema) {
    const result = await schema.safeParse(req.body);

    if (!result.success) {
        reply.code(400).send({
            success: false,
            message: formatZodErrors(JSON.parse(result.error)),
            result: null
        });

        return { success: false }; // STOP HANDLER
    }

    return { success: true, data: result.data };
}

module.exports = { zodValidate };
