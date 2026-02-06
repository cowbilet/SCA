import { studentChallenge, users } from "~drizzle/schema";
import { db } from "./index.server";
import { eq } from "drizzle-orm";


export async function getDbUserById(userId: string) {
    return await db.select().from(users)
        .where(eq(users.userId, userId))
}
//TODO: Remove this in prod
export async function getDbUserByName(name: string) {
    return await db.select().from(users)
        .where(eq(users.name, name)).limit(1)
}