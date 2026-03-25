import { useParams } from '@tanstack/react-router'
import Skeleton from 'react-loading-skeleton'
import ReviewProposal from '@/features/proposals/components/advisorProposal.tsx/reviewProposal'
import { useChallenge } from '@/hooks/useChallenge'
import { AdvisorLogEntries } from '@/features/logs/components/advisors/advisorLogs'
import {
    StandardActivityLogs,
    SubmittedActivityLogs,
} from '@/features/logs/components/activityLogs'
import InstructionAndFeedback from '@/components/feedback'
import StudentReflection from '@/features/submissions/components/reflection'
import FeedbackForm from '@/components/advisors/feedbackForm'
import SubmissionFeedback from '@/features/submissions/components/advisor/submissionFeedback'

export default function MainAdvisorStudentDash() {
    const { studentId, award, challenge } = useParams({
        from: '/$advisor/$studentId/$award/$challenge',
        strict: true,
    })
    const {
        data: challengeData,
        isLoading,
        isError,
    } = useChallenge(award, challenge, studentId)
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton count={3} />
            </div>
        )
    }
    if (isError || !challengeData) {
        return <div>Error loading challenge data. Please try again later.</div>
    }
    // If the proposal has not been accepted yet let them review the proposal
    if (challengeData.proposals && challengeData.proposals.accepted !== true) {
        return <ReviewProposal />
    } else {
        switch (challengeData.student_challenge.status) {
            case 'completed':
                return <p>Challenge completed! No further action is needed.</p>
            case 'not started':
            case 'rejected assessor':
            case 'rejected mentor':
                return (
                    <div className="space-y-4">
                        <InstructionAndFeedback 
                            Instructions={(status) => null}
                            data={challengeData.student_challenge} 
                        />
                        <StandardActivityLogs
                            LogEntryComponent={AdvisorLogEntries}
                        />
                    </div>
                )
            default:
                return (
                    <div className="space-y-4">
                        <InstructionAndFeedback 
                            Instructions={(status) => null}
                            data={challengeData.student_challenge} 
                        />
                        <div className="flex flex-col flex-1 gap-4">
                            <div className="flex flex-row max-lg:flex-col h-full gap-4">
                                <SubmittedActivityLogs
                                    challengeData={challengeData}
                                    LogEntryComponent={AdvisorLogEntries}
                                />
                                <div className="flex-1 flex flex-col gap-4">
                                    <StudentReflection reflection={challengeData.student_challenge.reflection} />
                                    <SubmissionFeedback challengeData={challengeData} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
        }
    }
}

