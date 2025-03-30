import { z } from "zod";

// Zod schema for user validation
const User = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(6), // Minimum length for security
  isVerified: z.boolean().optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.number().optional(),
});

export { User };
