import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// Reusable validation error handler
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation Failed:", errors.array()); // Log validation errors
        console.log("Request Body:", req.body); // Log the request body for debugging
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};

export const validateUserProfile = [
    body("username").isString().notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").optional().isString().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    handleValidationErrors,
];

export const validatePasswordReset = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("newPassword").isString().isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
    handleValidationErrors,
];
