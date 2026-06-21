import { useParams } from '@tanstack/react-router'
import {  useRef } from 'react'
import { useCreateLogEntry } from '../../../../hooks/useCreateLogEntry'
import ActivityForm from './activityForm'
import type {ComponentProps} from 'react';
import { UploadFile } from '@/features/images/components/uploadFile'
import { useUploadFile } from '@/features/images/hooks/useFileUpload'


export default function CreateActivityForm({
    onSubmit,
    ...props
}: Omit<ComponentProps<'form'>, 'onSubmit'> & { onSubmit?: () => void }) {
    const { award, challenge } = useParams({
        strict: true,
        from: '/student/$award/$challenge',
    })
    const { mutateAsync: createLogEntry } = useCreateLogEntry({
        award,
        challenge,
    })
    const { mutateAsync: uploadFile } = useUploadFile(award, challenge)
    const uploadRef = useRef<HTMLInputElement>(null);
    return (
        <>
            <ActivityForm
                onValidSubmit={async ({ date, description }) => {
                    const log = await createLogEntry({ date, description })
                    for (const file of uploadRef.current?.files || []) {
                        await uploadFile({ file, logId: log.logId })
                    }
                    onSubmit?.()
                }}
                {...props}
            >
                <UploadFile ref={uploadRef} />
            </ActivityForm>
        </>
    )
}
