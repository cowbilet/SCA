import type { SubmissionState } from "@/types/awards"

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
export function validateStatusTransition(
    currentStatus: SubmissionState,
    requestedStatus: SubmissionState,
    data: { note?: string; assessorId?: string },
): { status: SubmissionState; accepted: boolean | null; mentorNote: string | null; assessorNote: string | null; assessorId: string | null } {
    const validTransitions: Record<SubmissionState, Array<SubmissionState>> = {
        'not started':       ['pending mentor'],
        'pending mentor':    ['rejected mentor', 'pending assessor', 'not started'],
        'rejected mentor':   ['pending mentor', 'not started'],
        'withdrawn':         ['pending mentor', 'not started'],
        'pending assessor':  ['rejected assessor', 'completed', 'not started'],
        'rejected assessor': ['pending mentor', 'not started'],
        'completed':         [],
    };

    const nextStatus: SubmissionState = requestedStatus === 'withdrawn' ? 'not started' : requestedStatus;

    if (!validTransitions[currentStatus].includes(nextStatus)) {
        throw new Error(`Invalid status transition: ${currentStatus} -> ${requestedStatus}`);
    }

    if (nextStatus === 'pending assessor' && !data.note?.trim()) {
        throw new Error("Mentor note is required before sending to assessor");
    }

    if ((nextStatus === 'rejected assessor' || nextStatus === 'completed') && !data.assessorId) {
        throw new Error("Assessor ID is required for an assessor decision");
    }

    if ((nextStatus === 'rejected assessor' || nextStatus === 'completed') && currentStatus !== 'pending assessor') {
        throw new Error("Only proposals pending assessor review can be assessed");
    }
    switch (nextStatus) {
        case 'pending mentor':
            return {
                status: 'pending mentor',
                accepted: null,
                mentorNote: null,
                assessorNote: null,
                assessorId: null,
            };
        case 'rejected mentor':
            return {
                status: 'rejected mentor',
                accepted: false,
                mentorNote: data.note ?? null,
                assessorNote: null,
                assessorId: null,
            };
        case 'pending assessor':
            return {
                status: 'pending assessor',
                accepted: null,
                mentorNote: data.note ?? null,
                assessorNote: null,
                assessorId: null,
            };
        case 'rejected assessor':
            return {
                status: 'rejected assessor',
                accepted: false,
                mentorNote: null,
                assessorNote: data.note ?? null,
                assessorId: data.assessorId ?? null,
            }
        case 'completed':
            return {
                status: 'completed',
                accepted: true,
                mentorNote: null,
                assessorNote: null,
                assessorId: data.assessorId ?? null,
            };
        case 'not started':
            return {
                status: 'not started',
                accepted: null,
                mentorNote: null,
                assessorNote: null,
                assessorId: null,
            };
        default:
            throw new Error(`Unhandled status: ${nextStatus}`);
    }
}