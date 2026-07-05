import { useMutation, useQueryClient  } from "@tanstack/react-query";    
import { getFileUploadURL } from "../api/getFileUploadURL";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";

export function useUploadFile(award: Award, challenge: Challenge) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ file, logId } : { file: File, logId: string }) => {
            // TODO: Make this a guard util or something
            const fileName = file.name
            const url = await getFileUploadURL({data: {award, challenge, fileName, logId}})
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            })
            if (!response.ok) {
                console.error('Failed to upload file:', response.statusText)
                throw new Error('Failed to upload file')
            }
        },
        onSuccess: (_, { logId }) => {
            queryClient.invalidateQueries({queryKey: ['files', award, challenge, logId]})
        }
    })

}