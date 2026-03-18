import Skeleton from "react-loading-skeleton"
import { Pencil, Trash } from "lucide-react"
import { useParams } from "@tanstack/react-router"

import { useLogs } from "../../hooks/useLogs"
import { CreateActivity } from "./createActivity"
import { DeleteActivity } from "./deleteActivity"
import type { LogEntry } from "@/types/schemas/log"
import { useSession } from "@/integrations/better-auth/authClient"
import { ActivityLogGroupCard, LogEntryScaffold } from "@/features/logs/components/activityLogs"
import { StudentSubmission } from "@/features/submissions/components/studentSubmission"

export function StudentActivityLogs() {
    
    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex flex-row items-center justify-start gap-4">
                <CreateActivity />
                <StudentSubmission />
            </div>
            <div className="flex flex-row max-xl:flex-col h-full gap-4">
                <ActivityLogGroupCard type="pending">
                    <StudentLogEntries  type="pending"/>
                </ActivityLogGroupCard>
                <ActivityLogGroupCard type="approved">
                    <StudentLogEntries  type="approved"/>
                </ActivityLogGroupCard>
                <ActivityLogGroupCard type="rejected">
                    <StudentLogEntries  type="rejected"/>
                </ActivityLogGroupCard>
            </div>
        </div>
    )
}
function StudentLogEntries({type}: {type: "pending" | "approved" | "rejected"}) {
    const { data } = useSession()
    const { award, challenge } = useParams({strict: true, from: "/student/$award/$challenge"})
    // TODO: Handle the params missing case properly
    const {data: logs, isPending, isError} = useLogs(award, challenge, data?.user.id, type)
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
                        <button className=" text-blue-500 font-bold rounded w-5 h-5 flex items-center justify-center"><Pencil /></button>
                        <DeleteActivity log={log} />
                    </>
                )}
            </div>
        </LogEntryScaffold>
    )
}