import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { dbGetScopedUsersByState } from '@/db/users.server'
import { restrictRoles } from '@/utils/auth'
import { UserSchema } from '@/types/schemas/users'

const ScopedAdminUsersOutputSchema = z.object({
    admin: UserSchema,
    users: z.array(UserSchema),
})

export const getScopedAdminUsers = createServerFn({ method: 'GET' }).handler(
    async (): Promise<z.infer<typeof ScopedAdminUsersOutputSchema>> => {
        const admin = await restrictRoles({ data: ['admin'] })
        const users =
            admin.state === 'NAT'
                ? await dbGetScopedUsersByState()
                : await dbGetScopedUsersByState(admin.state)

        return ScopedAdminUsersOutputSchema.parse({ admin, users })
    },
)