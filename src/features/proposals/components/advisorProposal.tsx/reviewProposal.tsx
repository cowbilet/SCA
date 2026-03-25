import { useParams } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import ProposalForm from '../proposalForm'
import { useReviewProposal } from '../../hooks/useReviewProposal'
import { useProposal } from '../../hooks/useProposal'
import FeedbackForm from '@/components/advisors/feedbackForm'

import { Card, CardHeader } from '@/components/card'

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
            <Card className="flex-1 p-0! flex flex-col">
                <CardHeader variant="neutral">
                    <BookOpen className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-semibold">Proposal</h2>
                </CardHeader>
                <div className="p-4 flex-1">
                    <ProposalForm
                        values={proposal}
                        disabled={true}
                        award={proposal.award}
                        challenge={proposal.challenge}
                    />
                </div>
            </Card>
            {isGivingFeedback && (
                <Card className="flex-1 p-0! flex flex-col">
                    <CardHeader variant="info">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">Feedback</h2>
                    </CardHeader>
                    <div className="p-4 flex-1">
                        <ProposalFeedbackForm />
                    </div>
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
