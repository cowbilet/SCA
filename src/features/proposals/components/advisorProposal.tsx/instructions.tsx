import type { SubmissionState } from '@/types/awards'
import Instructions from '@/components/instructions'

type AdvisorRole = 'mentor' | 'assessor'

export default function AdvisorProposalInstructions({
    state,
    advisor,
}: {
    state: SubmissionState
    advisor: AdvisorRole
}) {
    switch (state) {
        case 'not started':
            return (
                <Instructions
                    title="📝 Proposal Not Submitted"
                    description="The student has not submitted a proposal yet. Once submitted, it will appear here for review."
                    className="bg-gray-100 text-gray-700"
                />
            )
        case 'withdrawn':
            return (
                <Instructions
                    title="🚫 Proposal Withdrawn"
                    description="The student withdrew this proposal. No action is required."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'pending mentor':
            if (advisor === 'mentor') {
                return (
                    <Instructions
                        title="⏳ Your Review Required"
                        description="This proposal is waiting for your review. Please read it and provide feedback, then approve or reject."
                        className="bg-blue-100 text-blue-700"
                    />
                )
            }
            return (
                <Instructions
                    title="⏳ Pending Mentor Review"
                    description="This proposal is currently with the mentor. You will review it after mentor approval."
                    className="bg-amber-100 text-amber-700"
                />
            )
        case 'pending assessor':
            if (advisor === 'assessor') {
                return (
                    <Instructions
                        title="⏳ Your Review Required"
                        description="The mentor approved this proposal. Please provide your final assessor review and decision."
                        className="bg-blue-100 text-blue-700"
                    />
                )
            }
            return (
                <Instructions
                    title="✅ Mentor Approved"
                    description="You approved this proposal as mentor. It is now waiting for assessor review."
                    className="bg-green-100 text-green-700"
                />
            )
        case 'rejected mentor':
            return (
                <Instructions
                    title="❌ Rejected by Mentor"
                    description="The proposal was rejected by the mentor. The student can revise and submit a new proposal."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'rejected assessor':
            return (
                <Instructions
                    title="❌ Rejected by Assessor"
                    description="The proposal was rejected by the assessor. The student can revise and submit a new proposal."
                    className="bg-red-100 text-red-700"
                />
            )
        case 'completed':
            return (
                <Instructions
                    title="✅ Proposal Approved"
                    description="This proposal has been approved by both mentor and assessor."
                    className="bg-green-100 text-green-700"
                />
            )
        default:
            return null
    }
}
