import clsx from 'clsx'
import { Circle, Clock } from 'lucide-react'

import { useLocation } from '@tanstack/react-router'
import Reflection from './reflection'
import type { LogEntry } from '@/types/schemas/log'
import type { StudentChallengeWithProposalAndSubmission } from '@/types/schemas/challenges'
import { Card, CardBody, CardHeader } from '@/components/card'
import FeedbackForm from '@/components/advisors/feedbackForm'

const logStyling = {
    pending: {
        card: 'bg-yellow-100/50 border-b-yellow-400/75',
        icon: <Clock className="w-5 h-5 text-yellow-600" />,
    },
    rejected: {
        card: 'bg-red-100/50 border-b-red-400/75',
        icon: <Clock className="w-5 h-5 text-red-600" />,
    },
    approved: {
        card: 'bg-green-100/50 border-b-green-400/75',
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
    challengeData,
}: {
    LogEntryComponent: React.FC<{ type: 'pending' | 'approved' | 'rejected' }>
    challengeData: StudentChallengeWithProposalAndSubmission
}) {
    const location = useLocation()
    const isGivingFeedback = (location.pathname.includes("mentor") && challengeData.student_challenge.status === "pending mentor") || (location.pathname.includes("assessor") && challengeData.student_challenge.status === "pending assessor")
    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex flex-row max-lg:flex-col h-full gap-4">
                <ActivityLogGroupCard type="approved">
                    <LogEntryComponent type="approved" />
                </ActivityLogGroupCard>
                <div className="flex-1 flex flex-col gap-4">
                    <Card className=" p-0! flex-1">
                        <Reflection
                            reflection={challengeData.student_challenge.reflection}
                        />
                    </Card>
                    {isGivingFeedback && (
                        <Card className="p-0! h-fit">
                            <CardHeader className="bg-blue-100/50 border-blue-400/75">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <h2 className="text-lg font-semibold text-block flex flex-row items-center gap-2">
                                    Feedback
                                </h2>
                            </CardHeader>
                            <CardBody>
                                <FeedbackForm
                                    onValidSubmit={async ({ feedback, accepted }) => {}}
                                />
                            </CardBody>
                        </Card>
                    )}
                </div>
                
                   
            </div>
        </div>
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
            <ActivityLogHeader
                className={clsx(logStyling[type].card, 'border-b-2')}
            >
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

function ActivityLogHeader({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx(
                'w-full h-fit p-4 rounded-t-lg flex flex-row items-center gap-2',
                className,
            )}
            {...props}
        >
            {children}
        </div>
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
