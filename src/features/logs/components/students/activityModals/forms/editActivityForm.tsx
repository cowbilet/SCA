// import { useParams } from "@tanstack/react-router"
// import { useCreateLogEntry } from "../../../../hooks/useCreateLogEntry"
import { useEditLog } from '../../../../hooks/useEditLogs'
import ActivityForm from './activityForm'
import type { LogEntry } from '@/types/schemas/log'
import type { ComponentProps } from 'react'

export default function EditActivityForm({
    log,
    onSubmit,
    ...props
}: Omit<ComponentProps<'form'>, 'onSubmit'> & {
    log: LogEntry
    onSubmit?: () => void
}) {
    const { mutateAsync: editLog } = useEditLog({ oldLog: log })
    return (
        <ActivityForm
            id="edit-activity-form"
            log={log}
            onValidSubmit={async ({ date, description }) => {
                await editLog({ description, date })
                onSubmit?.()
            }}
            {...props}
        />
    )
}
