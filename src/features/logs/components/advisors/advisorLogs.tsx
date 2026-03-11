import Skeleton from "react-loading-skeleton"
import { useLocation, useParams } from "@tanstack/react-router"
import { useLogs } from "../../hooks/useLogs"
import type { LogEntry } from "@/types/schemas/log"
import { ActivityLogGroupCard, FeedbackForm, LogEntryScaffold } from "@/features/logs/components/activityLogs"

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
    return (
        <LogEntryScaffold log={log} key={log.logId} feedback={<FeedbackForm disabled={false} />} isFeedbackOpen={log.approved === null} />
    )
}