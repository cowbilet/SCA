import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { editLog } from '../api/editLog'
import type { LogEntry } from '@/types/schemas/log'
import { uploadFilesForLog } from '@/features/images/hooks/useFileUpload'
import { useSession } from '@/integrations/better-auth/authClient'

type LogStatus = 'pending' | 'approved' | 'rejected'
// TODO: Have a look back at this hook and see if we can simplify the logic (might need a structural change to how we query logs)
function statusFromApproved(
    approved: boolean | null | undefined,
): LogStatus {
    if (approved === null || approved === undefined) return 'pending'
    return approved ? 'approved' : 'rejected'
}

function statusMatchesFilter(
    selectedStatus: string | undefined,
    status: LogStatus,
) {
    if (!selectedStatus) return true
    return selectedStatus === status
}

export function useEditLog({ oldLog }: { oldLog: LogEntry }) {
    const queryClient = useQueryClient()
    const { data } = useSession()
    const studentId = data?.user.id

    const logsPrefixKey = ['logs', oldLog.award, oldLog.challenge, studentId ?? ''] as const

    return useMutation({
        mutationFn: async ({
            date,
            description,
            approved,
            files,
            newFiles = [],
        }: {
            date: string
            description: string
            approved?: boolean | null
            files?: Array<string>
            newFiles?: Array<File>
        }) => {
            const logEntry = await editLog({
                data: { logId: oldLog.logId, date, description, approved, files },
            })

            if (newFiles.length > 0) {
                await uploadFilesForLog({
                    award: oldLog.award,
                    challenge: oldLog.challenge,
                    files: newFiles,
                    logId: oldLog.logId,
                })
            }

            return logEntry
        },
        onMutate: async (newLog) => {
            if (!studentId) return
            await queryClient.cancelQueries({ queryKey: logsPrefixKey })

            const previousLogs = queryClient.getQueriesData<Array<LogEntry>>({
                queryKey: logsPrefixKey,
            })

            const updatedLog: LogEntry = {
                ...oldLog,
                ...newLog,
                approved:
                    newLog.approved === undefined
                        ? oldLog.approved
                        : newLog.approved,
                files: newLog.files ?? oldLog.files,
            }

            const oldStatus = statusFromApproved(oldLog.approved)
            const nextStatus = statusFromApproved(updatedLog.approved)

            previousLogs.forEach(([key, logs]) => {
                if (!Array.isArray(logs)) return
                const selectedStatus = key[4] as string | undefined
                const shouldContain = statusMatchesFilter(selectedStatus, nextStatus)

                if (shouldContain) {
                    const hasLog = logs.some((log) => log.logId === oldLog.logId)
                    const nextLogs = hasLog
                        ? logs.map((log) =>
                              log.logId === oldLog.logId ? updatedLog : log,
                          )
                        : oldStatus === nextStatus
                          ? logs
                          : [updatedLog, ...logs]
                    queryClient.setQueryData<Array<LogEntry>>(key, nextLogs)
                    return
                }

                const nextLogs = logs.filter((log) => log.logId !== oldLog.logId)
                queryClient.setQueryData<Array<LogEntry>>(key, nextLogs)
            })

            return { previousLogs }
        },
        onError: (_error, _newLog, context) => {
            if (!studentId) return
            if (context?.previousLogs) {
                context.previousLogs.forEach(([key, previousData]) => {
                    queryClient.setQueryData(key, previousData)
                })
            }
        },
        onSettled: async () => {
            if (!studentId) return
            await queryClient.invalidateQueries({ queryKey: logsPrefixKey })
            await queryClient.invalidateQueries({
                queryKey: ['files', oldLog.award, oldLog.challenge, oldLog.logId],
            })
        },
    })
}
