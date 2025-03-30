import dotenv from "dotenv";
import { connectDB } from "./config/db";
import app from "./app";
import errorHandler from "./middlewares/error.middleware"; // Importing the error handler
import helmet from "helmet"; // Importing helmet for security
import rateLimit from "express-rate-limit"; // Importing rateLimit for request limiting
import authRoutes from "./routes/auth.routes"; // Importing authRoutes

dotenv.config();

const PORT = process.env.PORT || 3000;

// Apply security middleware globally
app.use(helmet()); // Protect against well-known vulnerabilities

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests, please try again later.",
});

app.use(limiter); // Apply rate limiter

// API Routes
app.use("/api/auth", authRoutes); // Adding the auth routes

// Adding the error handling middleware
app.use(errorHandler); // Adding the error handling middleware

// Async function for better structure & error handling
const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
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
    } catch (error) {
        console.error(" Database connection failed:", error);
        process.exit(1);
    }
};

startServer();
