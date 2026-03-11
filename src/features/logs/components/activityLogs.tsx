import { Card } from "@/components/card";
import { Circle, Clock } from "lucide-react";

import { LogEntry } from "@/types/schemas/log";
import clsx from "clsx";

const logStyling = {
    pending: {
        "card": "bg-yellow-100/50 border-b-yellow-400/75",
        "icon": <Clock className="w-5 h-5 text-yellow-600" />
    },
    rejected: {
        "card": "bg-red-100/50 border-b-red-400/75",
        "icon": <Clock className="w-5 h-5 text-red-600" />
    },
    approved: {
        "card": "bg-green-100/50 border-b-green-400/75",
        "icon": <Clock className="w-5 h-5 text-green-600" />
    }
}
export function ActivityLogGroupCard({type, children}: {type: keyof typeof logStyling; children: React.ReactNode}) {
    return (
        <Card className="p-0! flex-1">
            <ActivityLogHeader className={clsx(logStyling[type].card, "border-b-2")}>
                {logStyling[type].icon}
                <h2 className="text-lg font-semibold text-block flex flex-row items-center gap-2">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Logs
                </h2>
            </ActivityLogHeader>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                {children}
            </div>
        </Card>
    )
}
// export function ActivityLogGroup({type}: {type: keyof typeof logStyling}) {
//     const { data } = useSession()
//     const { award, challenge } = useParams({strict: false})
//     // TODO: Handle the params missing case properly
//     const {data: logs, isLoading, isError} = useLogs(award!, challenge!, data?.user?.id, type)
//     if (isLoading) {
//         return (
//             <ActivityLogGroupCard type={type}>
//                 <Skeleton count={3} height={80} className="mb-2" />
//             </ActivityLogGroupCard>
//         )
//     }
//     if (isError) {
//         return (
//             <ActivityLogGroupCard type={type}>
//                 <p className="text-red-500">Failed to load logs.</p>
//             </ActivityLogGroupCard>
//         )
//     }
//     if (!logs || logs.length === 0) {
//         return (
//             <ActivityLogGroupCard type={type}>
//                 <p className="text-gray-500">No {type} logs found.</p>
//             </ActivityLogGroupCard>
//         )
//     }
//     return (
//         <ActivityLogGroupCard type={type}>
//             {logs.map(log => <ActivityLogEntry key={log.logId} log={log} />)}
//         </ActivityLogGroupCard>
//     )

// }
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
