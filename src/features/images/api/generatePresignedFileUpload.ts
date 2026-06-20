import { createServerFn } from '@tanstack/react-start'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'
import { allowedFileTypes } from '../types/file'
import { s3Client } from './index.server'

import type { AllowedFileTypes } from '../types/file'
import { restrictRoles } from '@/utils/auth'
import { awardSchema } from '@/types/schemas/award'
import { challengeSchema } from '@/types/schemas/challenges'


const getPresignedURLSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    fileType: z.enum(Object.keys(allowedFileTypes) as Array<AllowedFileTypes>),
})
export const generatePresignedFileUpload = createServerFn({ method: 'GET' }).inputValidator(getPresignedURLSchema).handler(
    async ({ data }: { data: z.infer<typeof getPresignedURLSchema> }): Promise<string> => {
        const student = await restrictRoles({ data: ['student'] }) 
        return getSignedUrl(s3Client, new PutObjectCommand({
            Bucket: 'uploads',
            Key: `${student.userId}/${data.award}/${data.challenge}/${crypto.randomUUID()}.${allowedFileTypes[data.fileType]}`,
            ContentType: data.fileType,
        }), {
            expiresIn: 3600
        })
    },
)