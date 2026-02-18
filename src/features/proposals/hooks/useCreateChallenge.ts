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
        onSuccess: async () => {
            // Invalidate any queries related to proposals to ensure fresh data
            queryClient.refetchQueries({
                queryKey: ['challenges', award, challenge],
            })
            await router.invalidate({sync: true})

        }
    })
}