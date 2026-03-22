import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { User } from '@/types/schemas/users'
import { dbGetUserByEmail } from '@/db/users.server'
import { ensureSession, restrictStudentData } from '@/utils/auth'

const userEmailSchema = z.object({
    email: z.email(),
})
// TODO: Ratelimit this endpoint to prevent scraping

export const getUserByEmail = createServerFn({ method: 'GET' })
    .inputValidator(userEmailSchema)
    .handler(async ({ data }): Promise<User> => {
        const user = await dbGetUserByEmail(data.email)
        if (!user) {
            throw new Error('User not found')
        }
        // TODO: maybe dont dox people with emails
        return {
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    })
