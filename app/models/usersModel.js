const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    isNormalLogin: {
        type: Boolean,
        default: true,
    },
    isGoogleLogin: {
        type: Boolean,
        default: false,
    },
    isGithubLogin: {
        type: Boolean,
        default: false,
    },
    "2fastatus": { // keeping strict naming as requested, though usually camelCase is preferred
        type: Boolean,
        default: false,
    },
    "2fa_credentials": {
        type: mongoose.Schema.Types.Mixed, // Using Mixed for flexibility as specific structure wasn't defined
        default: null,
    },
    emailotp: { // Typo from request preserved
        type: Number,
        default: null,
    },
    lastOtpSentAt: {
        type: Date,
        default: null,
    },
    forgotPasswordOtp: {
        type: Number,
        default: null,
    },
    lastForgotPasswordOtpSentAt: {
        type: Date,
        default: null,
    },
    verifyStatus: {
        type: Boolean,
        default: false,
    },
    profile_picture: {
        type: String,
        default: null,
    },
    unique_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    role: {
        type: String,
        default: "user",
    },
}, { timestamps: true });

const Users = mongoose.model("Users", userSchema);

module.exports = { Users };
