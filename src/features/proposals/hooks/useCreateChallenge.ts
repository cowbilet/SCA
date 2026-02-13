import { createUserProposal } from '../api/proposals';
import { Award } from "@/types/awards";
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

export function useCreateChallenge(award: Award, challenge: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { mentorEmail: string, description: string, goal: string }) => createUserProposal({ data: { ...data, award, challenge } }),
        onSuccess: () => {
            // Invalidate any queries related to proposals to ensure fresh data
            queryClient.invalidateQueries({
                queryKey: ['challenges', award],
            })
        }
    })
}