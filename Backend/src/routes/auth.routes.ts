import { Router } from "express";
import {
    register,
    login,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    resetPasswordHandler,
    confirmResetPasswordHandler,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRegistration } from "../middlewares/registration.validation.middleware";
import { validateUserProfile, validatePasswordReset } from "../middlewares/validation.middleware";

const router = Router();

// Authentication routes
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body; // Corrected order
        const newUser = await register(username, email, password); // Corrected function call
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});


// User profile routes
router.get("/profile", authMiddleware, getUserProfile); 
router.put("/profile", authMiddleware, validateUserProfile, updateUserProfile);

// Forgot password route
router.post("/forgot-password", forgotPassword);

// Password reset routes
router.post("/reset-password", validatePasswordReset, resetPasswordHandler); // ✅ Added validation
router.put("/reset-password/:token", validatePasswordReset, confirmResetPasswordHandler);

export default router;
