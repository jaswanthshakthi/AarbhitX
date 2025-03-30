import { z } from "zod";

export const passwordResetSchema = z.object({
    email: z.string().email("Valid email is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});
export { z };

