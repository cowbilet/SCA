import { useParams } from '@tanstack/react-router'
import ProposalForm from '../proposalForm'
import { useReviewProposal } from '../../hooks/useReviewProposal'
import { useProposal } from '../../hooks/useProposal'
import FeedbackForm from '@/components/advisors/feedbackForm'

import Feedback from '@/components/feedback'
import { Card } from '@/components/card'

export default function ReviewProposal() {
    const { advisor, studentId, award, challenge } = useParams({
        from: '/$advisor/$studentId/$award/$challenge',
        strict: true,
    })
    const {
        data: proposal,
        isError,
        isLoading,
    } = useProposal(award, challenge, studentId)

    const isMentor = advisor === 'mentor'
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError || !proposal) {
        return <div>Error loading proposal. Please try again later.</div>
    }
    return (
        <Card className="h-full flex flex-col flex-1 gap-4">
            {/* TODO: Should show instructions for the advisors */}
            <Feedback data={proposal} />
            <ProposalForm
                values={proposal}
                disabled={true}
                award={proposal.award}
                challenge={proposal.challenge}
            />
            {isMentor && proposal.status === 'pending mentor' && (
                <ProposalFeedbackForm />
            )}
            {!isMentor && proposal.status === 'pending assessor' && (
                <ProposalFeedbackForm />
            )}
        </Card>
    )
}
function ProposalFeedbackForm() {
    const { award, challenge, studentId } = useParams({
        from: '/$advisor/$studentId/$award/$challenge',
        strict: true,
    })
    const { mutateAsync: submitProposal } = useReviewProposal(
        studentId,
        award,
        challenge,
    )
    const onValidSubmit = async (data: {
        feedback: string
        accepted: boolean
    }) => {
        await submitProposal({ notes: data.feedback, accepted: data.accepted })
    }
    return <FeedbackForm onValidSubmit={onValidSubmit} />
}
