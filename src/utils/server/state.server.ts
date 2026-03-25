import type { SubmissionState } from '@/types/awards'

export function determineState<
    T extends {
        accepted: boolean | null
        assessorNote?: string
        mentorNote?: string
    },
>(activity: T): SubmissionState {
    if (activity.accepted === null) {
        if (activity.assessorNote) {
            return 'pending assessor'
        }
        return 'pending mentor'
    } else if (activity.accepted === false) {
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
): {
    status: SubmissionState
    accepted?: boolean
    mentorNote?: string
    assessorNote?: string
    assessorId?: string
} {
    const validTransitions: Record<SubmissionState, Array<SubmissionState>> = {
        'not started': ['pending mentor'],
        'pending mentor': [
            'rejected mentor',
            'pending assessor',
            'not started',
        ],
        'rejected mentor': ['pending mentor', 'not started'],
        withdrawn: ['pending mentor', 'not started'],
        'pending assessor': ['rejected assessor', 'completed', 'not started'],
        'rejected assessor': ['pending mentor', 'not started'],
        completed: [],
    }

    const nextStatus: SubmissionState =
        requestedStatus === 'withdrawn' ? 'not started' : requestedStatus

    if (!validTransitions[currentStatus].includes(nextStatus)) {
        throw new Error(
            `Invalid status transition: ${currentStatus} -> ${requestedStatus}`,
        )
    }

    if (nextStatus === 'pending assessor' && !data.note?.trim()) {
        throw new Error('Mentor note is required before sending to assessor')
    }

    if (
        (nextStatus === 'rejected assessor' || nextStatus === 'completed') &&
        !data.assessorId
    ) {
        throw new Error('Assessor ID is required for an assessor decision')
    }

    if (
        (nextStatus === 'rejected assessor' || nextStatus === 'completed') &&
        currentStatus !== 'pending assessor'
    ) {
        throw new Error(
            'Only proposals pending assessor review can be assessed',
        )
    }
    switch (nextStatus) {
        case 'pending mentor':
            return {
                status: 'pending mentor',
            }
        case 'rejected mentor':
            return {
                status: 'rejected mentor',
                accepted: false,
                mentorNote: data.note,
            }
        case 'pending assessor':
            return {
                status: 'pending assessor',
                mentorNote: data.note,
            }
        case 'rejected assessor':
            return {
                status: 'rejected assessor',
                accepted: false,
                assessorNote: data.note,
                assessorId: data.assessorId,
            }
        case 'completed':
            return {
                status: 'completed',
                accepted: true,

                assessorNote: data.note,
                assessorId: data.assessorId,
            }
        case 'not started':
            return {
                status: 'not started',
            }
        default:
            throw new Error(`Unhandled status: ${nextStatus}`)
    }
}
