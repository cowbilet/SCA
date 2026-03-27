import { useParams } from '@tanstack/react-router'
import { BookOpen, LoaderCircle } from 'lucide-react'
import { clsx } from 'clsx'
import ProposalForm from '../proposalForm'
import type { SubmissionState } from '@/types/awards'
import { Card, CardHeader } from '@/components/card'
import { useProposal } from '@/features/proposals/hooks/useProposal'
import { Route } from '@/routes/student/route'

export function SubmitProposal() {
    const { award, challenge } = useParams({
        from: '/student/$award/$challenge',
        strict: true,
    })
    return (
        <Card className="h-full flex flex-col p-0!">
            <CardHeader variant="neutral">
                <BookOpen className="h-5 w-5 text-amber-600" />
                <h2 className="text-lg font-semibold">New Proposal</h2>
            </CardHeader>
            <div className="p-4 flex-1">
                <ProposalForm
                    award={award}
                    challenge={challenge}
                    Button={SubmitButton}
                />
            </div>
        </Card>
    )
}
const disabledStates: Array<SubmissionState> = [
    'pending mentor',
    'pending assessor',
]
export function ActiveProposal({
    proposalStatus,
}: {
    proposalStatus: SubmissionState
}) {
    const { award, challenge } = useParams({
        from: '/student/$award/$challenge',
        strict: true,
    })
    const { user } = Route.useRouteContext()
    const {
        data: proposalData,
        isLoading,
        isError,
    } = useProposal(award, challenge, user.userId)
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoaderCircle
                    className="animate-spin text-gray-500"
                    size={48}
                />
            </div>
        )
    }
    if (isError || !proposalData) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error loading proposal data. Please try again later.
            </div>
        )
    }
    return (
        <Card className="h-full flex flex-col p-0!">
            <CardHeader variant="neutral">
                <BookOpen className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Your Proposal</h2>
            </CardHeader>
            <div className="p-4 flex-1 overflow-y-auto">
                <ProposalForm
                    values={proposalData}
                    disabled={disabledStates.includes(proposalStatus)}
                    award={award}
                    challenge={challenge}
                    Button={SubmitButton}
                />
            </div>
        </Card>
    )
}
function SubmitButton({
    isDisabled,
    isPending,
}: {
    isDisabled: boolean
    isPending: boolean
}) {
    return (
        <button
            type="submit"
            className={clsx(
                'bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center',
                {
                    'opacity-50 hover:cursor-not-allowed':
                        isPending || isDisabled,
                },
            )}
            disabled={isPending || isDisabled}
        >
            {isPending ? (
                <LoaderCircle className="animate-spin" />
            ) : (
                'Submit Proposal'
            )}
        </button>
    )
}
