import Skeleton from "react-loading-skeleton"
import { useLocation, useParams } from "@tanstack/react-router"
import { useLogs } from "../../hooks/useLogs"
import { useApproveLog } from "../../hooks/useApproveLog"
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
    const { award, challenge, studentId } = useParams({strict: true, from: "/$advisor/$studentId/$award/$challenge"})
    const { mutate: approveLog } = useApproveLog(log.logId, award, challenge, studentId)
    const onSubmitFeedback = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        const submitter = event.nativeEvent.submitter as HTMLButtonElement
        // This is a pretty recent addition to browsers
        // TODO: Add polyfill
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition --- This is because some browsers don't support the submitter property ---
        if (!submitter) {
            console.error("No submitter found for feedback form submission. Please update your browser to a more recent version that supports the submitter property on the submit event.")
            return
        }
        const formData = new FormData(event.target)
        const feedback = formData.get("feedback") as string
        approveLog({ approved: submitter.id === "approve", feedback })
    }
    // TODO: Make this have error handling and loading states
    return (
        <LogEntryScaffold log={log} key={log.logId} feedback={<FeedbackForm disabled={false} onSubmit={onSubmitFeedback}/>} isFeedbackOpen={log.approved === null} />
    )
}