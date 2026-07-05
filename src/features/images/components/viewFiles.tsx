import { useRef } from 'react'
import { File } from 'lucide-react';
import { useFiles } from '../hooks/useLogFiles';
import type { LogEntry } from '@/types/schemas/log';
import Dialog, {
    DialogBody,
    DialogFooter,
    DialogHeader,
} from '@/components/dialog'


export function ViewFiles({log}: {log: LogEntry}) {
    if (log.files.length === 0) {
        return null
    }
    return <ViewFilesDialog log={log} />
}

function ViewFilesDialog({log}: {log: LogEntry}) {
    const modalRef = useRef<HTMLDialogElement>(null)
    const { data: files } = useFiles(log.award, log.challenge, log.logId, true)
    return (
        <Dialog
            ref={modalRef}
            trigger={(setIsOpen) => (
                <button
                    onClick={() => setIsOpen(true)}
                    className=" text-green-500 font-bold rounded w-5 h-5 flex items-center justify-center hover:cursor-pointer"
                >
                    <File />
                </button>
            )}
        >
            <DialogHeader>
                <h2 className="text-lg font-semibold">View Files</h2>
            </DialogHeader>
            <DialogBody>
                {files?.map((file) => (
                    <a
                        key={file}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <File className="w-4 h-4 inline mr-2" />
                        {file.split('/').slice(-1)[0].split("?")[0]}
                    </a>
                ))}
            </DialogBody>
            <DialogFooter className="justify-end">
                <button
                    onClick={() => modalRef.current?.close()}
                    className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 transition"
                >
                    Close
                </button>
            </DialogFooter>
        </Dialog>
    )
}