import Skeleton from "react-loading-skeleton"

import { useParams } from "@tanstack/react-router"

import { useLogs } from "../../hooks/useLogs"
import { CreateActivity } from "./activityModals/createActivity"
import { DeleteActivity } from "./activityModals/deleteActivity"
import {EditActivity} from "./activityModals/editActivity"
import type { LogEntry } from "@/types/schemas/log"
import type { SubmissionState } from "@/types/awards"
import { useSession } from "@/integrations/better-auth/authClient"
import { ActivityLogGroupCard, LogEntryScaffold } from "@/features/logs/components/activityLogs"
import { StudentSubmission } from "@/features/submissions/components/studentSubmission"
import { useChallenge } from "@/hooks/useChallenge"

const disabledStatuses: Array<SubmissionState> = ["pending assessor", "pending mentor", "completed"] as const
export function StudentActivityLogs() {
    const { award, challenge } = useParams({strict: true, from: "/student/$award/$challenge"})
    const { data: user } = useSession()
    const { data } = useChallenge(award, challenge, user?.user.id)
    return (
        <div className="flex flex-col h-full gap-4">
            {!disabledStatuses.includes(data?.student_challenge.status ?? "not started") && (
                <div className="flex flex-row items-center justify-start gap-4">
                    <CreateActivity />
                    <StudentSubmission />
                </div>
            )}
            <div className="flex flex-row max-xl:flex-col h-full gap-4">
                {!disabledStatuses.includes(data?.student_challenge.status ?? "not started") && (
                    <ActivityLogGroupCard type="pending">
                        <StudentLogEntries  type="pending"/>
                    </ActivityLogGroupCard>
                )}
                <ActivityLogGroupCard type="approved">
                    <StudentLogEntries  type="approved"/>
                </ActivityLogGroupCard>
                {!disabledStatuses.includes(data?.student_challenge.status ?? "not started") && (
                    <ActivityLogGroupCard type="rejected">
                        <StudentLogEntries  type="rejected"/>
                    </ActivityLogGroupCard>
                )}
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
                        <EditActivity log={log} />
                        <DeleteActivity log={log} />
                    </>
                )}
            </div>
        </LogEntryScaffold>
    )
}