import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approveLog } from '../api/approveLog'
import { logsQueryOptions } from './useLogs'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'

export function useApproveLog(
    logId: string,
    award: Award,
    challenge: Challenge,
    studentId: string,
) {
    const queryClient = useQueryClient()
    const { queryKey: pendingLogsKey } = logsQueryOptions(award, challenge, studentId, 'pending')
    const { queryKey: approvedKey } = logsQueryOptions(award, challenge, studentId, 'approved')
    const { queryKey: rejectedKey } = logsQueryOptions(award, challenge, studentId, 'rejected')
    return useMutation({
        mutationFn: async ({
            approved,
            feedback,
        }: {
            approved: boolean
            feedback?: string
        }) => approveLog({ data: { logId, approved, feedback } }),
        onMutate: ({ approved, feedback }) => {
            const logs = queryClient.getQueryData(
                pendingLogsKey,
            )
            if (!logs) return
            const logIndex = logs.findIndex((log) => log.logId === logId)
            if (logIndex === -1) return
            const log = logs[logIndex]
            queryClient.setQueryData(pendingLogsKey, [
                ...logs.slice(0, logIndex),
                { ...log, approved, feedback: feedback ?? null },
                ...logs.slice(logIndex + 1),
            ])
            // Add the log to the appropriate approved/rejected query
            const targetQueryKey = approved ? approvedKey : rejectedKey
            const targetLogs = queryClient.getQueryData(
                targetQueryKey,
            )
            if (targetLogs) {
                queryClient.setQueryData(targetQueryKey, [
                    ...targetLogs,
                    { ...log, approved, feedback: feedback ?? null },
                ])
            }
            return { previousLogs: logs }
        },
        onError: (_error, _variables, context) => {
            if (context?.previousLogs) {
                queryClient.setQueryData(pendingLogsKey, context.previousLogs)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: pendingLogsKey,
            })
            queryClient.invalidateQueries({
                queryKey: approvedKey,
            })
            queryClient.invalidateQueries({
                queryKey: rejectedKey,
            })
        },
    })
}
