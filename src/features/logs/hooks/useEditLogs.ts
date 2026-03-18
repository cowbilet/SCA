import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editLog } from "../api/editLog";
import type { LogEntry } from "@/types/schemas/log";
import { useSession } from "@/integrations/better-auth/authClient";

export function useEditLog({ oldLog }: { oldLog: LogEntry }) {
    const queryClient = useQueryClient();
    const { data } = useSession()
    const studentId = data?.user.id
    return useMutation({
        mutationFn: async ({ date, description }: { date: string, description: string }) => editLog({ data: { logId: oldLog.logId, date, description } }),
        onMutate: async (newLog) => {
            await queryClient.cancelQueries({ queryKey: ['logs', oldLog.award, oldLog.challenge, studentId, oldLog.approved === false ? "rejected" : "pending"] })

            const previousLogs = queryClient.getQueryData(['logs', oldLog.award, oldLog.challenge, studentId, oldLog.approved === false ? "rejected" : "pending"])
            queryClient.setQueryData(['logs', oldLog.award, oldLog.challenge, studentId, oldLog.approved === false ? "rejected" : "pending"], (oldData: Array<LogEntry> | null) => {
                if (!oldData) return [newLog as LogEntry]
                return oldData.map(log => log.logId === oldLog.logId ? { ...log, ...newLog } as LogEntry : log)
            })
            return { previousLogs }
        },
        onError: async (_error, _newLog, context) => {
            await queryClient.cancelQueries({ queryKey: ['logs', oldLog.award, oldLog.challenge, studentId, oldLog.approved === false ? "rejected" : "pending"] })
            if (context?.previousLogs) {
                queryClient.setQueryData(['logs', oldLog.award, oldLog.challenge, studentId, oldLog.approved === false ? "rejected" : "pending"], context.previousLogs)
            }
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['logs', oldLog.award, oldLog.challenge, studentId, oldLog.approved === false ? "rejected" : "pending"] })
        },
    })
}