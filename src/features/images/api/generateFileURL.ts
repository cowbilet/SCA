import { createServerFn } from '@tanstack/react-start'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ListObjectsCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'
import { allowedFileTypes } from '../types/file'
import { s3Client } from './index.server'

import type { AllowedFileTypes } from '../types/file'
import {restrictStudentData} from "@/utils/auth"
import { awardSchema } from '@/types/schemas/award'
import { challengeSchema } from '@/types/schemas/challenges'


const getPresignedURLSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    studentId: z.string(),
})
export const getFiles = createServerFn({ method: 'GET' }).inputValidator(getPresignedURLSchema).handler(
    async ({ data }: { data: z.infer<typeof getPresignedURLSchema> }): Promise<string> => {
        await restrictStudentData({data: data.studentId})
        const command = new ListObjectsCommand({
            Bucket: 'uploads',
            Prefix: `${data.studentId}/${data.award}/${data.challenge}/`
        })
        const response = await s3Client.send(command)
        const existingFiles = response.Contents || []
        console.log('Existing files:', existingFiles)
        return "hi"
    },
)