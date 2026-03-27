import { queryOptions, useQuery } from '@tanstack/react-query'
import { getStudentAwardAndChallenges } from '@/api/students/getStudentAwardAndChallenges'

export const useStudentChallengesOptions = (studentId: string) => {
    return queryOptions({
        queryKey: ['student', 'challenges'],
        queryFn: () => getStudentAwardAndChallenges({data: { studentId }}),
    })
}
export function useStudentChallenges(studentId: string) {
    return useQuery(useStudentChallengesOptions(studentId))
}
