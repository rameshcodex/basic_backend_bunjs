function formatZodErrors(zodError) {
    return zodError.issues.map(err => ({
        field: err.path.join("."),
        message: err.message
    }));
}

module.exports = { formatZodErrors };
