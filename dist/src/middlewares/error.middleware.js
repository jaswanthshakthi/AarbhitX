"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger")); // Importing the logger
// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log the error
    logger_1.default.error(err.message || 'Internal Server Error');
    // Send a standardized error response
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};
exports.default = errorHandler;
