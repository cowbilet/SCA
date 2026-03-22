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
    const isGivingFeedback =
        (isMentor && proposal.status === 'pending mentor') ||
        (!isMentor && proposal.status === 'pending assessor')
    return (
        <div className="flex flex-row gap-4 max-lg:flex-col">
            <Card className="flex-1">
                <Feedback data={proposal} />
                <ProposalForm
                    values={proposal}
                    disabled={true}
                    award={proposal.award}
                    challenge={proposal.challenge}
                />
            </Card>
            {isGivingFeedback && (
                <Card className="flex-1">
                    <ProposalFeedbackForm />
                </Card>
            )}
        </div>
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
