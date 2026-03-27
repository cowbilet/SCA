import type { SubmissionState } from '@/types/awards'
import Instructions from '@/components/instructions'

type AdvisorRole = 'mentor' | 'assessor'

export default function AdvisorSubmissionInstructions({
    state,
    advisor,
    assessorState,
}: {
    state: SubmissionState
    advisor: AdvisorRole
    assessorState?: string
}) {
    const isNationalAssessor = assessorState === 'NAT'
    switch (state) {
        case 'not started':
            return (
                <Instructions
                    title="📊 Review Activity Logs"
                    description="The student has not yet submitted activities for review. You can view their submitted activity logs below and provide feedback as needed."
                    className="bg-gray-100 text-gray-700"
                />
            )
        case 'withdrawn':
            return (
                <Instructions
                    title="🚫 Submission Withdrawn"
                    description="The student has withdrawn their submission. No action is needed at this time."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'pending mentor':
            if (advisor === 'mentor') {
                return (
                    <Instructions
                        title="⏳ Your Review Required"
                        description="This submission is waiting for your review. Please review the student's activity logs and provide feedback below. You can approve or reject the submission."
                        className="bg-blue-100 text-blue-700"
                    />
                )
            }
            return (
                <Instructions
                    title="⏳ Pending Mentor Review"
                    description="This submission is currently under review by the mentor. Once they provide feedback, it will be sent to you for final assessment."
                    className="bg-amber-100 text-amber-700"
                />
            )
        case 'pending state assessor':
            if (advisor === 'assessor' && !isNationalAssessor) {
                return (
                    <Instructions
                        title="⏳ Your Review Required"
                        description="The mentor has approved this submission. Please review and make your state assessor decision."
                        className="bg-blue-100 text-blue-700"
                    />
                )
            }
            return (
                <Instructions
                    title="✅ Approved - Awaiting State Assessor"
                    description="You have approved this submission. It is now waiting for state assessor review."
                    className="bg-green-100 text-green-700"
                />
            )
        case 'pending national assessor':
            if (advisor === 'assessor' && isNationalAssessor) {
                return (
                    <Instructions
                        title="⏳ Your Final Review Required"
                        description="The state assessor has approved this submission. As a national assessor, please review and make your final decision. This approval will complete the submission review process."
                        className="bg-blue-100 text-blue-700"
                    />
                )
            }
            return (
                <Instructions
                    title="✅ Approved - Awaiting National Assessor"
                    description="This submission is now awaiting final review from the national assessor."
                    className="bg-green-100 text-green-700"
                />
            )
        case 'rejected mentor':
            return (
                <Instructions
                    title="❌ Rejected by Mentor"
                    description="The mentor has rejected this submission. The student has been notified and can submit a new submission with improvements."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'rejected state assessor':
            return (
                <Instructions
                    title="❌ Rejected by State Assessor"
                    description="The state assessor has rejected this submission. The student can submit a revised attempt."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'rejected national assessor':
            return (
                <Instructions
                    title="❌ Rejected by National Assessor"
                    description="The national assessor has rejected this submission. The student can submit a revised attempt."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'completed':
            return (
                <Instructions
                    title="✅ Submission Approved"
                    description="This submission has been fully approved. The challenge is now complete."
                    className="bg-green-100 text-green-700"
                />
            )
        default:
            return null
    }
}
