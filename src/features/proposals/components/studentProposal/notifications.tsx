import { SubmissionState } from '@/types/awards'
import type { Proposal } from '@/types/proposal'
import { Notification, NotificationHeader, NotificationBody } from '@/components/notification'
const Instructions: Record<SubmissionState, React.ReactNode> = {
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
export default function Notifications({proposal, state}: {proposal?: Proposal, state: SubmissionState}) {
    return (
        <>
            {Instructions[state]}
            {proposal && state !== 'not started' && state !== 'pending mentor' && generateFeedbackNotifications(proposal, state)}
        </>
    )
}
const rejectedClasses: Record<Exclude<SubmissionState, 'not started' | 'pending mentor'>, {card: string, text: string}> = {
    'rejected mentor': {card: 'bg-red-100 border-red-500', text: 'text-red-700'},
    'rejected assessor': {card: 'bg-red-100 border-red-500', text: 'text-red-700'},
    'pending assessor': {card: 'bg-green-100 border-green-500', text: 'text-green-700'},
    'completed': {card: 'bg-green-100 border-green-500', text: 'text-green-700'},
    'withdrawn': {card: 'bg-gray-100 border-gray-500', text: 'text-gray-700'},
}
function generateFeedbackNotifications(proposal: Proposal, state: Exclude<SubmissionState, 'not started' | 'pending mentor'>) {
    const notifications = []
    if (proposal.mentorNote) {
        // TODO: This is hacky
        let newState: SubmissionState = state
        if (state === 'rejected assessor' && proposal.accepted === false) {
            newState = 'pending assessor'
        }
        notifications.push(
            <Notification key="mentorFeedback" className={rejectedClasses[newState || state].card}>
                <NotificationHeader className={rejectedClasses[newState || state].text + " font-bold text-lg"}>
                    📝 Mentor Feedback
                </NotificationHeader>
                <NotificationBody className={rejectedClasses[newState || state].text}>
                    {proposal.mentorNote}
                </NotificationBody>
            </Notification>
        )
    }
    if (proposal.assessorNote) {
        notifications.push(
            <Notification key="assessorFeedback" className={rejectedClasses[state].card}>
                <NotificationHeader className={rejectedClasses[state].text + " font-bold text-lg"}>
                    📝 Assessor Feedback
                </NotificationHeader>
                <NotificationBody className={rejectedClasses[state].text}>
                    {proposal.assessorNote}
                </NotificationBody>
            </Notification>
        )
    }
    return notifications
}