import Skeleton from "react-loading-skeleton"
import { useLocation, useParams } from "@tanstack/react-router"
import { Check, X } from "lucide-react"
import { useLogs } from "../../hooks/useLogs"
import { useApproveLog } from "../../hooks/useApproveLog"
import type { LogEntry } from "@/types/schemas/log"
import { ActivityLogGroupCard, LogEntryScaffold } from "@/features/logs/components/activityLogs"

export function AdvisorActivityLogs() {
    return (
        <div className="flex flex-row max-xl:flex-col h-full gap-4">
            <ActivityLogGroupCard type="pending">
                <AdvisorLogEntries  type="pending"/>
            </ActivityLogGroupCard>
            <ActivityLogGroupCard type="approved">
                <AdvisorLogEntries  type="approved"/>
            </ActivityLogGroupCard>
            <ActivityLogGroupCard type="rejected">
                <AdvisorLogEntries  type="rejected"/>
            </ActivityLogGroupCard>
        </div>
    )
}
function AdvisorLogEntries({type}: {type: "pending" | "approved" | "rejected"}) {
    const { award, challenge, studentId } = useParams({strict: true, from: "/$advisor/$studentId/$award/$challenge"})
    // TODO: Handle the params missing case properly
    const {data: logs, isPending, isError} = useLogs(award, challenge, studentId, type)
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
                <AdvisorLogEntry key={log.logId} log={log} />
            ))}
        </>
    )
}
function AdvisorLogEntry({log}: {log: LogEntry}) {
    const location = useLocation()
    const isMentor = location.pathname.includes("/mentor/")
    if (isMentor) return <MentorLogEntry log={log} />
    return <LogEntryScaffold log={log} key={log.logId}/>
}
function MentorLogEntry({log}: {log: LogEntry}) {
    const { award, challenge, studentId } = useParams({strict: true, from: "/$advisor/$studentId/$award/$challenge"})
    const { mutate: approveLog } = useApproveLog(log.logId, award, challenge, studentId)
    // TODO: Make this have error handling and loading states
    return (
        <LogEntryScaffold 
            log={log} 
            key={log.logId} 
        >
            <div className="buttons ml-auto flex flex-row items-center gap-1">

                {log.approved === null && (
                    <>  
                        <button onClick={() => approveLog({ approved: true })} className=" text-green-500 font-bold rounded w-5 h-5 flex items-center justify-center hover:cursor-pointer"><Check /></button>
                        {/* TODO: Make this show feedback? */}
                        <button onClick={() => approveLog({ approved: false })} className=" text-red-500 font-bold rounded w-5 h-5 flex items-center justify-center hover:cursor-pointer"><X /></button>
                    </>
                )}
            </div>
        </LogEntryScaffold>
    )
}