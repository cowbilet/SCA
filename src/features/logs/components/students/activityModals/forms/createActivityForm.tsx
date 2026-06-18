import { useParams } from '@tanstack/react-router'
import { useCreateLogEntry } from '../../../../hooks/useCreateLogEntry'
import ActivityForm from './activityForm'
import type { ComponentProps } from 'react'
import { UploadFile } from '@/features/images/components/uploadFile'


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
    return (
        <>
            <ActivityForm
                onValidSubmit={async ({ date, description }) => {
                    await createLogEntry({ date, description })
                    onSubmit?.()
                }}
                {...props}
            />
            <UploadFile />
        </>
    )
}
