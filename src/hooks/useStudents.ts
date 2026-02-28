import { getAdvisorStudents} from "@/api/advisors/getAdvisorStudents"
import { useQuery } from "@tanstack/react-query"

export const useStudentsOptions = () => {

    return {
        queryKey: ['students'],
        queryFn: getAdvisorStudents,
    }
}
export function useStudents() {
    return useQuery(useStudentsOptions())
}