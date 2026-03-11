import { Card } from "@/components/card";
import { Circle, Clock } from "lucide-react";
import { CreateActivity } from "./createActivity";
import { useLogs } from "../hooks/useLogs";
import { useSession } from "@/integrations/better-auth/authClient";
import { useParams } from "@tanstack/react-router";

import Skeleton from "react-loading-skeleton";
import { LogEntry } from "@/types/schemas/log";
import clsx from "clsx";
export function ActivityLogs() {
    // const { data } = useSession()
    // const { award, challenge } = useParams({strict: false})
    //TODO: Handle the params missing case properly
    // const {data: logs, isLoading, isError} = useLogs(award!, challenge!, data?.user?.id)
    return (
        <div className="flex flex-row max-xl:flex-col h-full gap-4">
            <Card className="p-0! flex-1">
                <ActivityLogHeader className="bg-yellow-100/50 border-b-yellow-400/75 border-b-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <h2 className="text-lg font-semibold text-block flex flex-row items-center gap-2">
                        Pending Logs
                    </h2>
                </ActivityLogHeader>
            </Card>
            <Card className="p-0! flex-1">
                <ActivityLogHeader className="bg-red-100/50 border-b-red-400/75 border-b-2">
                    <Clock className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-semibold text-block flex flex-row items-center gap-2">
                        Rejected Logs
                    </h2>
                </ActivityLogHeader>
            </Card>
            <Card className="p-0! flex-1">
                <ActivityLogHeader className="bg-green-100/50 border-b-green-400/75 border-b-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-block flex flex-row items-center gap-2">
                        Approved Logs
                    </h2>
                </ActivityLogHeader>
            </Card>
        </div>
    )
}
function ActivityLogHeader({className, children, ...props}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx("w-full h-fit p-4 rounded-t-lg flex flex-row items-center gap-2", className)} {...props}>
            {children}
        </div>
    )
}
function ActivityLogEntry({log}: {log: LogEntry}) {
    return (
        <div className="border-2 border-gray-300 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-lg">
                <div className="flex flex-row items-center gap-2">
                    <Circle className="w-3 h-3 bg-blue-500 rounded-full text-blue-500" />
                    <span className="font-semibold">{log.date}</span>
                    <ActivityStatusTag approved={log.approved} />
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
function ActivityStatusTag({approved} : {approved: boolean | null}) {
    if (approved === null) {
        return <span className=" ml-auto text-sm text-gray-500">Pending Review</span>
    } else if (approved === true) {
        return <span className="ml-auto text-sm text-green-500">Approved</span>
    } else {
        return <span className="text-sm text-red-500">Rejected</span>
    }
}