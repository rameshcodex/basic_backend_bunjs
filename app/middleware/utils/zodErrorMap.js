const { z } = require("zod");

// GLOBAL OVERRIDE for all Zod errors
const customErrorMap = (issue, ctx) => {
    // For missing required fields
    if (issue.code === z.ZodIssueCode.invalid_type && issue.received === "undefined") {
        return { message: `${issue.path[0]} is required` };
    }

    // For wrong type (string → number, etc.)
    if (issue.code === z.ZodIssueCode.invalid_type) {
        return { message: `Invalid type for ${issue.path[0]}` };
    }

    // Default to Zod's own message or custom message
    return { message: issue.message || "Invalid input" };
};

z.setErrorMap(customErrorMap);

module.exports = {};
