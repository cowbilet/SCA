import { useQuery } from "@tanstack/react-query"
import { getAdvisorStudents} from "@/api/advisors/getAdvisorStudents"

export const useStudentsOptions = () => {

    return {
        queryKey: ['students'],
        queryFn: getAdvisorStudents,
    }
}
export function useStudents() {
    return useQuery(useStudentsOptions())
}