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
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
// Authentication routes
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body; // Corrected order
        const newUser = yield (0, auth_controller_1.register)(username, email, password); // Corrected function call
        res.status(201).json({ message: "User registered successfully", user: newUser });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// User profile routes
router.get("/profile", auth_middleware_1.authMiddleware, auth_controller_1.getUserProfile);
router.put("/profile", auth_middleware_1.authMiddleware, validation_middleware_1.validateUserProfile, auth_controller_1.updateUserProfile);
// Forgot password route
router.post("/forgot-password", auth_controller_1.forgotPassword);
// Password reset routes
router.post("/reset-password", validation_middleware_1.validatePasswordReset, auth_controller_1.resetPasswordHandler); // ✅ Added validation
router.put("/reset-password/:token", validation_middleware_1.validatePasswordReset, auth_controller_1.confirmResetPasswordHandler);
exports.default = router;
