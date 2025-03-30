"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET; // Ensure your environment variable is set
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        if (!decoded.id) {
            res.status(403).json({ message: "Forbidden: Invalid token payload" });
            return; // Ensure function exits after sending response
        }
        req.user = { id: decoded.id }; //  Correctly attach user ID to request
        next(); //  Proceed to the next middleware
    }
    catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
        return; //  Ensure function exits
    }
};
exports.authMiddleware = authMiddleware;
//import logger from "../config/logger";
