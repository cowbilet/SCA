import { useQuery } from "@tanstack/react-query"
import { getAdvisorPending } from "@/api/advisors/getAdvisorPending"

export const usePendingProposalsOptions = () => {

    return {
        queryKey: ['pendingProposals'],
        queryFn: getAdvisorPending,
    }
}
export function usePendingProposals() {
    return useQuery(usePendingProposalsOptions())
}