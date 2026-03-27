import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { deleteLog } from '../api/deleteLog'
import { logsQueryOptions } from './useLogs'
import type { LogEntry } from '@/types/schemas/log'
import { useSession } from '@/integrations/better-auth/authClient'

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
    const { queryKey: logsKey } = logsQueryOptions(oldLog.award, oldLog.challenge, studentId ?? '', state)
    return useMutation({
        mutationFn: async () => deleteLog({ data: { logId: oldLog.logId } }),
        onMutate: async () => {
            if (!studentId) return
            await queryClient.cancelQueries({ queryKey: logsKey })

            const previousLogs = queryClient.getQueryData(logsKey)
            queryClient.setQueryData(
                logsKey,
                (oldData) => {
                    if (!oldData) return [oldLog]
                    return oldData.filter((log) => log.logId !== oldLog.logId)
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
