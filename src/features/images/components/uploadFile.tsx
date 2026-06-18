import { useParams } from '@tanstack/react-router'
import { usePresignedFileUpload } from "../hooks/usePresignedFileUpload";
import { allowedFileTypes } from '../types/file';
import type { AllowedFileTypes} from '../types/file';

export function UploadFile() {
    const { award, challenge } = useParams({
        from: '/student/$award/$challenge',
        strict: true,
    })
    const { mutate: getUploadUrl } = usePresignedFileUpload(award, challenge)
    return (
        <div>
            <input
                type="file"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file && file.type in allowedFileTypes) {
                        getUploadUrl(file.type as AllowedFileTypes)
                    }
                }}
            />

        </div>
    )
}