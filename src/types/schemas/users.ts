import { email, z } from 'zod'
export const UserSchema = z.object({
    userId: z.string(),
    email: z.string(),
})
export type UserSchema = z.infer<typeof UserSchema>
