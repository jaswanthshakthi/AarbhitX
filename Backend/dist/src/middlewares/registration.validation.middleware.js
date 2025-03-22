"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistration = void 0;
const express_validator_1 = require("express-validator");
// Reusable validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; // Ensure function exits after sending a response
    }
    next(); // Call next only if there are no validation errors
};
// Registration validation middleware
exports.validateRegistration = [
    (0, express_validator_1.body)("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
        .escape(),
    (0, express_validator_1.body)("email")
        .trim()
        .isEmail().withMessage("Valid email is required")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isString()
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/\d/).withMessage("Password must contain at least one number")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter"),
    handleValidationErrors,
];
