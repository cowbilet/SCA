import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveLog } from "../api/approveLog";
import type { LogEntry } from "@/types/schemas/log";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";

export function useApproveLog(logId: string, award: Award, challenge: Challenge, studentId: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ approved, feedback }: { approved: boolean, feedback?: string }) => approveLog({data: {logId, approved, feedback}}),
        onMutate: ({ approved, feedback }) => {
            const logs = queryClient.getQueryData<Array<LogEntry> | undefined>(['logs', award, challenge, studentId, "pending"])
            if (!logs) return
            const logIndex = logs.findIndex(log => log.logId === logId)
            if (logIndex === -1) return
            const log = logs[logIndex]
            queryClient.setQueryData(['logs', award, challenge, studentId, "pending"], [
                ...logs.slice(0, logIndex),
                {...log, approved, feedback},
                ...logs.slice(logIndex + 1)
            ])
            // Add the log to the appropriate approved/rejected query
            const targetQueryKey = approved ? ['logs', award, challenge, studentId, "approved"] : ['logs', award, challenge, studentId, "rejected"]
            const targetLogs = queryClient.getQueryData<Array<LogEntry> | undefined>(targetQueryKey)
            if (targetLogs) {
                queryClient.setQueryData(targetQueryKey, [...targetLogs, {...log, approved, feedback}])
            }
            return { previousLogs: logs }
        },
        onError: (_error, _variables, context) => {
            if (context?.previousLogs) {
                queryClient.setQueryData(['logs', award, challenge, studentId, "pending"], context.previousLogs)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['logs', award, challenge, studentId]})
        }
    })
}