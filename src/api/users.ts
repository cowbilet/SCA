import { createServerFn } from '@tanstack/react-start'
import { getDbUserByEmail } from "@/db/users.server";
import type { UserSchema } from "@/types/schemas/users";
import { z } from "zod";
const userEmailSchema = z.object({
    email: z.string(),
})
//TODO: Ratelimit this endpoint to prevent scraping

export const getUserByEmail = createServerFn({ method: 'GET' }).inputValidator(userEmailSchema).handler(async ({data}): Promise<UserSchema> => {
    const user = await getDbUserByEmail(data.email)
    if (!user || user.length === 0) {
        throw new Error("User not found")
    }
    return {
        userId: user[0].userId,
        email: user[0].email,
    }
})