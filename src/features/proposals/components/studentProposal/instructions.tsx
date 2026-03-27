import type { SubmissionState } from '@/types/awards'
import Instructions from '@/components/instructions'

export default function StudentProposalInstructions({
    state,
}: {
    state: SubmissionState
}) {
    switch (state) {
        case 'not started':
            return (
                <Instructions
                    title="📋 Step 1: Submit Proposal"
                    description="Before you can start logging activities, you need to submit a proposal describing what you plan to do. Your mentor will review it first, and if approved, it will be sent to the assessor for final approval."
                    className="bg-yellow-100 text-yellow-700"
                />
            )
        case 'withdrawn':
            return (
                <Instructions
                    title="🚫 Proposal Withdrawn"
                    description="You have withdrawn your proposal. If this was a mistake, you can re-submit a new proposal for this challenge."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'pending mentor':
            return (
                <Instructions
                    title="⏳ Pending Mentor Review"
                    description="Your proposal is currently under review by your mentor. You will receive feedback or approval from them soon."
                    className="bg-blue-100 text-blue-700"
                />
            )
        case 'pending state assessor':
            return (
                <Instructions
                    title="⏳ Pending State Assessor Review"
                    description="Your proposal has been approved by your mentor and is now pending review by your state assessor."
                    className="bg-blue-100 text-blue-700"
                />
            )
        case 'pending national assessor':
            return (
                <Instructions
                    title="⏳ Pending National Assessor Review"
                    description="Your state assessor approved this proposal. It is now awaiting national assessor review."
                    className="bg-blue-100 text-blue-700"
                />
            )
        case 'rejected mentor':
            return (
                <Instructions
                    title="❌ Rejected by Mentor"
                    description="Your proposal has been rejected by your mentor. Please review their feedback and submit a new proposal for this challenge."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'rejected state assessor':
            return (
                <Instructions
                    title="❌ Rejected by State Assessor"
                    description="Your proposal has been rejected by your state assessor. Please review their feedback and submit a new proposal for this challenge."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'rejected national assessor':
            return (
                <Instructions
                    title="❌ Rejected by National Assessor"
                    description="Your proposal has been rejected by the national assessor. Please review their feedback and submit a new proposal for this challenge."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'completed':
            return (
                <Instructions
                    title="✅ Proposal Approved"
                    description="Congratulations! Your proposal has been approved. You can now start logging activities for this challenge and work towards completing it."
                    className="bg-green-100 text-green-700"
                />
            )
    }
}
