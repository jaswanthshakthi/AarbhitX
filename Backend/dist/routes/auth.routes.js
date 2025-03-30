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
const zod_1 = require("zod"); // Import Zod for validation
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint allows a user to register with a username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body against the schema
        const parsedData = registerSchema.parse(req.body);
        const { username, email, password } = parsedData; // Use validated data
        const newUser = yield (0, auth_controller_1.register)(username, email, password); // Corrected function call
        res.status(201).json({ message: "User registered successfully", user: newUser });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}));
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: This endpoint allows a user to log in with their email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", auth_controller_1.login);
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: This endpoint retrieves the profile of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 */
router.get("/profile", auth_middleware_1.authMiddleware, auth_controller_1.getUserProfile);
router.put("/profile", auth_middleware_1.authMiddleware, validation_middleware_1.validateUserProfile, auth_controller_1.updateUserProfile);
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     description: This endpoint allows a user to request a password reset email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Error in sending password reset email
 */
router.post("/forgot-password", auth_controller_1.forgotPassword);
/**
 * @swagger
 *  /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: This endpoint allows a user to reset their password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Error in resetting password
 */
router.post("/reset-password", validation_middleware_1.validatePasswordReset, auth_controller_1.resetPasswordHandler);
/**
 * @swagger
 * /reset-password/{token}:
 *   put:
 *     summary: Confirm password reset
 *     description: This endpoint allows a user to confirm their password reset using a token.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: The token for password reset
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.put("/reset-password/:token", validation_middleware_1.validatePasswordReset, auth_controller_1.confirmResetPasswordHandler);
/**
 * @swagger
 * /api/auth/welcome:
 *   get:
 *     summary: Welcome message
 *     description: This endpoint returns a welcome message.
 *     responses:
 *       200:
 *         description: Welcome message retrieved successfully
 */
router.get("/welcome", (req, res) => {
    res.status(200).json({ message: "Welcome to the AarbhitX API!" });
});
exports.default = router;
