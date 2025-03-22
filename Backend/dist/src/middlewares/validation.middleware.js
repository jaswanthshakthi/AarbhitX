"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordReset = exports.validateUserProfile = void 0;
const express_validator_1 = require("express-validator");
// Reusable validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("Validation Failed:", errors.array()); // Log validation errors
        console.log("Request Body:", req.body); // Log the request body for debugging
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateUserProfile = [
    (0, express_validator_1.body)("username").isString().notEmpty().withMessage("Username is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password").optional().isString().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    handleValidationErrors,
];
exports.validatePasswordReset = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("newPassword").isString().isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
    handleValidationErrors,
];
