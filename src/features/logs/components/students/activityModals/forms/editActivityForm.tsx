import { useState } from 'react'
import { useEditLog } from '../../../../hooks/useEditLogs'
import ActivityForm from './activityForm'
import type { ComponentProps } from 'react'
import type { LogEntry } from '@/types/schemas/log'
import { UploadFile } from '@/features/images/components/uploadFile'

export default function EditActivityForm({
    log,
    onSubmit,
    ...props
}: Omit<ComponentProps<'form'>, 'onSubmit'> & {
    log: LogEntry
    onSubmit?: () => void
}) {
    const { mutateAsync: editLog } = useEditLog({ oldLog: log })
    const [existingFiles, setExistingFiles] = useState<Array<string>>(log.files)
    const [newFiles, setNewFiles] = useState<Array<File>>([])

    const removeExistingFile = (fileName: string) => {
        setExistingFiles((currentFiles) =>
            currentFiles.filter((currentFile) => currentFile !== fileName),
        )
    }

    return (
        <ActivityForm
            id="edit-activity-form"
            log={log}
            onValidSubmit={async ({ date, description }) => {
                const approved = log.approved === false ? null : undefined
                await editLog({
                    description,
                    date,
                    approved,
                    files: existingFiles,
                    newFiles,
                })
                onSubmit?.()
            }}
            {...props}
        >
            <div className="flex flex-col gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        Files
                    </h3>
                    <p className="text-sm text-slate-600">
                        Remove existing files or add new uploads.
                    </p>
                </div>

                {existingFiles.length ? (
                    <div className="flex flex-wrap gap-2">
                        {existingFiles.map((fileName) => (
                            <span
                                key={fileName}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200"
                            >
                                <span className="truncate">{fileName}</span>
                                <button
                                    type="button"
                                    onClick={() => removeExistingFile(fileName)}
                                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1"
                                    aria-label={`Remove ${fileName}`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">
                        No existing files are attached to this log.
                    </p>
                )}

                <UploadFile
                    files={newFiles}
                    label="Add files"
                    description="Choose additional files to attach to this log."
                    onFilesChange={setNewFiles}
                />
            </div>
        </ActivityForm>
    )
}
