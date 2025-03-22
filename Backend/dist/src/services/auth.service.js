"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmResetPassword = exports.resetPassword = exports.updateUserProfile = exports.getUserProfile = exports.loginUser = exports.register = void 0;
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const SECRET_KEY = process.env.JWT_SECRET || "secret"; // ✅ Store it once
const transporter = nodemailer_1.default.createTransport({
    service: "gmail", // Use your email provider
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App password or email password
    },
});
// ✅ User Registration
const register = (email, password, username) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = yield user_model_1.User.create({ email, password: hashedPassword, username });
    return newUser;
});
exports.register = register;
// ✅ User Login
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!email || !password)
            throw new Error("Email and password are required");
        const user = yield user_model_1.User.findOne({ email }).select("+password");
        if (!user || !user.password)
            throw new Error("Invalid credentials");
        console.log("User found:", user);
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            throw new Error("Invalid credentials");
        return jsonwebtoken_1.default.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        throw error;
    }
});
exports.loginUser = loginUser;
// ✅ Get User Profile
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user)
            throw new Error("User not found");
        return user;
    }
    catch (error) {
        console.error("Error in getUserProfile:", error);
        throw error;
    }
});
exports.getUserProfile = getUserProfile;
// ✅ Update User Profile
const updateUserProfile = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser)
            throw new Error("User not found");
        return updatedUser;
    }
    catch (error) {
        console.error("Error in updateUserProfile:", error);
        throw error;
    }
});
exports.updateUserProfile = updateUserProfile;
const resetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findOne({ email });
        if (!user)
            throw new Error("User not found");
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const hashedToken = yield bcryptjs_1.default.hash(resetToken, 10);
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        yield user.save();
        // Generate password reset link
        const resetLink = `http://localhost:5000/reset-password/${resetToken}`;
        // Send email
        yield transporter.sendMail({
            from: `"Support Team" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link will expire in 1 hour.</p>`,
        });
        return { message: "Password reset email sent successfully" };
    }
    catch (error) {
        console.error("Error in resetPassword:", error);
        throw error;
    }
});
exports.resetPassword = resetPassword;
const confirmResetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.User.findOne({
            resetPasswordToken: { $exists: true },
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user)
            throw new Error("Invalid or expired reset token");
        // Check if token matches the stored hashed token
        const isMatch = yield bcryptjs_1.default.compare(token, (_a = user.resetPasswordToken) !== null && _a !== void 0 ? _a : "");
        if (!isMatch)
            throw new Error("Invalid reset token");
        user.password = yield bcryptjs_1.default.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        return { message: "Password reset successful" };
    }
    catch (error) {
        console.error("Error in confirmResetPassword:", error);
        throw error;
    }
});
exports.confirmResetPassword = confirmResetPassword;
