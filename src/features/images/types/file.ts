export type AllowedFileTypes = 'image/jpeg' | 'image/png' | 'image/gif' | 'video/mp4' | 'application/pdf'
export const allowedFileTypes: Record<AllowedFileTypes, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'video/mp4': 'mp4',
    'application/pdf': 'pdf',
}