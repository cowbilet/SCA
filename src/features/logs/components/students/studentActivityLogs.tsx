import Skeleton from "react-loading-skeleton"

import { useParams } from "@tanstack/react-router"

import { useLogs } from "../../hooks/useLogs"
import { DeleteActivity } from "./activityModals/deleteActivity"
import {EditActivity} from "./activityModals/editActivity"
import type { LogEntry } from "@/types/schemas/log"
import { ActivityLogGroupCard, LogEntryScaffold } from "@/features/logs/components/activityLogs"

import { Route } from "@/routes/student/route"

export function StudentActivityLogs({disabled = false}: {disabled?: boolean}) {
    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex flex-row max-xl:flex-col h-full gap-4">
                {!disabled && (
                    <ActivityLogGroupCard type="pending">
                        <StudentLogEntries  type="pending"/>
                    </ActivityLogGroupCard>
                )}
                <ActivityLogGroupCard type="approved">
                    <StudentLogEntries  type="approved"/>
                </ActivityLogGroupCard>
                {!disabled && (
                    <ActivityLogGroupCard type="rejected">
                        <StudentLogEntries  type="rejected"/>
                    </ActivityLogGroupCard>
                )}
            </div>
        </div>
    )
}
function StudentLogEntries({type}: {type: "pending" | "approved" | "rejected"}) {
    const { user } = Route.useRouteContext()
    const { award, challenge } = useParams({strict: true, from: "/student/$award/$challenge"})
    const {data: logs, isPending, isError} = useLogs(award, challenge, user.userId, type)
    if (isPending) {
        return <Skeleton count={3} height={80} className="mb-2" />
    }
    if (isError) {
        return <p className="text-red-500">Failed to load logs.</p>
    }
    if (logs.length === 0) {
        return <p className="text-gray-500">No logs found.</p>
    }
    return (
        <>
            {logs.map(log => (
                <StudentLogEntry key={log.logId} log={log} />
            ))}
        </>
    )
}
function StudentLogEntry({log}: {log: LogEntry}) {
    return (
        <LogEntryScaffold 
            log={log} key={log.logId}
        >
            <div className="buttons ml-auto flex flex-row items-center gap-1">

                {(log.approved === false || log.approved === null) && (
                    <>  
                        <EditActivity log={log} />
                        <DeleteActivity log={log} />
                    </>
                )}
            </div>
        </LogEntryScaffold>
    )
}