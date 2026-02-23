import { role } from '@/db/schema.server'
import { email, z } from 'zod'
export const UserSchema = z.object({
    userId: z.string(),
    email: z.email(),
    role: z.enum(role.enumValues),
})
export type User = z.infer<typeof UserSchema>
