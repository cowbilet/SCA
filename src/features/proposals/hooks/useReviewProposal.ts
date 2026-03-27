import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { reviewProposal } from '../api/reviewProposal'
import { proposalQueryOptions } from './useProposal'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import type { Proposal } from '@/types/schemas/proposal'
import { usePendingOptions } from '@/hooks/usePending'

export function useReviewProposal(
    studentId: string,
    award: Award,
    challenge: Challenge,
) {
    const queryClient = useQueryClient()
    const { queryKey: proposalKey } = proposalQueryOptions(award, challenge, studentId)
    const { queryKey: pendingProposalsKey } = usePendingOptions()
    const { queryKey: challengeKey } = proposalQueryOptions(award, challenge, studentId)
    
    return useMutation({
        mutationKey: ['reviewProposal', studentId, award, challenge],
        mutationFn: (data: { notes: string; accepted: boolean }) =>
            reviewProposal({ data: { studentId, award, challenge, ...data } }),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: proposalKey })
            await queryClient.cancelQueries({ queryKey: pendingProposalsKey })
            const previousProposal =
                queryClient.getQueryData(proposalKey)
            const previousPendingProposals =
                queryClient.getQueryData(pendingProposalsKey)
            if (!previousProposal) return
            const newProposal = generateNewProposal(
                previousProposal,
                data.accepted,
                data.notes,
            )
            queryClient.setQueryData(proposalKey, newProposal)
            queryClient.setQueryData(
                pendingProposalsKey,
                (oldData) => {
                    if (!oldData) return oldData
                    return oldData.filter(
                        (proposal) =>
                            !(
                                proposal.type === 'proposal' &&
                                proposal.award === award &&
                                proposal.challenge === challenge &&
                                proposal.studentId === studentId
                            ),
                    )
                },
            )
            return { previousProposal, previousPendingProposals }
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
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: proposalKey })
            await queryClient.invalidateQueries({ queryKey: pendingProposalsKey })
            await queryClient.invalidateQueries({ queryKey: challengeKey })
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
            status: accepted ? 'pending state assessor' : 'rejected mentor',
            mentorNote: note,
        }
    }

    if (previousProposal.status === 'pending state assessor') {
        return {
            ...previousProposal,
            status:
                previousProposal.award === 'gold'
                    ? accepted
                        ? 'pending national assessor'
                        : 'rejected state assessor'
                    : accepted
                      ? 'completed'
                      : 'rejected state assessor',
            stateAssessorNote: note,
        }
    }

    if (previousProposal.status === 'pending national assessor') {
        return {
            ...previousProposal,
            status: accepted ? 'completed' : 'rejected national assessor',
            nationalAssessorNote: note,
        }
    }

    return previousProposal
}
