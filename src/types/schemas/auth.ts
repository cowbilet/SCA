import { location, role } from "@/db/schema";
import { z } from "zod";
export const SignupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(role.enumValues, "Invalid role selection"),
    state: z.enum(location.enumValues, "Invalid state selection"),
})