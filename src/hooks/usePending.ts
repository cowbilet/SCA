import { queryOptions, useQuery } from '@tanstack/react-query'
import { getAdvisorPending } from '@/api/advisors/getAdvisorPending'

export const usePendingOptions = () => {
    return queryOptions({
        queryKey: ['pending', 'list'],
        queryFn: getAdvisorPending,
    })
}
export function usePending() {
    return useQuery(usePendingOptions())
}
