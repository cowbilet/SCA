import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLog } from "../api/createLog";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";
import type { LogEntry } from "@/types/schemas/log";
import { useSession } from "@/integrations/better-auth/authClient";

export function useCreateLogEntry({ award, challenge}: { award: Award, challenge: Challenge }) {
    const queryClient = useQueryClient();
    const { data } = useSession()
    const studentId = data?.user.id
    return useMutation({
        mutationFn: async ({ date, description }: { date: string, description: string }) => createLog({ data: { award, challenge, description, date  } }),
        onMutate: async (newLog) => {
            await queryClient.cancelQueries({ queryKey: ['logs', award, challenge, studentId, "pending"] })

            const previousLogs = queryClient.getQueryData(['logs', award, challenge, studentId, "pending"])

            const optimisticLog: LogEntry = {
                logId: crypto.randomUUID(),
                studentId: '',
                award,
                challenge,
                description: newLog.description,
                date: newLog.date,
                approved: null,
                feedback: '',
                evidence: '',
            }
            queryClient.setQueryData(['logs', award, challenge, studentId, "pending"], (oldData: Array<LogEntry> | null) => {
                if (!oldData) return [optimisticLog]
                return [...oldData, optimisticLog]
            })

            return { previousLogs }
        },
        onError: async (_error, _newLog, context) => {
            await queryClient.cancelQueries({ queryKey: ['logs', award, challenge, studentId, "pending"] })
            if (context?.previousLogs) {
                queryClient.setQueryData(['logs', award, challenge, studentId, "pending"], context.previousLogs)
            }
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['logs', award, challenge, studentId, "pending"] })
        },
    })
}