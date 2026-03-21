import { useMutation, useQueryClient  } from "@tanstack/react-query";
import { reviewProposal } from "../api/reviewProposal";
import type { Proposal, ProposalWithStudent } from "@/types/schemas/proposal";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";
import { queryKeys } from "@/hooks/queryKeys";

export function useReviewProposal(studentId: string, award: Award, challenge: Challenge) {
    const queryClient = useQueryClient()
    const proposalKey = queryKeys.proposals.detail(award, challenge, studentId)
    const pendingProposalsKey = queryKeys.proposals.pending()
    return useMutation({
        mutationKey: ['reviewProposal', studentId, award, challenge],
        mutationFn: (data: {notes: string, accepted: boolean }) => reviewProposal({data: { studentId, award, challenge, ...data }}),
        onMutate: (data) => {
            // Invalidate the proposal query to refetch the updated proposal data
            queryClient.cancelQueries({queryKey: proposalKey})
            queryClient.cancelQueries({ queryKey: pendingProposalsKey })
            const previousProposal = queryClient.getQueryData<Proposal>(proposalKey)
            const previousPendingProposals = queryClient.getQueryData<Array<ProposalWithStudent>>(pendingProposalsKey)
            if (!previousProposal) return
            const newProposal = generateNewProposal(previousProposal, data.accepted, data.notes)
            queryClient.setQueryData(proposalKey, newProposal)
            queryClient.setQueryData<Array<ProposalWithStudent>>(pendingProposalsKey, (oldData) => {
                if (!oldData) return oldData
                return oldData.filter(proposal => !(proposal.proposal.award === award && proposal.proposal.challenge === challenge && proposal.student.userId === studentId))
            })
            return { previousProposal, previousPendingProposals }
        },
        onError: (_error, _data, context) => {
            if (context?.previousProposal) {
                queryClient.setQueryData(proposalKey, context.previousProposal)
            }
            if (context?.previousPendingProposals) {
                queryClient.setQueryData(pendingProposalsKey, context.previousPendingProposals)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: proposalKey})
            queryClient.invalidateQueries({ queryKey: pendingProposalsKey })
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