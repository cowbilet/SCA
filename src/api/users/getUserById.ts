import { createServerFn } from '@tanstack/react-start'
import { dbGetUserByEmail, dbGetUserById,  } from "@/db/users.server";
import type { User } from "@/types/schemas/users";
import { z } from "zod";
const userStudentIdSchema = z.object({
    studentId: z.uuid(),
})


export const getUserById = createServerFn({ method: 'GET' }).inputValidator(userStudentIdSchema).handler(async ({data}): Promise<User> => {
    const user = await dbGetUserById(data.studentId)
    if (!user) {
        throw new Error("User not found")
    }
    return {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
    }
})