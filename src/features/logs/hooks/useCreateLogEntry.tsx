import { createLog } from "../api/createLog";
import { Award } from "@/types/awards";
import { Challenge } from "@/types/challenges";
import { LogEntry } from "@/types/schemas/log";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
export function useCreateLogEntry({ award, challenge}: { award: Award, challenge: Challenge }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ date, description }: { date: string, description: string }) => createLog({ data: { award, challenge, description, date  } }),
        onMutate: async (newLog) => {
            await queryClient.cancelQueries({ queryKey: ['logs', award, challenge] })

            const previousLogs = queryClient.getQueryData(['logs', award, challenge])

            const optimisticLog: LogEntry = {
                logId: crypto.randomUUID(),
                studentId: '',
                award,
                challenge,
                description: newLog.description,
                date: newLog.date,
                approved: null,
                evidence: '',
            }
            queryClient.setQueryData(['logs', award, challenge], (oldData: LogEntry[] | null) => {
                if (!oldData) return [optimisticLog]
                return [...oldData, optimisticLog]
            })

            return { previousLogs }
        },
        onError: async (_error, _newLog, context) => {
            await queryClient.cancelQueries({ queryKey: ['logs', award, challenge] })
            if (context?.previousLogs) {
                queryClient.setQueryData(['logs', award, challenge], context.previousLogs)
            }
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['logs', award, challenge] })
        },
    })
}