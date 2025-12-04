const { formatZodErrors } = require("./formatZodErrors");

async function zodValidate(req, reply, schema) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        return reply.code(400).send({
            success: false,
            errors: formatZodErrors(result.error)
        });
    }


    // Return parsed data (clean)
    return result.data;
}

module.exports = { zodValidate };
