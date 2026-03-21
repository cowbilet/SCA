import { useMutation, useQueryClient  } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { createUserProposal } from '../api/createUserProposal';
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";
import type { Proposal } from '@/types/schemas/proposal';
import type { StudentChallengeWithProposalAndSubmission } from '@/types/schemas/challenges';
import { useSession } from '@/integrations/better-auth/authClient';

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
            await queryClient.cancelQueries({ queryKey: ['challenges', award, challenge, id] })
            await queryClient.cancelQueries({ queryKey: ['proposals', award, challenge, id] })

            const previousChallenge = queryClient.getQueryData<StudentChallengeWithProposalAndSubmission | null>(['challenges', award, challenge, id])
            const previousProposal = queryClient.getQueryData<Proposal | null>(['proposals', award, challenge, id])

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

            queryClient.setQueryData(['challenges', award, challenge, id    ], (oldData: StudentChallengeWithProposalAndSubmission | null): StudentChallengeWithProposalAndSubmission | null => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    proposals: {
                        ...(oldData.proposals ?? optimisticProposal),
                        ...optimisticProposal,
                    },
                }
            })

            queryClient.setQueryData<Proposal | null>(['proposals', award, challenge, id], optimisticProposal)

            return { previousChallenge, previousProposal }
        },
        onError: async (_error, _newProposal, context) => {

            await queryClient.cancelQueries({ queryKey: ['challenges', award, challenge, id] })
            await queryClient.cancelQueries({ queryKey: ['proposals', award, challenge, id] })

            if (context) {
                queryClient.setQueryData(['challenges', award, challenge, id], context.previousChallenge ?? null)
                queryClient.setQueryData(['proposals', award, challenge, id], context.previousProposal ?? null)
            } else {
                queryClient.removeQueries({ queryKey: ['proposals', award, challenge, id], exact: true })
            }
        },
        onSuccess: async (data) => {
            if (!award || !challenge || !id) {
                throw new Error("Award, challenge, and user ID must be provided")
            }
            await queryClient.setQueryData(['proposals', award, challenge, id], data)

            queryClient.setQueryData(['challenges', award, challenge, id], (oldData: StudentChallengeWithProposalAndSubmission | null): StudentChallengeWithProposalAndSubmission | null => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    proposals: data,
                }
            })

            await router.invalidate({sync: true})
            await queryClient.invalidateQueries({ queryKey: ['proposals', award, challenge, id] })
            await queryClient.invalidateQueries({ queryKey: ['challenges', award, challenge, id] })
        }
    })
}