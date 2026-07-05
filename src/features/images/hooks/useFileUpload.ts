import { getFileUploadURL } from '../api/getFileUploadURL'
import { recordUploadedFile } from '../api/recordUploadedFile'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'

type UploadFileInput = {
    file: File
    logId: string
}

type UploadFilesForLogInput = {
    award: Award
    challenge: Challenge
    files: Array<File>
    logId: string
}

async function uploadFile({ file, logId }: UploadFileInput, award: Award, challenge: Challenge) {
    const fileName = file.name
    const url = await getFileUploadURL({ data: { award, challenge, fileName, logId } })
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
    await recordUploadedFile({ data: { award, challenge, fileName, logId } })
}

export async function uploadFilesForLog({
    award,
    challenge,
    files,
    logId,
}: UploadFilesForLogInput) {
    for (const file of files) {
        await uploadFile({ file, logId }, award, challenge)
    }
}