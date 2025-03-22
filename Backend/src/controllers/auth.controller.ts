import { Request, Response } from "express";
import { User } from "../models/user.model";
import { 
    register as registerService,  // Renamed to avoid conflicts
    loginUser, 
    resetPassword, 
    updateUserProfile as updateUserProfileService, 
    confirmResetPassword, 
    register
} from "../services/auth.service";

declare module "express-serve-static-core" {
    interface Request {
        user?: { id: string };
    }
}

// Register
export const registerUser = async (req: Request, res: Response) => {  // Removed extra username parameter
    try {
        const { email, password, username } = req.body;
        const user = await register(email, password, username);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {  
        res.status(400).json({ error: error.message || "Something went wrong" });
    }
};


// Login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.status(200).json({ token });
    } catch (error: any) {  
        res.status(401).json({ error: error.message || "Invalid credentials" });
    }
};

// Get User Profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json({ user });
    } catch (error: any) {
        res.status(500).json({ error: "Server error" });
    }
};

// Update User Profile
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }

        const updateData = req.body;
        const updatedUser = await updateUserProfileService(userId, updateData);

        res.status(200).json({ message: "User profile updated successfully", user: updatedUser });
    } catch (error: any) {
        res.status(400).json({ error: error.message || "Something went wrong" });
    }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await resetPassword(email);
        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error: any) {
        res.status(400).json({ error: error.message || "Something went wrong" });
    }
};

// Reset Password (Confirm new password)
export const confirmResetPasswordHandler = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        await confirmResetPassword(token, newPassword);
        res.status(200).json({ message: "Password reset successful" });
    } catch (error: any) {
        res.status(400).json({ error: error.message || "Invalid or expired token" });
    }
};

// Reset Password Handler
export const resetPasswordHandler = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await resetPassword(email);
        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error: any) {
        res.status(400).json({ error: error.message || "Something went wrong" });
    }
};
export { register };

