import { useRef } from "react";
import { FileWarningIcon, Trash, TriangleAlert } from "lucide-react";
import type { LogEntry } from "@/types/schemas/log";
import Dialog, { DialogBody, DialogFooter, DialogHeader } from "@/components/dialog";

export function DeleteActivity({log}: {log: LogEntry}) {
    const modalRef = useRef<HTMLDialogElement>(null)
    return (
        <Dialog
            ref={modalRef}
            trigger={(setIsOpen) => ( 
                <button onClick={() => setIsOpen(true)} className=" text-red-500 font-bold rounded w-5 h-5 flex items-center justify-center hover:cursor-pointer"><Trash /></button>
            )}
        >
            <DialogHeader className="flex-row items-center!">
                <TriangleAlert className="w-6 h-6 text-red-500" />
                <h2 className="text-lg font-semibold">Delete Activity</h2>

            </DialogHeader>
            <DialogBody>
                <div className="flex flex-col gap-2 bg-red-50 border border-red-700 p-4 rounded">
                    <p className="text-black"><span className="font-bold">WARNING: </span>Are you sure you want to delete this activity?</p>
                    <p className="text-black">This action cannot be undone and may affect your progress towards your goal.</p>

                </div>
            </DialogBody>
            <DialogFooter className="justify-end">
                <button onClick={() => modalRef.current?.close()} className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 transition hover:cursor-pointer">
                    Cancel
                </button>
                <button form="create-activity-form" className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition hover:cursor-pointer">
                    Delete
                </button>
            </DialogFooter>
        </Dialog>
    )
}
