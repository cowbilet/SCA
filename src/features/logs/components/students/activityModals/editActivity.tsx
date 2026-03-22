import { useRef } from 'react'
import { Pencil } from 'lucide-react'
import EditActivityForm from './forms/editActivityForm'
import type { LogEntry } from '@/types/schemas/log'
import Dialog, {
    DialogBody,
    DialogFooter,
    DialogHeader,
} from '@/components/dialog'

export function EditActivity({ log }: { log: LogEntry }) {
    const modalRef = useRef<HTMLDialogElement>(null)
    return (
        <Dialog
            ref={modalRef}
            trigger={(setIsOpen) => (
                <button
                    onClick={() => setIsOpen(true)}
                    className=" text-blue-500 font-bold rounded w-5 h-5 flex items-center justify-center hover:cursor-pointer"
                >
                    <Pencil />
                </button>
            )}
        >
            <DialogHeader className="flex-row items-center!">
                <Pencil className="w-6 h-6 text-blue-500" />
                <h2 className="text-lg font-semibold">Edit Activity</h2>
            </DialogHeader>
            <DialogBody>
                <EditActivityForm
                    log={log}
                    onSubmit={() => {
                        modalRef.current?.close()
                    }}
                />
            </DialogBody>
            <DialogFooter className="justify-end">
                <button
                    onClick={() => modalRef.current?.close()}
                    className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 transition hover:cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    form="edit-activity-form"
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition hover:cursor-pointer"
                >
                    Edit
                </button>
            </DialogFooter>
        </Dialog>
    )
}
