import { Circle, Clock } from 'lucide-react'
import clsx from 'clsx'

import type { LogEntry } from '@/types/schemas/log'
import { Card, CardHeader } from '@/components/card'


const logStyling = {
    pending: {
        variant: 'warning' as const,
        icon: <Clock className="w-5 h-5 text-yellow-600" />,
    },
    rejected: {
        variant: 'danger' as const,
        icon: <Clock className="w-5 h-5 text-red-600" />,
    },
    approved: {
        variant: 'success' as const,
        icon: <Clock className="w-5 h-5 text-green-600" />,
    },
}
export function StandardActivityLogs({
    LogEntryComponent,
}: {
    LogEntryComponent: React.FC<{ type: 'pending' | 'approved' | 'rejected' }>
}) {
    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex flex-row max-xl:flex-col h-full gap-4">
                <ActivityLogGroupCard type="pending">
                    <LogEntryComponent type="pending" />
                </ActivityLogGroupCard>
                <ActivityLogGroupCard type="approved">
                    <LogEntryComponent type="approved" />
                </ActivityLogGroupCard>
                <ActivityLogGroupCard type="rejected">
                    <LogEntryComponent type="rejected" />
                </ActivityLogGroupCard>
            </div>
        </div>
    )
}
export function SubmittedActivityLogs({
    LogEntryComponent,
}: {
    LogEntryComponent: React.FC<{ type: 'pending' | 'approved' | 'rejected' }>
}) {
    
    return (
        <ActivityLogGroupCard type="approved">
            <LogEntryComponent type="approved" />
        </ActivityLogGroupCard>        
    )
}

export function ActivityLogGroupCard({
    type,
    children,
}: {
    type: keyof typeof logStyling
    children: React.ReactNode
}) {
    return (
        <Card className="p-0! flex-1">
            <CardHeader variant={logStyling[type].variant}>
                {logStyling[type].icon}
                <h2 className="text-lg font-semibold text-block flex flex-row items-center gap-2">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Logs
                </h2>
            </CardHeader>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                {children}
            </div>
        </Card>
    )
}
export function LogEntryScaffold({
    log,
    children,
}: {
    log: LogEntry
    children?: React.ReactNode
}) {
    return (
        <div className="border-2 bg-gray border-gray-300 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-lg">
                <div className="flex flex-row items-center gap-2 w-full">
                    <Circle
                        className={clsx(
                            `w-3 h-3 min-w-3 min-h-3 rounded-full`,
                            log.approved === true &&
                                'bg-green-500 text-green-500',
                            log.approved === false && 'bg-red-500 text-red-500',
                            log.approved === null &&
                                'bg-yellow-500 text-yellow-500',
                        )}
                    />
                    <span className="font-semibold">
                        {new Date(log.date).toLocaleDateString()}
                    </span>
                    {children}
                </div>
            </div>
            <h2 className="text-sm font-semibold">ACTIVITY</h2>
            <p className="text-gray-600">{log.description}</p>
            {/* {footer && (
                <div className="mt-2">
                    {footer}
                </div>
            )} */}
            {/* {isFeedbackOpen && (
                feedback
            )} */}
        </div>
    )
}
