import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLog } from '../api/createLog'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import type { LogEntry } from '@/types/schemas/log'
import { useSession } from '@/integrations/better-auth/authClient'
import { queryKeys } from '@/hooks/queryKeys'

export function useCreateLogEntry({
    award,
    challenge,
}: {
    award: Award
    challenge: Challenge
}) {
    const queryClient = useQueryClient()
    const { data } = useSession()
    const studentId = data?.user.id
    return useMutation({
        mutationFn: async ({
            date,
            description,
        }: {
            date: string
            description: string
        }) => createLog({ data: { award, challenge, description, date } }),
        onMutate: async (newLog) => {
            if (!studentId) return
            const pendingLogsKey = queryKeys.logs.byStatus(
                award,
                challenge,
                studentId,
                'pending',
            )
            await queryClient.cancelQueries({ queryKey: pendingLogsKey })

            const previousLogs = queryClient.getQueryData(pendingLogsKey)

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
            queryClient.setQueryData(
                pendingLogsKey,
                (oldData: Array<LogEntry> | null) => {
                    if (!oldData) return [optimisticLog]
                    return [...oldData, optimisticLog]
                },
            )

            return { previousLogs }
        },
        onError: async (_error, _newLog, context) => {
            if (!studentId) return
            const pendingLogsKey = queryKeys.logs.byStatus(
                award,
                challenge,
                studentId,
                'pending',
            )
            await queryClient.cancelQueries({ queryKey: pendingLogsKey })
            if (context?.previousLogs) {
                queryClient.setQueryData(pendingLogsKey, context.previousLogs)
            }
        },
        onSettled: async () => {
            if (!studentId) return
            await queryClient.invalidateQueries({
                queryKey: queryKeys.logs.byStatus(
                    award,
                    challenge,
                    studentId,
                    'pending',
                ),
            })
        },
    })
}
