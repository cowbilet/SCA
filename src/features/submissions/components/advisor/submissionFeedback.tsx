import { Clock } from "lucide-react"
import { useLocation, useParams } from "@tanstack/react-router"
import { useReviewSubmission } from "../../hooks/useReviewSubmission"
import type { StudentChallengeWithProposalAndSubmission } from "@/types/schemas/challenges"
import FeedbackForm from "@/components/advisors/feedbackForm"
import { Card, CardBody, CardHeader } from "@/components/card"

export default function SubmissionFeedback({challengeData}: {challengeData: StudentChallengeWithProposalAndSubmission}) {
    const location = useLocation()
    const { award, challenge, studentId } = useParams({from: "/$advisor/$studentId/$award/$challenge", strict: true})
    const {mutate: reviewSubmission, isPending, isError } = useReviewSubmission(
        studentId,
        award,
        challenge,
    )
    const isGivingFeedback =
        (location.pathname.includes('mentor') &&
            challengeData.student_challenge.status === 'pending mentor') ||
        (location.pathname.includes('assessor') &&
            challengeData.student_challenge.status === 'pending assessor')
    if (!isGivingFeedback) {
        return null
    }
    const onValidSubmit = async ({
        feedback,
        accepted,
    }: {
        feedback: string
        accepted: boolean
    }) => {
        await reviewSubmission({
            notes: feedback,
            accepted,
        })
    }
    return (
        <Card className="p-0! h-fit">
            <CardHeader variant="info">
                <Clock className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-block flex flex-row items-center gap-2">
                    Feedback
                </h2>
            </CardHeader>
            <CardBody>
                <FeedbackForm
                    onValidSubmit={onValidSubmit}
                    isLoading={isPending}
                    isError={isError}
                />
            </CardBody>
        </Card>
    )
}