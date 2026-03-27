import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { createUserProposal } from '../api/createUserProposal'
import { proposalQueryOptions } from './useProposal'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import type { Proposal } from '@/types/schemas/proposal'
import { useSession } from '@/integrations/better-auth/authClient'
import { challengeQueryOptions } from '@/hooks/useChallenge'

export function useCreateChallenge(award?: Award, challenge?: Challenge) {
    const queryClient = useQueryClient()
    const router = useRouter()
    const { data: user } = useSession()
    const id = user?.user.id
    const keys =
        award && challenge && id
            ? {
                  proposalKey: proposalQueryOptions(award, challenge, id)
                      .queryKey,
                  challengeKey: challengeQueryOptions(award, challenge, id)
                      .queryKey,
              }
            : null

    return useMutation({
        mutationFn: (data: {
            mentorEmail: string
            description: string
            goal: string
        }) => createUserProposal({ data: { ...data, award, challenge } }),
        onMutate: async (newProposal) => {
            if (!award || !challenge || !id || !keys) {
                throw new Error(
                    'Award, challenge, and user ID must be provided',
                )
            }
            const { proposalKey, challengeKey } = keys
            await queryClient.cancelQueries({ queryKey: proposalKey })
            await queryClient.cancelQueries({ queryKey: challengeKey })
            const previousProposal = queryClient.getQueryData(
                proposalKey,
            )

            const optimisticProposal: Proposal = {
                studentId: id,
                award,
                challenge,
                mentorEmail: newProposal.mentorEmail,
                description: newProposal.description,
                goal: newProposal.goal,
                mentorNote: null,
                stateAssessorNote: null,
                nationalAssessorNote: null,
                accepted: null,
                status: 'pending mentor',
            }

            queryClient.setQueryData(
                proposalKey,
                optimisticProposal,
            )

            return { previousProposal }
        },
        onError: async (_error, _newProposal, context) => {
            if (!award || !challenge || !id || !keys) {
                return
            }
            const { proposalKey } = keys

            await queryClient.cancelQueries({ queryKey: proposalKey })

            if (context) {
                queryClient.setQueryData(
                    proposalKey,
                    context.previousProposal ?? null,
                )
            } else {
                queryClient.removeQueries({
                    queryKey: proposalKey,
                    exact: true,
                })
            }
        },
        onSuccess: async (data) => {
            if (!award || !challenge || !id || !keys) {
                throw new Error(
                    'Award, challenge, and user ID must be provided',
                )
            }
            const { proposalKey } = keys

            await queryClient.setQueryData(proposalKey, data)

            await router.invalidate({ sync: true })
            await queryClient.invalidateQueries({ queryKey: proposalKey })
        },
    })
}
