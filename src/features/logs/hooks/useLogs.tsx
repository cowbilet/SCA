import { queryOptions, useQuery } from '@tanstack/react-query'
import { getUserLogs } from '../api/getUserLogs';
import { Award } from "@/types/awards";
import { Challenge } from "@/types/challenges";

export const logsQueryOptions = (award: Award, challenge: Challenge, studentId?: string) => queryOptions({
    queryKey: ['logs', award, challenge, studentId],
    queryFn: () => getUserLogs({ data: { award, challenge, studentId: studentId! } }),
    enabled: !!studentId,
})
export function useLogs(award: Award, challenge: Challenge, studentId?: string ) {
    return useQuery(logsQueryOptions(award, challenge, studentId))
}