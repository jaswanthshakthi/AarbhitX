import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Zod schema for registration validation
const registrationSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .nonempty({ message: "Username is required" }),
  email: z
    .string()
    .trim()
    .email({ message: "Valid email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }),
});

// Reusable validation middleware
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Validate the request body
    registrationSchema.parse(req.body);
    next(); // Proceed only if validation passes
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Extract validation errors from Zod
      const validationErrors = error.errors.map(err => ({
        path: err.path,
        message: err.message,
      }));
      res.status(400).json({ errors: validationErrors });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
