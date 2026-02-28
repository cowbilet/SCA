import { getAdvisorPending } from "@/api/advisors/getAdvisorPending"
import { useQuery } from "@tanstack/react-query"

export const usePendingProposalsOptions = () => {

    return {
        queryKey: ['pendingProposals'],
        queryFn: getAdvisorPending,
    }
}
export function usePendingProposals() {
    return useQuery(usePendingProposalsOptions())
}