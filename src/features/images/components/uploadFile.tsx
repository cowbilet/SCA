import { useParams } from '@tanstack/react-router'
import { useUploadFile } from "../hooks/useFileUpload";
import { allowedFileTypes } from '../types/file';
import { useFiles } from '../hooks/useFiles';
import type { AllowedFileTypes} from '../types/file';
import { Route } from "@/routes/student/$award/$challenge";

export function UploadFile() {
    const { award, challenge } = useParams({
        from: '/student/$award/$challenge',
        strict: true,
    })
    const { mutate: uploadFile } = useUploadFile(award, challenge)
    const { user } = Route.useRouteContext()
    const getFiles = useFiles(award, challenge, user.userId)
    return (
        <div>
            <input
                type="file"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file && file.type in allowedFileTypes) {
                        uploadFile({ file })
                        
                    }
                }}
            />
        </div>
    )
}