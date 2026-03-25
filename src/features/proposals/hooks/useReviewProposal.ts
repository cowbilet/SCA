import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewProposal } from '../api/reviewProposal'
import type { Proposal, ProposalWithStudent } from '@/types/schemas/proposal'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import type { StudentChallengeWithProposalAndSubmission } from '@/types/schemas/challenges'
import { queryKeys } from '@/hooks/queryKeys'

export function useReviewProposal(
    studentId: string,
    award: Award,
    challenge: Challenge,
) {
    const queryClient = useQueryClient()
    const proposalKey = queryKeys.proposals.detail(award, challenge, studentId)
    const pendingProposalsKey = queryKeys.proposals.pending()
    // TODO: I believe the challenge is causing deduplication, for the future maybe lets seperate them but do two seperate requests?
    const challengeKey = queryKeys.challenges.detail(award, challenge, studentId)
    return useMutation({
        mutationKey: ['reviewProposal', studentId, award, challenge],
        mutationFn: (data: { notes: string; accepted: boolean }) =>
            reviewProposal({ data: { studentId, award, challenge, ...data } }),
        onMutate: (data) => {
            // Invalidate the proposal query to refetch the updated proposal data
            queryClient.cancelQueries({ queryKey: proposalKey })
            queryClient.cancelQueries({ queryKey: pendingProposalsKey })
            queryClient.cancelQueries({ queryKey: challengeKey })
            const previousProposal =
                queryClient.getQueryData<Proposal>(proposalKey)
            const previousPendingProposals =
                queryClient.getQueryData<Array<ProposalWithStudent>>(
                    pendingProposalsKey,
                )
            const previousChallenge = queryClient.getQueryData(challengeKey)
            if (!previousProposal) return
            const newProposal = generateNewProposal(
                previousProposal,
                data.accepted,
                data.notes,
            )
            queryClient.setQueryData(proposalKey, newProposal)
            queryClient.setQueryData<Array<ProposalWithStudent>>(
                pendingProposalsKey,
                (oldData) => {
                    if (!oldData) return oldData
                    return oldData.filter(
                        (proposal) =>
                            !(
                                proposal.proposal.award === award &&
                                proposal.proposal.challenge === challenge &&
                                proposal.student.userId === studentId
                            ),
                    )
                },
            )
            queryClient.setQueryData<StudentChallengeWithProposalAndSubmission>(challengeKey, (oldData) => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    proposals: newProposal,
                }
            })
            return { previousProposal, previousPendingProposals, previousChallenge }
        },
        onError: (_error, _data, context) => {
            if (context?.previousProposal) {
                queryClient.setQueryData(proposalKey, context.previousProposal)
            }
            if (context?.previousPendingProposals) {
                queryClient.setQueryData(
                    pendingProposalsKey,
                    context.previousPendingProposals,
                )
            }
            if (context?.previousChallenge) {
                queryClient.setQueryData(challengeKey, context.previousChallenge)
            }

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: proposalKey })
            queryClient.invalidateQueries({ queryKey: pendingProposalsKey })
            queryClient.invalidateQueries({ queryKey: challengeKey })
        },
    })
}
function generateNewProposal(
    previousProposal: Proposal,
    accepted: boolean,
    note: string,
): Proposal {
    if (previousProposal.status === 'pending mentor') {
        return {
            ...previousProposal,
            status: accepted ? 'pending assessor' : 'rejected mentor',
            mentorNote: note,
        }
    } else {
        return {
            ...previousProposal,
            status: accepted ? 'completed' : 'rejected assessor',
            assessorNote: note,
        }
    }
}
