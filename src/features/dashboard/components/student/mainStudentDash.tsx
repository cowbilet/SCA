import { useParams } from '@tanstack/react-router'
import Skeleton from 'react-loading-skeleton'
import { useChallenge } from '@/hooks/useChallenge'
import { Route } from '@/routes/student/$award/$challenge'
import {
    ActiveProposal,
    SubmitProposal,
} from '@/features/proposals/components/studentProposal/proposal'
import { StudentSubmission } from '@/features/submissions/components/student/submitChallenge'
import { CreateActivity } from '@/features/logs/components/students/activityModals/createActivity'
import { Instructions } from '@/features/submissions/components/student/instructions'
import Feedback from '@/components/feedback'
import {
    StandardActivityLogs,
    SubmittedActivityLogs,
} from '@/features/logs/components/activityLogs'
import { StudentLogEntries } from '@/features/logs/components/students/studentActivityLogs'

export default function Main() {
    const { user } = Route.useRouteContext()
    const { award, challenge } = useParams({
        from: '/student/$award/$challenge',
        strict: true,
    })
    const {
        data: challengeData,
        isLoading,
        isError,
    } = useChallenge(award, challenge, user.userId)
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton count={3} />
            </div>
        )
    }
    if (isError) {
        return <div>Error loading challenge data. Please try again later.</div>
    }
    // If there is no challenge data this means that the user has not started yet
    if (!challengeData) {
        return <SubmitProposal proposalStatus="not started" />
    }
    if (challengeData.proposals && challengeData.proposals.accepted !== true) {
        switch (challengeData.proposals.status) {
            case 'not started':
                return (
                    <SubmitProposal
                        proposalStatus={challengeData.proposals.status}
                    />
                )
            case 'withdrawn':
            case 'pending mentor':
            case 'pending assessor':
            case 'rejected mentor':
            case 'rejected assessor':
                return (
                    <ActiveProposal
                        proposalStatus={challengeData.proposals.status}
                    />
                )
            default:
                break
        }
    }
    if (challengeData.proposals && challengeData.proposals.accepted === true) {
        switch (challengeData.student_challenge.status) {
            case 'not started':
            case 'rejected mentor':
            case 'rejected assessor':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-row items-center justify-start gap-4">
                            <CreateActivity />
                            <StudentSubmission />
                        </div>
                        <Instructions
                            state={challengeData.student_challenge.status}
                        />
                        <Feedback data={challengeData.student_challenge} />
                        <StandardActivityLogs
                            LogEntryComponent={StudentLogEntries}
                        />
                    </div>
                )
            case 'pending mentor':
            case 'pending assessor':
                return (
                    <>
                        <Instructions
                            state={challengeData.student_challenge.status}
                        />
                        <Feedback data={challengeData.student_challenge} />
                        <SubmittedActivityLogs
                            challengeData={challengeData}
                            LogEntryComponent={StudentLogEntries}
                        />
                    </>
                )
            case 'completed':
                return (
                    <>
                        <p>
                            You did it! Your submission has been marked as
                            completed. You can still view your activity logs
                            below.
                        </p>
                        <SubmittedActivityLogs
                            challengeData={challengeData}
                            LogEntryComponent={StudentLogEntries}
                        />
                    </>
                )
        }
    }
}
