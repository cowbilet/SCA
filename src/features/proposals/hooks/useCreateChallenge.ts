import { useMutation, useQueryClient  } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { createUserProposal } from '../api/createUserProposal';
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";
import type { Proposal } from '@/types/schemas/proposal';
import type { StudentChallengeWithProposalAndSubmission } from '@/types/schemas/challenges';
import { useSession } from '@/integrations/better-auth/authClient';
import { queryKeys } from '@/hooks/queryKeys';

export function useCreateChallenge(award?: Award, challenge?: Challenge) {
    const queryClient = useQueryClient();
    const router = useRouter()
    const { data: user } = useSession()
    const id = user?.user.id
    return useMutation({
        mutationFn: (data: { mentorEmail: string, description: string, goal: string }) => createUserProposal({ data: { ...data, award, challenge } }),
        onMutate: async (newProposal) => {
            if (!award || !challenge || !id) {
                throw new Error("Award, challenge, and user ID must be provided")
            }
            const challengeKey = queryKeys.challenges.detail(award, challenge, id)
            const proposalKey = queryKeys.proposals.detail(award, challenge, id)
            await queryClient.cancelQueries({ queryKey: challengeKey })
            await queryClient.cancelQueries({ queryKey: proposalKey })

            const previousChallenge = queryClient.getQueryData<StudentChallengeWithProposalAndSubmission | null>(challengeKey)
            const previousProposal = queryClient.getQueryData<Proposal | null>(proposalKey)

            const optimisticProposal: Proposal = {
                studentId: '',
                award,
                challenge,
                description: newProposal.description,
                goal: newProposal.goal,
                mentorNote: null,
                assessorNote: null,
                accepted: null,
                mentorEmail: newProposal.mentorEmail,
                status: 'pending mentor',
            }

            queryClient.setQueryData(challengeKey, (oldData: StudentChallengeWithProposalAndSubmission | null): StudentChallengeWithProposalAndSubmission | null => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    proposals: {
                        ...(oldData.proposals ?? optimisticProposal),
                        ...optimisticProposal,
                    },
                }
            })

            queryClient.setQueryData<Proposal | null>(proposalKey, optimisticProposal)

            return { previousChallenge, previousProposal }
        },
        onError: async (_error, _newProposal, context) => {
            if (!award || !challenge || !id) {
                return
            }
            const challengeKey = queryKeys.challenges.detail(award, challenge, id)
            const proposalKey = queryKeys.proposals.detail(award, challenge, id)

            await queryClient.cancelQueries({ queryKey: challengeKey })
            await queryClient.cancelQueries({ queryKey: proposalKey })

            if (context) {
                queryClient.setQueryData(challengeKey, context.previousChallenge ?? null)
                queryClient.setQueryData(proposalKey, context.previousProposal ?? null)
            } else {
                queryClient.removeQueries({ queryKey: proposalKey, exact: true })
            }
        },
        onSuccess: async (data) => {
            if (!award || !challenge || !id) {
                throw new Error("Award, challenge, and user ID must be provided")
            }
            const challengeKey = queryKeys.challenges.detail(award, challenge, id)
            const proposalKey = queryKeys.proposals.detail(award, challenge, id)

            await queryClient.setQueryData(proposalKey, data)

            queryClient.setQueryData(challengeKey, (oldData: StudentChallengeWithProposalAndSubmission | null): StudentChallengeWithProposalAndSubmission | null => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    proposals: data,
                }
            })

            await router.invalidate({sync: true})
            await queryClient.invalidateQueries({ queryKey: proposalKey })
            await queryClient.invalidateQueries({ queryKey: challengeKey })
        }
    })
}