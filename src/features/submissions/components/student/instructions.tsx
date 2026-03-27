import type { SubmissionState } from '@/types/awards'

import Instructions from '@/components/instructions'

export default function StudentSubmissionInstructions({
    state,
}: {
    state: SubmissionState
}) {
    switch (state) {
        case 'not started':
            return (
                <Instructions
                    title="📋 Step 1: Create Activities"
                    description="Before you can submit your activity, you need to create at least one activity log describing what you plan to do. This will help your mentor and assessor understand your plan and provide better feedback."
                    className="bg-yellow-100 text-yellow-700"
                />
            )
        case 'withdrawn':
            return (
                <Instructions
                    title="🚫 Submission Withdrawn"
                    description="You have withdrawn your submission. If this was a mistake, you can re-submit a new submission for this challenge."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'pending mentor':
            return (
                <Instructions
                    title="⏳ Pending Mentor Review"
                    description="Your submission is currently under review by your mentor. You will receive feedback or approval from them soon."
                    className="bg-blue-100 text-blue-700"
                />
            )
        case 'pending assessor':
            return (
                <Instructions
                    title="⏳ Pending Assessor Review"
                    description="Your submission has been approved by your mentor and is now pending review by the assessor. You will receive feedback or approval from them soon."
                    className="bg-blue-100 text-blue-700"
                />
            )
        case 'rejected mentor':
            return (
                <Instructions
                    title="❌ Rejected by Mentor"
                    description="Your submission has been rejected by your mentor. Please review their feedback and submit a new submission for this challenge."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'rejected assessor':
            return (
                <Instructions
                    title="❌ Rejected by Assessor"
                    description="Your submission has been rejected by the assessor. Please review their feedback and submit a new submission for this challenge."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'completed':
            return (
                <Instructions
                    title="✅ Submission Approved"
                    description="Congratulations! Your submission has been approved. You have now completed this challenge. You can still view your activity logs and feedback from your mentor and assessor below."
                    className="bg-green-100 text-green-700"
                />
            )
        default:
            return null
    }
}
