import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://xyz-5000.inc1.devtunnels.ms"],
  methods: ["*"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
}));

// Sample Route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// API Routes
app.use("/api/auth", authRoutes);

export default app;
