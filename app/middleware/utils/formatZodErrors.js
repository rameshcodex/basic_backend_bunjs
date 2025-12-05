// formatZodErrors.js
function formatZodErrors(error) {
    return error?.length > 0 ? error[0].message : "Something went wrong"



}

module.exports = { formatZodErrors };