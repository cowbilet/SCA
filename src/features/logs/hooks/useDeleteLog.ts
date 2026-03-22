import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteLog } from '../api/deleteLog'
import type { LogEntry } from '@/types/schemas/log'
import { useSession } from '@/integrations/better-auth/authClient'
import { queryKeys } from '@/hooks/queryKeys'

export function useDeleteLog({ oldLog }: { oldLog: LogEntry }) {
    const queryClient = useQueryClient()
    const { data } = useSession()
    const studentId = data?.user.id
    const state =
        oldLog.approved === null
            ? 'pending'
            : oldLog.approved === false
              ? 'rejected'
              : 'approved'
    return useMutation({
        mutationFn: async () => deleteLog({ data: { logId: oldLog.logId } }),
        onMutate: async () => {
            if (!studentId) return
            const logsKey = queryKeys.logs.byStatus(
                oldLog.award,
                oldLog.challenge,
                studentId,
                state,
            )
            await queryClient.cancelQueries({ queryKey: logsKey })

            const previousLogs = queryClient.getQueryData(logsKey)
            queryClient.setQueryData(
                logsKey,
                (oldData: Array<LogEntry> | null) => {
                    if (!oldData) return [oldLog]
                    return oldData.filter((log) => log.logId !== oldLog.logId)
                },
            )
            return { previousLogs }
        },
        onError: async (_error, _newLog, context) => {
            if (!studentId) return
            const logsKey = queryKeys.logs.byStatus(
                oldLog.award,
                oldLog.challenge,
                studentId,
                state,
            )
            await queryClient.cancelQueries({ queryKey: logsKey })
            if (context?.previousLogs) {
                queryClient.setQueryData(logsKey, context.previousLogs)
            }
        },
        onSettled: async () => {
            if (!studentId) return
            await queryClient.invalidateQueries({
                queryKey: queryKeys.logs.byStatus(
                    oldLog.award,
                    oldLog.challenge,
                    studentId,
                    state,
                ),
            })
        },
    })
}
