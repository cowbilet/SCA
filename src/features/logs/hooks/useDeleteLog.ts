import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteLog } from "../api/deleteLog";
import type { LogEntry } from "@/types/schemas/log";
import { useSession } from "@/integrations/better-auth/authClient";

export function useDeleteLog({ oldLog }: { oldLog: LogEntry }) {
    const queryClient = useQueryClient();
    const { data } = useSession()
    const studentId = data?.user.id
    const state = oldLog.approved === null ? "pending" : oldLog.approved === false ? "rejected" : "approved"
    return useMutation({
        mutationFn: async () => deleteLog({ data: { logId: oldLog.logId } }),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['logs', oldLog.award, oldLog.challenge, studentId, state] })

            const previousLogs = queryClient.getQueryData(['logs', oldLog.award, oldLog.challenge, studentId, state])
            queryClient.setQueryData(['logs', oldLog.award, oldLog.challenge, studentId, state], (oldData: Array<LogEntry> | null) => {
                if (!oldData) return [oldLog]
                return oldData.filter(log => log.logId !== oldLog.logId)
            })
            return { previousLogs }
        },
        onError: async (_error, _newLog, context) => {
            await queryClient.cancelQueries({ queryKey: ['logs', oldLog.award, oldLog.challenge, studentId, state] })
            if (context?.previousLogs) {
                queryClient.setQueryData(['logs', oldLog.award, oldLog.challenge, studentId, state], context.previousLogs)
            }
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['logs', oldLog.award, oldLog.challenge, studentId, state] })
        },
    })
}