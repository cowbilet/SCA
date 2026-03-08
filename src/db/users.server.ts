import { users } from "@/db/schema";
import { db } from "./index.server";
import { eq } from "drizzle-orm";
import { User } from "@/types/schemas/users";


export async function dbCreateUserById(userId: string): Promise<User | null> {
    const user = await db.select({
        userId: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
    }).from(users)
        .where(eq(users.id, userId)).limit(1)
    if (user.length === 0) {
        return null
    }
    return user[0]
}
export async function dbGetUserByEmail(email: string): Promise<User | null> {
    const user = await db.select({
        userId: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
    }).from(users)
        .where(eq(users.email, email)).limit(1)
    if (user.length === 0) {
        return null
    }
    return user[0]
}
export async function dbGetUserById(userId: string): Promise<User | null> {
    const user = await db.select({
        userId: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
    }).from(users)
        .where(eq(users.id, userId)).limit(1)
    if (user.length === 0) {
        return null
    }
    return user[0]
}