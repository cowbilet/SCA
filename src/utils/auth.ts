import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import { auth } from '@/integrations/better-auth/auth'
import { dbGetUserById } from '@/db/users.server'
import { role } from '@/db/schema'
import { dbGetMentorStudents } from '@/db/mentors.server'

export const getSession = createServerFn({ method: 'GET' }).handler(
    async () => {
        const headers = getRequestHeaders()
        const session = await auth.api.getSession({ headers })

        return session
    },
)

export const ensureSession = createServerFn({ method: 'GET' }).handler(
    async () => {
        const headers = getRequestHeaders()
        const session = await auth.api.getSession({ headers })

        if (!session) {
            throw new Error('Unauthorized')
        }

        return session
    },
)
const restrictRoleSchema = z.array(z.enum([...role.enumValues, 'assessor']))
export const restrictRoles = createServerFn({ method: 'GET' })
    .inputValidator(restrictRoleSchema)
    .handler(async ({ data: roles }) => {
        const session = await ensureSession()
        const user = await dbGetUserById(session.user.id)

        if (!user) {
            throw new Error('Unauthorized')
        }
        if (!roles.includes(user.role)) {
            throw new Error('Forbidden')
        }

        return user
    })
export const restrictToSelf = createServerFn({ method: 'GET' })
    .inputValidator(z.string())
    .handler(async ({ data: userId }) => {
        const session = await ensureSession()
        const user = await dbGetUserById(session.user.id)

        if (!user) {
            throw new Error('Unauthorized')
        }
        if (user.userId !== userId) {
            throw new Error('Forbidden')
        }

        return user
    })
export const restrictStudentData = createServerFn({ method: 'GET' })
    .inputValidator(z.uuid())
    .handler(async ({ data: studentId }) => {
        const session = await ensureSession()
        const user = await dbGetUserById(session.user.id)

        if (!user) {
            throw new Error('Unauthorized')
        }
        if (user.role === 'student') {
            if (user.userId !== studentId) {
                throw new Error('Forbidden')
            }
            return user
        } else if (user.role === 'mentor') {
            const mentorStudents = await dbGetMentorStudents(user.userId)
            const hasStudent = mentorStudents.some(
                (student) => student.userId === studentId,
            )
            if (!hasStudent) {
                throw new Error('Forbidden')
            }
            return user
        } else {
            return user
        }
    })
