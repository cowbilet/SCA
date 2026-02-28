import { SubmissionState } from '@/types/awards'
import type { Proposal } from '@/types/schemas/proposal'
import { Notification, NotificationHeader, NotificationBody } from '@/components/notification'
import { HTMLAttributes, ReactNode } from 'react'
const InstructionDictionary: Record<SubmissionState, React.ReactNode> = {
    'not started': (
        <Notification className="bg-yellow-100 border-yellow-500">
            <NotificationHeader className="text-yellow-700 font-bold text-lg">
                📋 Step 1: Submit Proposal
            </NotificationHeader>
            <NotificationBody className="text-yellow-700">
                Before you can start logging activities, you need to submit a proposal describing what you plan to do. Your mentor will review it first, and if approved, it will be sent to the assessor for final approval.
            </NotificationBody>
        </Notification>
    ),
    'withdrawn': (
        <Notification className="bg-gray-100 border-gray-500">
            <NotificationHeader className="text-gray-700 font-bold text-lg">
                🚫 Proposal Withdrawn
            </NotificationHeader>
            <NotificationBody className="text-gray-700">
                You have withdrawn your proposal. If this was a mistake, you can re-submit a new proposal for this challenge.
            </NotificationBody>
        </Notification>
    ),
    'pending mentor': (
        <Notification className="bg-blue-100 border-blue-500">
            <NotificationHeader className="text-blue-700 font-bold text-lg">
                ⏳ Pending Mentor Review
            </NotificationHeader>
            <NotificationBody className="text-blue-700">
                Your proposal is currently under review by your mentor. You will receive feedback or approval from them soon.
            </NotificationBody>
        </Notification>
    ),
    'pending assessor': (
        <Notification className="bg-blue-100 border-blue-500">
            <NotificationHeader className="text-blue-700 font-bold text-lg">
                ⏳ Pending Assessor Review
            </NotificationHeader>
            <NotificationBody className="text-blue-700">
                Your proposal has been approved by your mentor and is now pending review by the assessor. You will receive feedback or approval from them soon.
            </NotificationBody>
        </Notification>
    ),
    'rejected mentor': (
        <Notification className="bg-red-100 border-red-500">
            <NotificationHeader className="text-red-700 font-bold text-lg">
                ❌ Rejected by Mentor
            </NotificationHeader>
            <NotificationBody className="text-red-700">
                Your proposal has been rejected by your mentor. Please review their feedback and submit a new proposal for this challenge.
            </NotificationBody>
        </Notification>
    ),
    'rejected assessor': (
        <Notification className="bg-red-100 border-red-500">
            <NotificationHeader className="text-red-700 font-bold text-lg">
                ❌ Rejected by Assessor
            </NotificationHeader>
            <NotificationBody className="text-red-700">
                Your proposal has been rejected by the assessor. Please review their feedback and submit a new proposal for this challenge.
            </NotificationBody>
        </Notification>
    ),
    'completed': (
        <Notification className="bg-green-100 border-green-500">
            <NotificationHeader className="text-green-700 font-bold text-lg">
                ✅ Proposal Approved
            </NotificationHeader>
            <NotificationBody className="text-green-700">
                Congratulations! Your proposal has been approved. You can now start logging activities for this challenge and work towards completing it.
            </NotificationBody>
        </Notification>
    ),
}
export function Comments({proposal}: {proposal: Proposal}) {
    return (
        <>
            {generateFeedbackNotifications(proposal)}
        </>
    )
}
export function Instructions({state}: {state: SubmissionState}) {
    return InstructionDictionary[state]
}
// const rejectedClasses: Record<Exclude<SubmissionState, 'not started' | 'pending mentor'>, string> = {
//     'rejected mentor': 'bg-red-100 border-red-500 text-red-700',
//     'rejected assessor': 'bg-red-100 border-red-500 text-red-700',
//     'pending assessor': 'bg-green-100 border-green-500 text-green-700',
//     'completed': 'bg-green-100 border-green-500 text-green-700',
//     'withdrawn': 'bg-gray-100 border-gray-500 text-gray-700',
// }
export const positiveClass = "bg-green-100 border-green-500 text-green-700"
export const negativeClass = "bg-red-100 border-red-500 text-red-700"
function generateFeedbackNotifications(proposal: Proposal) {
    const comments: ReactNode[] = [];
    if (proposal.status === "pending mentor" || proposal.status === "not started") {
        return comments
    }
    if (proposal.accepted === null) {
        if (proposal.mentorNote) {
            comments.push(
                <FeedbackNotification key="mentorFeedback" feedback={proposal.mentorNote} title={"Mentor"} className={positiveClass} />
            )
        }
    }
    if (proposal.accepted === false) {
        // If the proposal was rejected by the assessor, then the mentor feedback was positive
        if (proposal.status === 'rejected assessor' && proposal.mentorNote) {
            comments.push(
                <FeedbackNotification key="mentorFeedback" feedback={proposal.mentorNote} title={"Mentor"} className={positiveClass} />
            )
        }
        // However the assessor feedback was negative
        if (proposal.status === 'rejected assessor' && proposal.assessorNote) {
            comments.push(
                <FeedbackNotification key="assessorFeedback" feedback={proposal.assessorNote} title={"Assessor"} className={negativeClass} />
            )
        }
    }
    if (proposal.accepted === true) {
        if (proposal.mentorNote) {
            comments.push(
                <FeedbackNotification key="mentorFeedback" feedback={proposal.mentorNote} title={"Mentor"} className={positiveClass} />
            )
        }
        if (proposal.assessorNote) {
            comments.push(
                <FeedbackNotification key="assessorFeedback" feedback={proposal.assessorNote} title={"Assessor"} className={positiveClass} />
            )
        }
    } 
    return comments;
}
function FeedbackNotification({feedback, title, ...props}: {feedback: string, title?: string} & HTMLAttributes<HTMLDivElement>) {
    return (
        <Notification {...props}>
            <NotificationHeader className="font-bold text-lg">
                📝 Feedback from {title || "Mentor"}
            </NotificationHeader>
            <NotificationBody>
                {feedback}
            </NotificationBody>
        </Notification>
    )
}