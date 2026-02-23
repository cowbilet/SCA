import { getMentorPending } from "@/api/mentors/getMentorPending"
import { useQuery } from "@tanstack/react-query"

export const usePendingProposalsOptions = () => {

    return {
        queryKey: ['pendingProposals'],
        queryFn: getMentorPending,
    }
}
export function usePendingProposals() {
    return useQuery(usePendingProposalsOptions())
}