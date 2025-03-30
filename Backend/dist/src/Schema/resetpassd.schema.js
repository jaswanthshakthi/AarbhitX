"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.z = exports.passwordResetSchema = void 0;
const zod_1 = require("zod");
Object.defineProperty(exports, "z", { enumerable: true, get: function () { return zod_1.z; } });
exports.passwordResetSchema = zod_1.z.object({
    email: zod_1.z.string().email("Valid email is required"),
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters long"),
});
