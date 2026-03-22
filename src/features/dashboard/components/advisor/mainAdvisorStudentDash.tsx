import { useParams } from "@tanstack/react-router"
import Skeleton from "react-loading-skeleton"
import ReviewProposal from "@/features/proposals/components/advisorProposal.tsx/reviewProposal"
import ReviewActivity from "@/features/submissions/components/advisor/reviewActivity"
import { useChallenge } from "@/hooks/useChallenge"

export default function MainAdvisorStudentDash() {
    const { studentId, award, challenge } = useParams({ from: "/$advisor/$studentId/$award/$challenge", strict: true })
    const { data: challengeData, isLoading, isError } = useChallenge(award, challenge, studentId)
    if (isLoading) {
        return <div className="space-y-4">
            <Skeleton count={3} />
        </div>
    }
    if (isError || !challengeData) {
        return <div>Error loading challenge data. Please try again later.</div>
    }
    // If the proposal has not been accepted yet let them review the proposal
    if (challengeData.proposals && challengeData.proposals.accepted !== true) {
        return <ReviewProposal />;
    }
    else {
        switch (challengeData.student_challenge.status) {
            case 'completed':
                return <p>Challenge completed! No further action is needed.</p>
            default:
                return <ReviewActivity />;
        }
    }
}