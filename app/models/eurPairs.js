const mongoose = require("mongoose");

const eurPairsSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true },
    base: { type: String, required: true },
    quote: { type: String, required: true },
}, { strict: false, timestamps: true }); // strict: false to allow flexibility if needed, or define all fields

const EurPairs = mongoose.model("eurPairs", eurPairsSchema);

module.exports = { EurPairs };