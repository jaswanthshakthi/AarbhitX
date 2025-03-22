import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
const UserSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    username:{type: String, required: true},
    password:{type:String, required: true },
    isVerified:{type:Boolean,default:false},
    resetPasswordToken: {type:String},
    resetPasswordExpires:{type:Number},
});

export const User = mongoose.model("User", UserSchema);

/*
import { z } from "zod";

// Zod schema for user validation
const userSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(6), // Minimum length for security
  isVerified: z.boolean().optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.number().optional(),
});

export { userSchema };
*/