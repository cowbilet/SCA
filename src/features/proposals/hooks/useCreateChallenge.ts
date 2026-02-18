import { StudentChallengeSchema } from '@/types/schemas/challenges';
import { createUserProposal } from '../api/createProposals';
import { Award } from "@/types/awards";
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
export function useCreateChallenge(award: Award, challenge: string) {
    const queryClient = useQueryClient();
    const router = useRouter()
    return useMutation({
        mutationFn: (data: { mentorEmail: string, description: string, goal: string }) => createUserProposal({ data: { ...data, award, challenge } }),
        onMutate: async (newProposal) => {
            // Optionally, you can perform optimistic updates here if you want the UI to reflect the new proposal immediately
            // For example, you could add the new proposal to the cache with a temporary ID
            await queryClient.cancelQueries({ queryKey: ['challenges', award, challenge] })
            const tempId = `temp-${Date.now()}`
            queryClient.setQueryData(['challenges', award, challenge], (oldData: StudentChallengeSchema): StudentChallengeSchema => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    proposalIds: [...(oldData.proposalIds || []), tempId],
                    submissionStatus: 'pending mentor', // Assuming the new proposal starts with 'pending mentor' status
                }
            })
            queryClient.setQueryData(['proposals', award, challenge], {
                proposalId: tempId,
                studentId: -1, // You might want to set this to the actual student ID if available
                award,
                challenge,
                description: newProposal.description,
                goal: newProposal.goal,
                mentorNote: null,
                assessorNote: null,
                accepted: null,
                mentorEmail: newProposal.mentorEmail,
            })
            return { tempId }
        },
        onError: async (error, newProposal, context) => {
            // If the mutation fails, you can roll back the optimistic update using the context returned from onMutate
            if (context?.tempId) {
                await queryClient.cancelQueries({ queryKey: ['challenges', award, challenge] })

                queryClient.setQueryData(['challenges', award, challenge], (oldData: StudentChallengeSchema): StudentChallengeSchema => {
                    if (!oldData) return oldData
                    return {
                        ...oldData,
                        proposalIds: oldData.proposalIds?.filter(id => id !== context.tempId) || [],
                    }
                })
                queryClient.removeQueries({ queryKey: ['proposals', award, challenge] })
            }
        },
        onSuccess: async (data, variables, context) => {
            // Invalidate any queries related to proposals to ensure fresh data
            await queryClient.invalidateQueries({ queryKey: ['proposals', award, challenge] })
            await queryClient.invalidateQueries({ queryKey: ['challenges', award, challenge] })
            await router.invalidate({sync: true})
            await queryClient.setQueryData(['proposals', award, challenge], data)
            queryClient.setQueryData(['challenges', award, challenge], (oldData: StudentChallengeSchema): StudentChallengeSchema => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    proposalIds: data.proposalId ? [...(oldData.proposalIds || []), data.proposalId] : oldData.proposalIds,
                }
            })

        }
    })
}