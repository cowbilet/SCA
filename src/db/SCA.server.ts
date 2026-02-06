import { Awards } from "@/types/SCA";
import { studentChallenge } from "~drizzle/schema";
import { db } from "./index.server";
import { and } from "drizzle-orm/sql/expressions/conditions";
export async function getDbUserAwardChallenges(userId: string, award: Awards,) {
    return await db.select().from(studentChallenge)
        .where(and(studentChallenge.userId.eq(userId), studentChallenge.award.eq(award)))}
