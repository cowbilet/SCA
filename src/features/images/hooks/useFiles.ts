import { useMutation, useQuery } from "@tanstack/react-query";
import { getFiles } from "../api/generateFileURL";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";

export function useFiles(award: Award, challenge: Challenge, studentId: string) {
    return useQuery({
        queryKey: ['files', award, challenge, studentId],
        queryFn: async () => {
            const files = await getFiles({data: {studentId, award, challenge}})
            return files
        },
    })
}