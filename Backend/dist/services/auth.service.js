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
const email_1 = require("./email"); // Extracted transporter setup
const logger_1 = __importDefault(require("../config/logger")); // Importing the logger
const SECRET_KEY = process.env.JWT_SECRET;
//  User Registration
const register = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield user_model_1.User.create({ username, email, password: hashedPassword });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
        logger_1.default.info("Token generated for user:", { userId: user._id, token }); // Logging token generation
        return { user, token };
    }
    catch (error) {
        logger_1.default.error("Error in register:", error); // Logging the error
        throw new Error("Registration failed");
    }
});
exports.register = register;
//  User Login
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!email || !password)
            throw new Error("Email and password are required for login");
        const user = yield user_model_1.User.findOne({ email }).select("+password");
        if (!user)
            throw new Error("User not found");
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            throw new Error("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
        logger_1.default.info("Token generated for user:", { userId: user._id, token }); // Logging token generation
        return { user, token };
    }
    catch (error) {
        logger_1.default.error("Error in loginUser:", error); // Logging the error
        throw error;
    }
});
exports.loginUser = loginUser;
//  Get User Profile
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(userId).select("-password");
        if (!user)
            throw new Error("User not found");
        return user;
    }
    catch (error) {
        logger_1.default.error("Error in getUserProfile:", error); // Logging the error
        throw error;
    }
});
exports.getUserProfile = getUserProfile;
//  Update User Profile
const updateUserProfile = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password");
        if (!updatedUser)
            throw new Error("User not found");
        return updatedUser;
    }
    catch (error) {
        logger_1.default.error("Error in updateUserProfile:", error); // Logging the error
        throw error;
    }
});
exports.updateUserProfile = updateUserProfile;
//  Reset Password - Request Reset
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
        const resetLink = `http://localhost:5000/reset-password/${resetToken}`;
        yield email_1.transporter.sendMail({
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
        logger_1.default.error("Error in resetPassword:", error); // Logging the error
        throw error;
    }
});
exports.resetPassword = resetPassword;
//  Confirm Password Reset
const confirmResetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.User.findOne({
            resetPasswordToken: { $exists: true },
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user)
            throw new Error("Invalid or expired reset token");
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
        logger_1.default.error("Error in confirmResetPassword:", error); // Logging the error
        throw error;
    }
});
exports.confirmResetPassword = confirmResetPassword;
