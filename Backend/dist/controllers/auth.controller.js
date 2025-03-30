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
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmResetPassword = exports.register = exports.resetPasswordHandler = exports.confirmResetPasswordHandler = exports.forgotPassword = exports.updateUserProfile = exports.getUserProfile = exports.login = exports.registerUser = void 0;
const user_model_1 = require("../models/user.model");
const auth_service_1 = require("../services/auth.service");
Object.defineProperty(exports, "register", { enumerable: true, get: function () { return auth_service_1.register; } });
Object.defineProperty(exports, "confirmResetPassword", { enumerable: true, get: function () { return auth_service_1.confirmResetPassword; } });
// Register
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const user = yield (0, auth_service_1.register)(username, email, password);
        res.status(201).json({ message: "User registered successfully", user });
    }
    catch (error) {
        res.status(400).json({ error: error.message || "Something went wrong" });
    }
});
exports.registerUser = registerUser;
// Login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const token = yield (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(401).json({ error: "Login failed: " + (error.message || "Invalid credentials") });
    }
});
exports.login = login;
// Get User Profile
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const user = yield user_model_1.User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.getUserProfile = getUserProfile;
// Update User Profile
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const updateData = req.body;
        const updatedUser = yield (0, auth_service_1.updateUserProfile)(userId, updateData);
        res.status(200).json({ message: "User profile updated successfully", user: updatedUser });
    }
    catch (error) {
        res.status(400).json({ error: error.message || "Something went wrong" });
    }
});
exports.updateUserProfile = updateUserProfile;
// Forgot Password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield (0, auth_service_1.resetPassword)(email);
        res.status(200).json({ message: "Password reset email sent successfully" });
    }
    catch (error) {
        res.status(400).json({ error: error.message || "Something went wrong" });
    }
});
exports.forgotPassword = forgotPassword;
// Reset Password (Confirm new password)
const confirmResetPasswordHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        yield (0, auth_service_1.confirmResetPassword)(token, newPassword);
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        res.status(400).json({ error: error.message || "Invalid or expired token" });
    }
});
exports.confirmResetPasswordHandler = confirmResetPasswordHandler;
// Reset Password Handler
const resetPasswordHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield (0, auth_service_1.resetPassword)(email);
        res.status(200).json({ message: "Password reset email sent successfully" });
    }
    catch (error) {
        res.status(400).json({ error: error.message || "Something went wrong" });
    }
});
exports.resetPasswordHandler = resetPasswordHandler;
