import { Awards } from "@/types/SCA";
import { studentChallenge } from "@/db/schema.server";
import { db } from "./index.server";
import { and, eq } from "drizzle-orm/sql/expressions/conditions";
export async function getDbUserAwardChallenges(userId: string, award: Awards) {
    return await db.select().from(studentChallenge)
        .where(and(eq(studentChallenge.studentId, userId), eq(studentChallenge.award, award)))
}
// function determineState<T extends {accepted: boolean | null, assessorNote?: string, mentorNote?: string}>(activity: T): SubmissionState {
//     if (activity.accepted === null) {
//         if (activity.assessorNote) { 
//             return 'pending assessor'
//         }
//         return 'pending mentor'
//     }
//     else if (activity.accepted === false) {
//         if (!activity.assessorNote) {
//             return 'rejected mentor'
//         }
//         return 'rejected assessor'
//     }
//     return 'completed'
// }