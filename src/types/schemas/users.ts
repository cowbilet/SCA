// TODO: This should probably be a server
import { email, z } from 'zod'
import { role } from '@/db/schema'

export const UserSchema = z.object({
    userId: z.string(),
    email: z.email(),
    name: z.string().min(2).max(100),
    role: z.enum(role.enumValues),
})
export type User = z.infer<typeof UserSchema>
