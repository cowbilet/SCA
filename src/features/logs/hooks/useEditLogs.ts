import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { editLog } from '../api/editLog'
import { logsQueryOptions } from './useLogs'
import type { LogEntry } from '@/types/schemas/log'
import { useSession } from '@/integrations/better-auth/authClient'

export function useEditLog({ oldLog }: { oldLog: LogEntry }) {
    const queryClient = useQueryClient()
    const { data } = useSession()
    const studentId = data?.user.id
    const state =
        oldLog.approved === null
            ? 'pending'
            : oldLog.approved === false
              ? 'rejected'
              : 'approved'
    const { queryKey: logsKey } = logsQueryOptions(oldLog.award, oldLog.challenge, studentId ?? '', state)
    return useMutation({
        mutationFn: async ({
            date,
            description,
        }: {
            date: string
            description: string
        }) => editLog({ data: { logId: oldLog.logId, date, description } }),
        onMutate: async (newLog) => {
            if (!studentId) return
            await queryClient.cancelQueries({ queryKey: logsKey })

            const previousLogs = queryClient.getQueryData(logsKey)
            queryClient.setQueryData(
                logsKey,
                // TODO: Remove the as
                (oldData) => {
                    if (!oldData) return [newLog as LogEntry]
                    return oldData.map((log) =>
                        log.logId === oldLog.logId
                            ? ({ ...log, ...newLog } as LogEntry)
                            : log,
                    )
                },
            )
            return { previousLogs }
        },
        onError: (_error, _newLog, context) => {
            if (!studentId) return
            if (context?.previousLogs) {
                queryClient.setQueryData(logsKey, context.previousLogs)
            }
        },
        onSettled: async () => {
            if (!studentId) return
            await queryClient.invalidateQueries({ queryKey: logsKey })
        },
    })
}
