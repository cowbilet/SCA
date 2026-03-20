import type { Proposal } from '@/types/schemas/proposal'
import type { SubmissionState } from '@/types/awards'
import { Notification, NotificationBody, NotificationHeader } from '@/components/notification'
import Feedback from '@/components/feedback'


export function Comments({proposal}: {proposal: Proposal}) {
    return (
        <>
            <Feedback status={proposal.status} mentorNote={proposal.mentorNote} assessorNote={proposal.assessorNote} />
            <Instructions state={proposal.status} />
        </>
    )
}
export function Instructions({state}: {state: SubmissionState}) {
    switch (state) {
        case 'not started':
            return (
                <Notification className="bg-yellow-100 border-yellow-500">
                    <NotificationHeader className="text-yellow-700 font-bold text-lg">
                        📋 Step 1: Submit Logs
                    </NotificationHeader>
                    <NotificationBody className="text-yellow-700">
                            Now that your proposal has been approved, you can start logging activities for this challenge. Make sure to provide detailed descriptions and evidence for each activity you log to help your mentor and assessor understand your progress.
                    </NotificationBody>
                </Notification>
            )
        case 'pending mentor':
            return (
                <Notification className="bg-blue-100 border-blue-500">
                    <NotificationHeader className="text-blue-700 font-bold text-lg">
                        ⏳ Pending Mentor Review
                    </NotificationHeader>
                    <NotificationBody className="text-blue-700">
                        Your submission is currently under review by your mentor. You will receive feedback or approval from them soon.
                    </NotificationBody>
                </Notification>
            )
        case 'pending assessor':
            return (
                <Notification className="bg-blue-100 border-blue-500">
                    <NotificationHeader className="text-blue-700 font-bold text-lg">
                        ⏳ Pending Assessor Review
                    </NotificationHeader>
                    <NotificationBody className="text-blue-700">
                        Your submission has been approved by your mentor and is now pending review by the assessor. You will receive feedback or approval from them soon.
                    </NotificationBody>
                </Notification>
            )
        case 'rejected mentor':
            return (
                <Notification className="bg-red-100 border-red-500">
                    <NotificationHeader className="text-red-700 font-bold text-lg">
                        ❌ Rejected by Mentor
                    </NotificationHeader>
                    <NotificationBody className="text-red-700">
                        Your submission has been rejected by your mentor. Please review their feedback and submit a new submission for this challenge.
                    </NotificationBody>
                </Notification>
            )
        case 'rejected assessor':
            return (
                <Notification className="bg-red-100 border-red-500">
                    <NotificationHeader className="text-red-700 font-bold text-lg">
                        ❌ Rejected by Assessor
                    </NotificationHeader>
                    <NotificationBody className="text-red-700">
                        Your submission has been rejected by the assessor. Please review their feedback and submit a new submission for this challenge.
                    </NotificationBody>
                </Notification>
            )
        case 'completed':
            return (
                <Notification className="bg-green-100 border-green-500">
                    <NotificationHeader className="text-green-700 font-bold text-lg">
                        ✅ Submission Approved
                    </NotificationHeader>
                    <NotificationBody className="text-green-700">
                        Congratulations! Your submission has been approved and this challenge is now complete. You can view your completed challenge in your profile and share your achievement with others.
                    </NotificationBody>
                </Notification>
            )
    }
}
