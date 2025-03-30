"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordReset = exports.validateUserProfile = exports.validateEmailOnly = void 0;
const zod_1 = require("zod"); // Import Zod for validation
const zod_2 = require("zod");
const user_schema_1 = require("../Schema/user.schema");
const resetpassd_schema_1 = require("../Schema/resetpassd.schema");
// Generic Zod validation middleware
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_2.ZodError) {
                res.status(400).json({ errors: error.errors });
                return; // Explicitly return to prevent further execution
            }
            res.status(500).json({ error: "Server error" });
            return;
        }
    };
};
const emailSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
});
// Email validation middleware
exports.validateEmailOnly = validateRequest(emailSchema);
// Apply the validation schemas
exports.validateUserProfile = validateRequest(user_schema_1.User);
exports.validatePasswordReset = validateRequest(resetpassd_schema_1.passwordResetSchema);
