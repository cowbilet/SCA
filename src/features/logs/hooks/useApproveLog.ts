import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveLog } from "../api/approveLog";
import type { LogEntry } from "@/types/schemas/log";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";
import { queryKeys } from "@/hooks/queryKeys";

export function useApproveLog(logId: string, award: Award, challenge: Challenge, studentId: string) {
    const queryClient = useQueryClient()
    const pendingLogsKey = queryKeys.logs.byStatus(award, challenge, studentId, 'pending')
    return useMutation({
        mutationFn: async ({ approved, feedback }: { approved: boolean, feedback?: string }) => approveLog({data: {logId, approved, feedback}}),
        onMutate: ({ approved, feedback }) => {
            const logs = queryClient.getQueryData<Array<LogEntry> | undefined>(pendingLogsKey)
            if (!logs) return
            const logIndex = logs.findIndex(log => log.logId === logId)
            if (logIndex === -1) return
            const log = logs[logIndex]
            queryClient.setQueryData(pendingLogsKey, [
                ...logs.slice(0, logIndex),
                {...log, approved, feedback},
                ...logs.slice(logIndex + 1)
            ])
            // Add the log to the appropriate approved/rejected query
            const targetQueryKey = approved
                ? queryKeys.logs.byStatus(award, challenge, studentId, 'approved')
                : queryKeys.logs.byStatus(award, challenge, studentId, 'rejected')
            const targetLogs = queryClient.getQueryData<Array<LogEntry> | undefined>(targetQueryKey)
            if (targetLogs) {
                queryClient.setQueryData(targetQueryKey, [...targetLogs, {...log, approved, feedback}])
            }
            return { previousLogs: logs }
        },
        onError: (_error, _variables, context) => {
            if (context?.previousLogs) {
                queryClient.setQueryData(pendingLogsKey, context.previousLogs)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: queryKeys.logs.allByStudent(award, challenge, studentId)})
        }
    })
}