import { queryOptions, useQuery } from '@tanstack/react-query'
import { getAdvisorStudents } from '@/api/advisors/getAdvisorStudents'
import { queryKeys } from '@/hooks/queryKeys'

export const useStudentsOptions = () => {
    return queryOptions({
        queryKey: queryKeys.students.all(),
        queryFn: getAdvisorStudents,
    })
}
export function useStudents() {
    return useQuery(useStudentsOptions())
}
