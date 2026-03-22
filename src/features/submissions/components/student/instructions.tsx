import type { SubmissionState } from '@/types/awards'
import {
    Notification,
    NotificationBody,
    NotificationHeader,
} from '@/components/notification'

export function Instructions({ state }: { state: SubmissionState }) {
    switch (state) {
        case 'not started':
            return (
                <Notification className="bg-yellow-100">
                    <NotificationHeader className="text-yellow-700 font-bold text-lg">
                        📋 Step 1: Create Activities
                    </NotificationHeader>
                    <NotificationBody className="text-yellow-700">
                        Before you can submit your activity, you need to create
                        at least one activity log describing what you plan to
                        do. This will help your mentor and assessor understand
                        your plan and provide better feedback.
                    </NotificationBody>
                </Notification>
            )
        case 'withdrawn':
            return (
                <Notification className="bg-gray-100">
                    <NotificationHeader className="text-gray-700 font-bold text-lg">
                        🚫 Submission Withdrawn
                    </NotificationHeader>
                    <NotificationBody className="text-gray-700">
                        You have withdrawn your submission. If this was a
                        mistake, you can re-submit a new submission for this
                        challenge.
                    </NotificationBody>
                </Notification>
            )
        case 'pending mentor':
            return (
                <Notification className="bg-blue-100">
                    <NotificationHeader className="text-blue-700 font-bold text-lg">
                        ⏳ Pending Mentor Review
                    </NotificationHeader>
                    <NotificationBody className="text-blue-700">
                        Your submission is currently under review by your
                        mentor. You will receive feedback or approval from them
                        soon.
                    </NotificationBody>
                </Notification>
            )
        case 'pending assessor':
            return (
                <Notification className="bg-blue-100">
                    <NotificationHeader className="text-blue-700 font-bold text-lg">
                        ⏳ Pending Assessor Review
                    </NotificationHeader>
                    <NotificationBody className="text-blue-700">
                        Your submission has been approved by your mentor and is
                        now pending review by the assessor. You will receive
                        feedback or approval from them soon.
                    </NotificationBody>
                </Notification>
            )
        case 'rejected mentor':
            return (
                <Notification className="bg-red-100">
                    <NotificationHeader className="text-red-700 font-bold text-lg">
                        ❌ Rejected by Mentor
                    </NotificationHeader>
                    <NotificationBody className="text-red-700">
                        Your submission has been rejected by your mentor. Please
                        review their feedback and submit a new submission for
                        this challenge.
                    </NotificationBody>
                </Notification>
            )
        case 'rejected assessor':
            return (
                <Notification className="bg-red-100">
                    <NotificationHeader className="text-red-700 font-bold text-lg">
                        ❌ Rejected by Assessor
                    </NotificationHeader>
                    <NotificationBody className="text-red-700">
                        Your submission has been rejected by the assessor.
                        Please review their feedback and submit a new submission
                        for this challenge.
                    </NotificationBody>
                </Notification>
            )
        case 'completed':
            return (
                <Notification className="bg-green-100">
                    <NotificationHeader className="text-green-700 font-bold text-lg">
                        ✅ Submission Approved
                    </NotificationHeader>
                    <NotificationBody className="text-green-700">
                        Congratulations! Your submission has been approved. You
                        have now completed this challenge. You can still view
                        your activity logs and feedback from your mentor and
                        assessor below.
                    </NotificationBody>
                </Notification>
            )
    }
}
