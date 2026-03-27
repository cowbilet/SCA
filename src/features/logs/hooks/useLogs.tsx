import { queryOptions, useQuery } from '@tanstack/react-query'
import { getUserLogs } from '../api/getUserLogs'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'

export const logsQueryOptions = (
    award: Award,
    challenge: Challenge,
    studentId: string,
    selectedStatus?: string,
) =>
    queryOptions({
        queryKey: ['logs', award, challenge, studentId, selectedStatus],
        queryFn: () => getUserLogs({ data: { award, challenge, studentId } }),
        select: (data) => {
            if (selectedStatus) {
                switch (selectedStatus) {
                    case 'pending':
                        return data.filter((log) => log.approved === null)
                    case 'approved':
                        return data.filter((log) => log.approved === true)
                    case 'rejected':
                        return data.filter((log) => log.approved === false)
                    default:
                        return data
                }
            }
            return data
        },
        enabled: !!studentId,
    })
export function useLogs(
    award: Award,
    challenge: Challenge,
    studentId: string,
    selectedStatus?: string,
) {
    return useQuery(
        logsQueryOptions(award, challenge, studentId, selectedStatus),
    )
}
