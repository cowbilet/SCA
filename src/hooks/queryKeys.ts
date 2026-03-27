import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'

export type LogStatus = 'pending' | 'approved' | 'rejected'

export const queryKeys = {
    challenges: {
        detail: (award: Award, challenge: Challenge, studentId: string) =>
            ['challenges', award, challenge, studentId] as const,
    },
    proposals: {
        detail: (award: Award, challenge: Challenge, studentId: string) =>
            ['proposals', award, challenge, studentId] as const,
    },
    pending: {
        list: () => ["pending"] as const,
    },
    logs: {
        list: (
            award: Award,
            challenge: Challenge,
            studentId: string,
            selectedStatus?: string,
        ) => ['logs', award, challenge, studentId, selectedStatus] as const,
        byStatus: (
            award: Award,
            challenge: Challenge,
            studentId: string,
            status: LogStatus,
        ) => ['logs', award, challenge, studentId, status] as const,
        allByStudent: (award: Award, challenge: Challenge, studentId: string) =>
            ['logs', award, challenge, studentId] as const,
    },
    students: {
        all: () => ['students'] as const,
    },
}
