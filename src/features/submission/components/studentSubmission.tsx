import { ButtonHTMLAttributes, useRef } from "react";
import Dialog from "@/components/dialog";
import { DialogHeader, DialogBody, DialogFooter } from "@/components/dialog";

export function StudentSubmission() {
    const modalRef = useRef<HTMLDialogElement>(null)
    return (
        <Dialog
            ref={modalRef}
            trigger={(setIsOpen) => ( 
                <CreateActivityButton onClick={() => setIsOpen(true)} />
            )}
        >
            <DialogHeader>
                <h2 className="text-lg font-semibold">Confirm Submit Activity</h2>
            </DialogHeader>
            <DialogBody>
                <p className="text-gray-600">Are you sure you want to submit this activity? Once submitted, your mentor will review it and provide feedback.</p>
            </DialogBody>
            <DialogFooter className="justify-end">
                <button onClick={() => modalRef.current?.close()} className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 transition">
                    Cancel
                </button>
                <button className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition">
                    Confirm
                </button>
            </DialogFooter>
        </Dialog>
    )
}
function CreateActivityButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition" {...props}>
            Submit Activity
        </button>
    )
}
