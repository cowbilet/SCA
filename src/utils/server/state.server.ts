import type { Award, SubmissionState  } from '@/types/awards'

export function determineState<
    T extends {
        accepted: boolean | null
        stateAssessorNote?: string
        nationalAssessorNote?: string
        mentorNote?: string
    },
>(activity: T): SubmissionState {
    if (activity.accepted === null) {
        if (activity.nationalAssessorNote) {
            return 'pending national assessor'
        }
        if (activity.stateAssessorNote) {
            return 'pending state assessor'
        }
        return 'pending mentor'
    } else if (activity.accepted === false) {
        if (!activity.stateAssessorNote && !activity.nationalAssessorNote) {
            return 'rejected mentor'
        }
        if (activity.nationalAssessorNote) {
            return 'rejected national assessor'
        }
        return 'rejected state assessor'
    }
    return 'completed'
}
export function validateStatusTransition(
    currentStatus: SubmissionState,
    requestedStatus: SubmissionState,
    data: {
        note?: string
        stateAssessorId?: string
        nationalAssessorId?: string
        award?: Award
    },
): {
    status: SubmissionState
    accepted?: boolean
    mentorNote?: string
    stateAssessorNote?: string
    nationalAssessorNote?: string
    stateAssessorId?: string
    nationalAssessorId?: string
} {
    const validTransitions: Record<SubmissionState, Array<SubmissionState>> = {
        'not started': ['pending mentor'],
        'pending mentor': [
            'rejected mentor',
            'pending state assessor',
            'not started',
        ],
        'rejected mentor': ['pending mentor', 'not started'],
        withdrawn: ['pending mentor', 'not started'],
        'pending state assessor': [
            'rejected state assessor',
            'pending national assessor',
            'completed',
            'not started',
        ],
        'rejected state assessor': ['pending mentor', 'not started'],
        'pending national assessor': [
            'rejected national assessor',
            'completed',
            'not started',
        ],
        'rejected national assessor': ['pending mentor', 'not started'],
        completed: [],
    }

    const nextStatus: SubmissionState =
        requestedStatus === 'withdrawn' ? 'not started' : requestedStatus

    if (!validTransitions[currentStatus].includes(nextStatus)) {
        throw new Error(
            `Invalid status transition: ${currentStatus} -> ${requestedStatus}`,
        )
    }

    if (nextStatus === 'pending state assessor' && !data.note?.trim()) {
        throw new Error('Mentor note is required before sending to assessor')
    }

    if (
        (nextStatus === 'rejected state assessor' ||
            nextStatus === 'pending national assessor') &&
        !data.stateAssessorId
    ) {
        throw new Error('State assessor ID is required for this decision')
    }

    if (
        (nextStatus === 'rejected state assessor' ||
            nextStatus === 'pending national assessor') &&
        currentStatus !== 'pending state assessor'
    ) {
        throw new Error(
            'Only records pending state assessor review can receive a state assessor decision',
        )
    }

    if (
        (nextStatus === 'rejected national assessor' ||
            nextStatus === 'completed') &&
        !data.nationalAssessorId
        && !(nextStatus === 'completed' && data.award !== 'gold' && data.stateAssessorId)
    ) {
        throw new Error('National assessor ID is required for this decision')
    }

    if (
        (nextStatus === 'rejected national assessor' ||
            nextStatus === 'completed') &&
        currentStatus !== 'pending national assessor' &&
        !(
            nextStatus === 'completed' &&
            currentStatus === 'pending state assessor' &&
            data.award !== 'gold' &&
            data.stateAssessorId
        )
    ) {
        throw new Error(
            'Only records pending national assessor review can receive a national assessor decision',
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
        case 'pending state assessor':
            return {
                status: 'pending state assessor',
                mentorNote: data.note,
            }
        case 'rejected state assessor':
            return {
                status: 'rejected state assessor',
                accepted: false,
                stateAssessorNote: data.note,
                stateAssessorId: data.stateAssessorId,
            }
        case 'pending national assessor':
            return {
                status: 'pending national assessor',
                stateAssessorNote: data.note,
                stateAssessorId: data.stateAssessorId,
            }
        case 'rejected national assessor':
            return {
                status: 'rejected national assessor',
                accepted: false,
                nationalAssessorNote: data.note,
                nationalAssessorId: data.nationalAssessorId,
            }
        case 'completed':
            if (
                currentStatus === 'pending state assessor' &&
                data.award !== 'gold'
            ) {
                return {
                    status: 'completed',
                    accepted: true,
                    stateAssessorNote: data.note,
                    stateAssessorId: data.stateAssessorId,
                }
            }
            return {
                status: 'completed',
                accepted: true,
                nationalAssessorNote: data.note,
                nationalAssessorId: data.nationalAssessorId,
            }
        case 'not started':
            return {
                status: 'not started',
            }
        default:
            throw new Error(`Unhandled status: ${nextStatus}`)
    }
}
