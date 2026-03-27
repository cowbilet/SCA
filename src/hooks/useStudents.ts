import { queryOptions, useQuery } from '@tanstack/react-query'
import { getAdvisorStudents } from '@/api/advisors/getAdvisorStudents'

export const useStudentsOptions = () => {
    return queryOptions({
        queryKey: ['students'],
        queryFn: getAdvisorStudents,
    })
}
export function useStudents() {
    return useQuery(useStudentsOptions())
}

export function useStudentById(studentId: string) {
    return useQuery({
        ...useStudentsOptions(),
        select: (students) => {
            return students.filter((student) => student.userId === studentId)[0]
        },
    })
}