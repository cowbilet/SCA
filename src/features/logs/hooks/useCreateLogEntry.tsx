import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { createLog } from '../api/createLog'
import { deleteLog } from '../api/deleteLog'
import { logsQueryOptions } from './useLogs'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import type { LogEntry } from '@/types/schemas/log'
import { uploadFilesForLog } from '@/features/images/hooks/useFileUpload'
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
            files = [],
        }: {
            date: string
            description: string
            files?: Array<File>
        }) => {
            const logEntry = await createLog({ data: { award, challenge, description, date } })

            if (files.length === 0) {
                return logEntry
            }

            try {
                await uploadFilesForLog({
                    award,
                    challenge,
                    files,
                    logId: logEntry.logId,
                })
                return logEntry
            } catch (error) {
                await deleteLog({ data: { logId: logEntry.logId } })
                throw error
            }
        },
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
                files: [],
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
