import { createServerFn } from '@tanstack/react-start'
import { dbGetUserById,  } from "@/db/users.server";
import type { User } from "@/types/schemas/users";
import { z } from "zod";
import { ensureSession, restrictStudentData } from '@/utils/auth';
const userStudentIdSchema = z.object({
    studentId: z.uuid(),
})


export const getUserById = createServerFn({ method: 'GET' }).inputValidator(userStudentIdSchema).handler(async ({data}): Promise<User> => {

    const user = await dbGetUserById(data.studentId)
    if (!user) {
        throw new Error("User not found")
    }
    await restrictStudentData({data: user.userId})
    return {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
    }
})