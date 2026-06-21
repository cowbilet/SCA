import { createServerFn } from '@tanstack/react-start'
import { GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PublicS3Client, ServerS3Client } from './index.server'
import { restrictStudentData } from '@/utils/auth'
import { dbGetLogEntry } from '@/db/logs.server'

import { awardSchema } from '@/types/schemas/award'
import { challengeSchema } from '@/types/schemas/challenges'


const getPresignedURLSchema = z.object({
    award: awardSchema,
    challenge: challengeSchema,
    logId: z.uuid(),
})
export const getFiles = createServerFn({ method: 'GET' }).inputValidator(getPresignedURLSchema).handler(
    async ({ data }: { data: z.infer<typeof getPresignedURLSchema> }): Promise<Array<string>> => {
        const logEntry = await dbGetLogEntry(data.logId)
        if (!logEntry) {
            throw new Error('Log entry not found')
        }
        await restrictStudentData({data: logEntry.studentId})
        const command = new ListObjectsCommand({
            Bucket: 'uploads',
            Prefix: `${data.logId}/${data.award}/${data.challenge}/`
        })
        const files = await ServerS3Client.send(command)
        const fileURLs = await Promise.all((files.Contents || []).map(file => generateFileURL(file.Key!)))
        return fileURLs
    },
)
function generateFileURL(key: string) {
    const command = new GetObjectCommand({
        Bucket: 'uploads',
        Key: key,
    })
    return getSignedUrl(PublicS3Client, command, { expiresIn: 3600 })
}