import { StudentChallengeWithProposalAndSubmission } from '@/types/schemas/challenges';
import { createUserProposal } from '../api/createUserProposal';
import { Award } from "@/types/awards";
import { Challenge } from "@/types/challenges";
import { Proposal } from '@/types/schemas/proposal';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
export function useCreateChallenge(award: Award, challenge: Challenge) {
    const queryClient = useQueryClient();
    const router = useRouter()
    return useMutation({
        mutationFn: (data: { mentorEmail: string, description: string, goal: string }) => createUserProposal({ data: { ...data, award, challenge } }),
        onMutate: async (newProposal) => {
            await queryClient.cancelQueries({ queryKey: ['challenges', award, challenge] })
            await queryClient.cancelQueries({ queryKey: ['proposals', award, challenge] })

            const previousChallenge = queryClient.getQueryData<StudentChallengeWithProposalAndSubmission | null>(['challenges', award, challenge])
            const previousProposal = queryClient.getQueryData<Proposal | null>(['proposals', award, challenge])

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

            queryClient.setQueryData(['challenges', award, challenge], (oldData: StudentChallengeWithProposalAndSubmission | null): StudentChallengeWithProposalAndSubmission | null => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    proposals: {
                        ...(oldData.proposals ?? optimisticProposal),
                        ...optimisticProposal,
                    },
                }
            })

            queryClient.setQueryData<Proposal | null>(['proposals', award, challenge], optimisticProposal)

            return { previousChallenge, previousProposal }
        },
        onError: async (_error, _newProposal, context) => {
            await queryClient.cancelQueries({ queryKey: ['challenges', award, challenge] })
            await queryClient.cancelQueries({ queryKey: ['proposals', award, challenge] })

            if (context) {
                queryClient.setQueryData(['challenges', award, challenge], context.previousChallenge ?? null)
                queryClient.setQueryData(['proposals', award, challenge], context.previousProposal ?? null)
            } else {
                queryClient.removeQueries({ queryKey: ['proposals', award, challenge], exact: true })
            }
        },
        onSuccess: async (data) => {
            await queryClient.setQueryData(['proposals', award, challenge], data)

            queryClient.setQueryData(['challenges', award, challenge], (oldData: StudentChallengeWithProposalAndSubmission | null): StudentChallengeWithProposalAndSubmission | null => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    proposals: data,
                }
            })

            await router.invalidate({sync: true})
            await queryClient.invalidateQueries({ queryKey: ['proposals', award, challenge] })
            await queryClient.invalidateQueries({ queryKey: ['challenges', award, challenge] })
        }
    })
}