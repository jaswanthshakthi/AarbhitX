import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth.routes";
import cors from "cors";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
connectDB();
app.get("/", (req, res) => {
    res.send("Server is running...");
});
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.use(cors());