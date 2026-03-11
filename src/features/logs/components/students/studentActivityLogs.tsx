import { ActivityLogGroupCard } from "@/features/logs/components/activityLogs"
import { Circle, DoorOpen, Pencil, Repeat2, Trash } from "lucide-react"
import type { LogEntry } from "@/types/schemas/log"
import { useLogs } from "../../hooks/useLogs"
import { useSession } from "@/integrations/better-auth/authClient"
import { useParams } from "@tanstack/react-router"
import Skeleton from "react-loading-skeleton"
export function StudentActivityLogs() {
    
    return (
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
    )
}
function StudentLogEntries({type}: {type: "pending" | "approved" | "rejected"}) {
    const { data } = useSession()
    const { award, challenge } = useParams({strict: true, from: "/student/$award/$challenge"})
    // TODO: Handle the params missing case properly
    const {data: logs, isPending, isError} = useLogs(award, challenge, data?.user?.id, type)
    if (isPending) {
        return <Skeleton count={3} height={80} className="mb-2" />
    }
    if (isError) {
        return <p className="text-red-500">Failed to load logs.</p>
    }
    if (!logs || logs.length === 0) {
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
        <div className="border-2 border-gray-300 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-lg">
                <div className="flex flex-row items-center gap-2">
                    <Circle className="w-3 h-3 min-w-3 min-h-3 bg-blue-500 rounded-full text-blue-500" />
                    <span className="font-semibold">{new Date(log.date).toLocaleDateString()}</span>
                    <div className="buttons ml-auto flex flex-row items-center gap-1">

                        {log.approved === false && (
                            <>  
                                <button className=" text-blue-500 font-bold rounded w-5 h-5 flex items-center justify-center"><Repeat2 /></button>
                                
                                <button className=" text-red-500 font-bold rounded w-5 h-5 flex items-center justify-center"><Trash /></button>
                            </>
                        )}
                        {log.approved === null && (
                            <>
                                <button className=" text-blue-500 font-bold rounded w-5 h-5 flex items-center justify-center"><Pencil /></button>
                                <button className=" text-red-500 font-bold rounded w-5 h-5 flex items-center justify-center"><DoorOpen /></button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <h2 className="text-sm font-semibold">
                ACTIVITY
            </h2>
            <p className="text-gray-600">
                {log.description}
            </p>
        </div>
    )
}