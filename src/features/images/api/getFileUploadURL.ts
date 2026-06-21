import { createServerFn } from '@tanstack/react-start'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'
import { allowedFileTypes } from '../types/file'
import { PublicS3Client } from './index.server'

import type { AllowedFileTypes } from '../types/file'
import { restrictRoles } from '@/utils/auth'
import { dbGetLogEntry } from '@/db/logs.server'
import { awardSchema } from '@/types/schemas/award'
import { challengeSchema } from '@/types/schemas/challenges'


const getPresignedURLSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    logId: z.uuid(),
    fileName: z.string(),
})
export const getFileUploadURL = createServerFn({ method: 'GET' }).inputValidator(getPresignedURLSchema).handler(
    async ({ data }: { data: z.infer<typeof getPresignedURLSchema> }): Promise<string> => {
        const logEntry = await dbGetLogEntry(data.logId)
        const student = await restrictRoles({data: ['student']})
        // Verify the log entry exists
        if (!logEntry || logEntry.studentId !== student.userId) {
            throw new Error('Unauthorized')
        }
        console.log(data.fileName.split('.').pop()!)
        if (!Object.values(allowedFileTypes).includes(data.fileName.split('.').pop()!)) {
            throw new Error('File type not allowed')
        }
        
        return getSignedUrl(PublicS3Client, new PutObjectCommand({
            Bucket: 'uploads',
            Key: `${data.logId}/${data.award}/${data.challenge}/${crypto.randomUUID()}.${data.fileName.split('.').pop()}`,
            ContentType: data.fileName.split('.').pop(),
        }), {
            expiresIn: 3600
        })
    },
)