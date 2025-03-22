import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
const SECRET_KEY = process.env.JWT_SECRET || "secret"; // ✅ Store it once

const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email provider
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App password or email password
    },
});
// ✅ User Registration
export const register = async (email: string, password: string, username: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, username });
    return newUser;
};

// ✅ User Login
export const loginUser = async (email: string, password: string) => {
    try {
        if (!email || !password) throw new Error("Email and password are required");

        const user = await User.findOne({ email }).select("+password");
        if (!user || !user.password) throw new Error("Invalid credentials");

        console.log("User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        return jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    } catch (error) {
        console.error("Error in loginUser:", error);
        throw error;
    }
};

// ✅ Get User Profile
export const getUserProfile = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        return user;
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        throw error;
    }
};

// ✅ Update User Profile
export const updateUserProfile = async (userId: string, updateData: any) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) throw new Error("User not found");
        return updatedUser;
    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        throw error;
    }
};

export const resetPassword = async (email: string) => {
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = await bcrypt.hash(resetToken, 10);

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Generate password reset link
        const resetLink = `http://localhost:5000/reset-password/${resetToken}`;

        // Send email
        await transporter.sendMail({
            from: `"Support Team" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link will expire in 1 hour.</p>`,
        });

        return { message: "Password reset email sent successfully" };
    } catch (error) {
        console.error("Error in resetPassword:", error);
        throw error;
    }
};

export const confirmResetPassword = async (token: string, newPassword: string) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: { $exists: true },
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) throw new Error("Invalid or expired reset token");
        
        // Check if token matches the stored hashed token
        const isMatch = await bcrypt.compare(token, user.resetPasswordToken ?? "");
        if (!isMatch) throw new Error("Invalid reset token");

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return { message: "Password reset successful" };
    } catch (error) {
        console.error("Error in confirmResetPassword:", error);
        throw error;
    }
};
