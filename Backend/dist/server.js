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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const app_1 = __importDefault(require("./app"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware")); // Importing the error handler
const swagger_1 = require("./api-docs/swagger"); // Importing Swagger UI and Docs
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes")); // Importing authRoutes
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
(0, swagger_1.setupSwagger)(app_1.default);
// Apply security middleware globally
app_1.default.use((0, helmet_1.default)()); // Protect against well-known vulnerabilities
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests, please try again later.",
});
app_1.default.use(limiter); // Apply rate limiter
// API Routes
app_1.default.use("/api/auth", auth_routes_1.default); // Adding the auth routes
// Adding the error handling middleware
app_1.default.use(error_middleware_1.default); // Adding the error handling middleware
// Async function for better structure & error handling
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        const server = app_1.default.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
        // Graceful shutdown handling
        process.on("SIGTERM", () => {
            console.log("SIGTERM received: shutting down gracefully.");
            server.close(() => {
                console.log("Server closed.");
                process.exit(0);
            });
        });
        process.on("SIGINT", () => {
            console.log("SIGINT received: shutting down gracefully.");
            server.close(() => {
                console.log("Server closed.");
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error(" Database connection failed:", error);
        process.exit(1);
    }
});
startServer();
