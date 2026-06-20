import { useMutation } from "@tanstack/react-query";    
import { generatePresignedFileUpload  } from "../api/generatePresignedFileUpload";
import type { AllowedFileTypes } from "../types/file";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";

export function useUploadFile(award: Award, challenge: Challenge) {
    return useMutation({
        mutationFn: async ({ file } : { file: File }) => {
            // TODO: Make this a guard util or something
            const fileType = file.type as AllowedFileTypes
            const url = await generatePresignedFileUpload({data: {award, challenge, fileType}})
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': fileType,
                },
                body: file,
            })
            
            if (!response.ok) {
                console.error('Failed to upload file:', response.statusText)
                throw new Error('Failed to upload file')
            }
        },
    })

}