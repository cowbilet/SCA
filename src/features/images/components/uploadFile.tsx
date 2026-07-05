import clsx from 'clsx'
import {
    forwardRef,
    useId,
} from 'react'
import { allowedFileTypes } from '../types/file'
import type { ChangeEvent, ComponentPropsWithoutRef } from 'react'

type UploadFileProps = ComponentPropsWithoutRef<'input'> & {
    files: Array<File>
    label?: string
    description?: string
    onFilesChange: (files: Array<File>) => void
}

type SelectedFileChipProps = {
    file: File
    onRemove: () => void
}

function SelectedFileChip({ file, onRemove }: SelectedFileChipProps) {
    return (
        <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200">
            <span className="truncate">{file.name}</span>
            <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:cursor-pointer hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1"
                aria-label={`Remove ${file.name}`}
            >
                ×
            </button>
        </span>
    )
}

function UploadFileEmptyState() {
    return (
        <p className="text-sm text-slate-500">
            No files selected yet. You can choose multiple files at once.
        </p>
    )
}

function UploadFileHeader({
    inputId,
    label,
    description,
}: {
    inputId: string
    label: string
    description: string
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
                <label
                    htmlFor={inputId}
                    className="block text-sm font-semibold text-slate-900"
                >
                    {label}
                </label>
                <p className="text-sm text-slate-600">{description}</p>
            </div>

            <label
                htmlFor={inputId}
                className="inline-flex shrink-0 cursor-pointer items-center rounded bg-slate-900 px-4 py-2 text-md font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
                Browse
            </label>
        </div>
    )
}

function UploadFileList({
    files,
    onRemove,
}: {
    files: Array<File>
    onRemove: (fileIndex: number) => void
}) {
    if (!files.length) {
        return <UploadFileEmptyState />
    }

    return (
        <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
                <SelectedFileChip
                    key={`${file.name}-${file.size}-${index}`}
                    file={file}
                    onRemove={() => onRemove(index)}
                />
            ))}
        </div>
    )
}

export const UploadFile = forwardRef<HTMLInputElement, UploadFileProps>(
    function UploadFile(
        {
            className,
            id,
            files,
            label = 'Upload files',
            description = 'Choose one or more files to attach to this entry.',
            accept = Object.keys(allowedFileTypes).join(','),
            multiple = true,
            onChange,
            onFilesChange,
            ...props
        },
        ref,
    ) {
        const generatedId = useId()
        const inputId = id ?? generatedId

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = Array.from(event.currentTarget.files ?? [])
            if (!selectedFiles.length) {
                onChange?.(event)
                return
            }

            const nextFiles = [...files, ...selectedFiles]
            onFilesChange(nextFiles)

            event.currentTarget.value = ''
            onChange?.(event)
        }

        const removeFile = (fileIndex: number) => {
            const nextFiles = files.filter(
                (_, currentFileIndex) => currentFileIndex !== fileIndex,
            )
            onFilesChange(nextFiles)
        }

        return (
            <div className={clsx('space-y-4', className)}>
                <UploadFileHeader
                    inputId={inputId}
                    label={label}
                    description={description}
                />

                <input
                    {...props}
                    ref={ref}
                    id={inputId}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    className="sr-only"
                />

                <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3">
                    <UploadFileList files={files} onRemove={removeFile} />
                </div>
            </div>
        )
    },
)

UploadFile.displayName = 'UploadFile'