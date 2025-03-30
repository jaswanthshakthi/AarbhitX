"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const zod_1 = require("zod");
// Zod schema for user validation
const User = zod_1.z.object({
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6), // Minimum length for security
    isVerified: zod_1.z.boolean().optional(),
    resetPasswordToken: zod_1.z.string().optional(),
    resetPasswordExpires: zod_1.z.number().optional(),
});
exports.User = User;
