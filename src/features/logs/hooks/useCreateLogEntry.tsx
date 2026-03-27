import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { createLog } from '../api/createLog'
import { logsQueryOptions } from './useLogs'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import type { LogEntry } from '@/types/schemas/log'
import { useSession } from '@/integrations/better-auth/authClient'

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
    const { queryKey: pendingLogsKey } = logsQueryOptions(award, challenge, studentId ?? '', 'pending')
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
                (oldData) => {
                    if (!oldData) return [optimisticLog]
                    return [...oldData, optimisticLog]
                },
            )

            return { previousLogs }
        },
        onError: (_error, _newLog, context) => {
            if (!studentId) return
            if (context?.previousLogs) {
                queryClient.setQueryData(pendingLogsKey, context.previousLogs)
            }
        },
        onSettled: async () => {
            if (!studentId) return
            await queryClient.invalidateQueries({ queryKey: pendingLogsKey })
        },
    })
}
