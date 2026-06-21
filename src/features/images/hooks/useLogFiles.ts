import { useMutation, useQuery } from "@tanstack/react-query";
import { getFiles } from "../api/getActivityFiles";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";

export function useFiles(award: Award, challenge: Challenge, logId: string) {
    return useQuery({
        queryKey: ['files', award, challenge, logId],
        queryFn: async () => {
            const files = await getFiles({data: {logId, award, challenge}})
            return files
        },
    })
}