import { users } from "@/db/schema.server";
import { db } from "./index.server";
import { eq } from "drizzle-orm";
import { User } from "@/types/schemas/users";


export async function dbCreateUserById(userId: string): Promise<User | null> {
    const user = await db.select().from(users)
        .where(eq(users.userId, userId)).limit(1)
    if (user.length === 0) {
        return null
    }
    return user[0]
}
//TODO: Remove this in prod
export async function dbGetUserByName(name: string): Promise<User | null> {
    const user = await db.select().from(users)
        .where(eq(users.name, name)).limit(1)
    if (user.length === 0) {
        return null
    }
    return user[0]
}
export async function dbGetUserByEmail(email: string): Promise<User | null> {
    const user = await db.select().from(users)
        .where(eq(users.email, email)).limit(1)
    if (user.length === 0) {
        return null
    }
    return user[0]
}