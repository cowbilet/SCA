import { useParams } from '@tanstack/react-router'
import Skeleton from 'react-loading-skeleton'
import { useChallenge } from '@/hooks/useChallenge'
import { useProposal } from '@/features/proposals/hooks/useProposal'
import { Route } from '@/routes/student/$award/$challenge'
import {
    ActiveProposal,
    SubmitProposal,
} from '@/features/proposals/components/studentProposal/proposal'
import { StudentSubmission } from '@/features/submissions/components/student/submitChallenge'
import { CreateActivity } from '@/features/logs/components/students/activityModals/createActivity'
import StudentSubmissionInstructions from '@/features/submissions/components/student/instructions'
import {
    StandardActivityLogs,
    SubmittedActivityLogs,
} from '@/features/logs/components/activityLogs'
import { StudentLogEntries } from '@/features/logs/components/students/studentActivityLogs'
import InstructionAndFeedback from '@/components/feedback'
import StudentProposalInstructions from '@/features/proposals/components/studentProposal/instructions'
import StudentReflection from '@/features/submissions/components/reflection'

export default function Main() {
    const { user } = Route.useRouteContext()
    const { award, challenge } = useParams({
        from: '/student/$award/$challenge',
        strict: true,
    })
    const {
        data: challengeData,
        isLoading: isChallengeLoading,
        isError: isChallengeError,
    } = useChallenge(award, challenge, user.userId)
    const {
        data: proposalData,
        isLoading: isProposalLoading,
        isError: isProposalError,
    } = useProposal(award, challenge, user.userId)

    if (isChallengeLoading || isProposalLoading) {
        return (
            <div className="h-full flex flex-col gap-4">
                <Skeleton count={3} />
            </div>
        )
    }
    if (isChallengeError || isProposalError) {
        return <div>Error loading challenge data. Please try again later.</div>
    }
    // If there is no proposal data this means that the user has not started yet
    // Technically we should be getting the challenge data, however I do not want to deal with the state management of optimistically creating that
    if (!proposalData) {
        return <SubmitProposal />
    }

    if (proposalData.accepted !== true) {
        switch (proposalData.status) {
            case 'not started':
                return (
                    <div className="h-full flex flex-col gap-4">
                        <InstructionAndFeedback
                            data={proposalData}
                            Instructions={({ status }) => (
                                <StudentProposalInstructions state={status} />
                            )}
                        />
                        <SubmitProposal />
                    </div>
                )
            case 'withdrawn':
            case 'pending mentor':
            case 'pending state assessor':
            case 'pending national assessor':
            case 'rejected mentor':
            case 'rejected state assessor':
            case 'rejected national assessor':
                return (
                    <div className="h-full flex flex-col gap-4">
                        <InstructionAndFeedback
                            data={proposalData}
                            Instructions={({ status }) => (
                                <StudentProposalInstructions state={status} />
                            )}
                        />
                        <ActiveProposal proposalStatus={proposalData.status} />
                    </div>
                )
            default:
                break
        }
    }
    if (!challengeData) {
        return <div>Error loading challenge data. Please try again later.</div>
    }
    if (proposalData.accepted === true) {
        switch (challengeData.status) {
            case 'not started':
            case 'rejected mentor':
            case 'rejected state assessor':
            case 'rejected national assessor':
                return (
                    <div className="h-full flex flex-col gap-4">
                        <div className="flex flex-row items-center justify-start gap-4">
                            <CreateActivity />
                            <StudentSubmission />
                        </div>
                        <InstructionAndFeedback
                            data={challengeData}
                            Instructions={({ status }) => (
                                <StudentSubmissionInstructions state={status} />
                            )}
                        />
                        <StandardActivityLogs
                            LogEntryComponent={StudentLogEntries}
                        />
                    </div>
                )
            case 'pending mentor':
            case 'pending state assessor':
            case 'pending national assessor':
                return (
                    <div className="h-full flex flex-col gap-4">
                        <InstructionAndFeedback
                            data={challengeData}
                            Instructions={({ status }) => (
                                <StudentSubmissionInstructions state={status} />
                            )}
                        />
                        <div className="flex flex-col flex-1 gap-4">
                            <div className="flex flex-row max-lg:flex-col h-full gap-4">
                                <SubmittedActivityLogs
                                    LogEntryComponent={StudentLogEntries}
                                />
                                <div className="flex-1 flex flex-col gap-4">
                                    <StudentReflection
                                        reflection={challengeData.reflection}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 'completed':
                return (
                    <div className="h-full flex flex-col gap-4">
                        <InstructionAndFeedback
                            data={challengeData}
                            Instructions={({ status }) => (
                                <StudentSubmissionInstructions state={status} />
                            )}
                        />
                        <div className="flex flex-row flex-1 gap-4">
                            <SubmittedActivityLogs
                                LogEntryComponent={StudentLogEntries}
                            />
                            <StudentReflection
                                reflection={challengeData.reflection}
                            />
                        </div>
                    </div>
                )
        }
    }

    return <SubmitProposal />
}
