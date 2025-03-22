import dotenv from "dotenv";
import { connectDB } from "./config/db";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database with error handling
connectDB()
    .then(() => {
        // Start the Server after a successful DB connection
        app.listen(PORT, () => {
            console.log(` Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(" Database connection failed:", error);
        process.exit(1); // Exit the process if DB connection fails
    });
