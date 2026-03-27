import { useParams } from '@tanstack/react-router'
import Skeleton from 'react-loading-skeleton'
import { useSession } from '@/integrations/better-auth/authClient'
import ReviewProposal from '@/features/proposals/components/advisorProposal.tsx/reviewProposal'
import { useChallenge } from '@/hooks/useChallenge'
import { useProposal } from '@/features/proposals/hooks/useProposal'
import { AdvisorLogEntries } from '@/features/logs/components/advisors/advisorLogs'
import {
    StandardActivityLogs,
    SubmittedActivityLogs,
} from '@/features/logs/components/activityLogs'
import InstructionAndFeedback from '@/components/feedback'
import StudentReflection from '@/features/submissions/components/reflection'
import SubmissionFeedback from '@/features/submissions/components/advisor/submissionFeedback'
import AdvisorProposalInstructions from '@/features/proposals/components/advisorProposal.tsx/instructions'
import AdvisorSubmissionInstructions from '@/features/submissions/components/advisor/instructions'

export default function MainAdvisorStudentDash() {
    const { studentId, award, challenge, advisor } = useParams({
        from: '/$advisor/$studentId/$award/$challenge',
        strict: true,
    })
    const { data: session } = useSession()
    const {
        data: challengeData,
        isLoading: isChallengeLoading,
        isError: isChallengeError,
    } = useChallenge(award, challenge, studentId)
    const {
        data: proposalData,
        isLoading: isProposalLoading,
        isError: isProposalError,
    } = useProposal(award, challenge, studentId)

    if (isChallengeLoading || isProposalLoading) {
        return (
            <div className="h-full flex flex-col gap-4">
                <Skeleton count={3} />
            </div>
        )
    }
    if (isChallengeError || isProposalError || !challengeData) {
        return <div>Error loading challenge data. Please try again later.</div>
    }
    // If the proposal has not been accepted yet let them review the proposal
    if (proposalData && proposalData.accepted !== true) {
        return (
            <div className="h-full flex flex-col flex-1 gap-4">
                <InstructionAndFeedback
                    data={proposalData}
                    Instructions={({ status }) => (
                        <AdvisorProposalInstructions
                            advisor={advisor}
                            state={status}
                            assessorState={session?.user.state}
                        />
                    )}
                />
                <ReviewProposal />
            </div>
        )
    } else {
        switch (challengeData.status) {
            case 'not started':
            case 'rejected state assessor':
            case 'rejected national assessor':
            case 'rejected mentor':
                return (
                    <div className="h-full flex flex-col flex-1 gap-4">
                        <InstructionAndFeedback
                            Instructions={({ status }) => (
                                <AdvisorSubmissionInstructions
                                    state={status}
                                    advisor={advisor}
                                    assessorState={session?.user.state}
                                />
                            )}
                            data={challengeData}
                        />
                        <StandardActivityLogs
                            LogEntryComponent={AdvisorLogEntries}
                        />
                    </div>
                )
            default:
                return (
                    <div className="h-full flex flex-col flex-1 gap-4">
                        <InstructionAndFeedback
                            Instructions={({ status }) => (
                                <AdvisorSubmissionInstructions
                                    state={status}
                                    advisor={advisor}
                                    assessorState={session?.user.state}
                                />
                            )}
                            data={challengeData}
                        />
                        <div className="flex flex-col flex-1 gap-4">
                            <div className="flex flex-row max-lg:flex-col h-full gap-4">
                                <SubmittedActivityLogs
                                    LogEntryComponent={AdvisorLogEntries}
                                />
                                <div className="flex-1 flex flex-col gap-4">
                                    <StudentReflection
                                        reflection={challengeData.reflection}
                                    />
                                    <SubmissionFeedback
                                        challengeData={challengeData}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
        }
    }
}
