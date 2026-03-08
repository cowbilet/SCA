import { Card } from "@/components/card";
import { Circle } from "lucide-react";
import { CreateActivity } from "./createActivity";
import { useLogs } from "../hooks/useLogs";
import { useSession } from "@/integrations/better-auth/authClient";
import { useParams } from "@tanstack/react-router";

import Skeleton from "react-loading-skeleton";
import { LogEntry } from "@/types/schemas/log";
export function ActivityLogs() {
    const { data } = useSession()
    const { award, challenge } = useParams({strict: false})
    //TODO: Handle the params missing case properly
    const {data: logs, isLoading, isError} = useLogs(award!, challenge!, data?.user?.id)
    return (
        <Card className="h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Activity Logs</h2>
            <p className="text-gray-600">Record your progress and evidence</p>
            <CreateActivity />
            <div className="mt-4 flex flex-col gap-2 flex-1 overflow-y-auto">
                {isLoading && <Skeleton count={3} />}
                {isError && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        Error loading activity logs. Please try again later.
                    </div>
                )}
                {!isLoading && !isError && logs?.length === 0 && (
                    <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                        No activity logs found. Start by creating a new log entry!
                    </div>
                )}
                {!isLoading && !isError && logs?.map((log) => (
                    <ActivityLogEntry key={log.logId} log={log} />
                ))}
            </div>
        </Card>
    )
}
function ActivityLogEntry({log}: {log: LogEntry}) {
    return (
        <div className="border-2 border-gray-300 rounded p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-lg">
                <div className="flex flex-row items-center gap-2">
                    <Circle className="w-3 h-3 bg-blue-500 rounded-full text-blue-500" />
                    <span className="font-semibold">{log.date}</span>

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