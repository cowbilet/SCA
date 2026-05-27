import { eq, inArray } from 'drizzle-orm'
import { and } from 'drizzle-orm/sql/expressions/conditions'
import { db } from './index.server'
import type { User } from '@/types/schemas/users'
import type { Role } from '@/types/users'
import { users } from '@/db/schema'

export async function dbGetScopedUsersByState(
    state?: User['state'],
): Promise<Array<User>> {
    const conditions = [inArray(users.role, ['student', 'mentor'])]

    if (state) {
        conditions.push(eq(users.state, state))
    }

    return db
        .select({
            userId: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            state: users.state,
        })
        .from(users)
        .where(and(...conditions))
}

export async function dbUpdateUserRole(
    userId: string,
    nextRole: Role,
): Promise<User | null> {
    const updatedUser = await db
        .update(users)
        .set({ role: nextRole })
        .where(eq(users.id, userId))
        .returning({
            userId: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            state: users.state,
        })

    return updatedUser[0] ?? null
}

export async function dbCreateUserById(userId: string): Promise<User | null> {
    const user = await db
        .select({
            userId: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            state: users.state,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
    if (user.length === 0) {
        return null
    }
    return user[0]
}
export async function dbGetUserByEmail(email: string): Promise<User | null> {
    const user = await db
        .select({
            userId: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            state: users.state,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
    if (user.length === 0) {
        return null
    }
    return user[0]
}
export async function dbGetUserById(userId: string): Promise<User | null> {
    const user = await db
        .select({
            userId: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            state: users.state,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
    if (user.length === 0) {
        return null
    }
    return user[0]
}
