import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        const user = await registerUser(email, password, username);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {  
        res.status(400).json({ error: error.message || "Something went wrong" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.status(200).json({ token });
    } catch (error: any) {  
        res.status(401).json({ error: error.message || "Invalid credentials" });
    }
};
