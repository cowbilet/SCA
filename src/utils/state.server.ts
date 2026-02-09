import { SubmissionState } from "@/types/awards"
export function determineState<T extends {accepted: boolean | null, assessorNote?: string, mentorNote?: string}>(activity: T): SubmissionState {
    if (activity.accepted === null) {
        if (activity.assessorNote) { 
            return 'pending assessor'
        }
        return 'pending mentor'
    }
    else if (activity.accepted === false) {
        if (!activity.assessorNote) {
            return 'rejected mentor'
        }
        return 'rejected assessor'
    }
    return 'completed'
}