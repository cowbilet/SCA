import { useMutation } from "@tanstack/react-query";
import { reviewProposal } from "../api/reviewProposal";
import { Award } from "@/types/awards";
import { Challenge } from "@/types/challenges";
import { useQueryClient } from "@tanstack/react-query";
import { Proposal } from "@/types/schemas/proposal";

export function useReviewProposal(studentId: string, award: Award, challenge: Challenge) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['reviewProposal', studentId, award, challenge],
        mutationFn: (data: {notes: string, accepted: boolean }) => reviewProposal({data: { studentId, award, challenge, ...data }}),
        onMutate: (data) => {
            // Invalidate the proposal query to refetch the updated proposal data
            queryClient.cancelQueries({queryKey: ['proposals', award, challenge, studentId]})
            const previousProposal = queryClient.getQueryData<Proposal>(['proposals', award, challenge, studentId])
            if (!previousProposal) return
            const newProposal = generateNewProposal(previousProposal, data.accepted, data.notes)
            queryClient.setQueryData(['proposals', award, challenge, studentId], newProposal)
            return { previousProposal }
        },
        onError: (_error, _data, context) => {
            if (context?.previousProposal) {
                queryClient.setQueryData(['proposals', award, challenge, studentId], context.previousProposal)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['proposals', award, challenge, studentId]})
        }
    })
}
function generateNewProposal(previousProposal: Proposal, accepted: boolean, note: string): Proposal {
    if (previousProposal.status === "pending mentor") {
        return {
            ...previousProposal,
            status: accepted ? "pending assessor" : "rejected mentor",
            mentorNote: note,
        }
    }
    else {
        return {
            ...previousProposal,
            status: accepted ? "completed" : "rejected assessor",
            assessorNote: note,
        }
    }
}