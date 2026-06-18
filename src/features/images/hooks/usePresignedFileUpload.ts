import { useMutation } from "@tanstack/react-query";    
import { generatePresignedFileUpload  } from "../api/generatePresignedFileUpload";
import type { AllowedFileTypes } from "../types/file";
import type { Award } from "@/types/awards";
import type { Challenge } from "@/types/challenges";

export function usePresignedFileUpload(award: Award, challenge: Challenge) {
    return useMutation({
        mutationFn: (fileType: AllowedFileTypes) => generatePresignedFileUpload({ data: { award, challenge, fileType } }),
        onSuccess: (url) => {
            // Here you would typically use the returned presigned URL to upload the file directly to S3.
            // For example, you could use fetch or axios to PUT the file to the presigned URL.
            console.log('Presigned URL:', url)
        }
    })

}