import { z } from 'zod'
import { location } from '@/db/schema'

export const publicSignupRoles = ['student', 'mentor'] as const

export const LoginSchema = z.object({
    email: z.email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
})

export const SignupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name must be 100 characters or less'),
    email: z.email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(publicSignupRoles, 'Invalid role selection'),
    state: z.enum(location.enumValues, 'Invalid state selection'),
})
