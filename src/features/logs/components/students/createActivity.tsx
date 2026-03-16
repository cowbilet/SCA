import { useRef } from "react";
import CreateActivityForm from "./createActivityForm";
import type { ButtonHTMLAttributes } from "react";
import Dialog, { DialogBody, DialogFooter, DialogHeader } from "@/components/dialog";

export function CreateActivity() {
    const modalRef = useRef<HTMLDialogElement>(null)
    return (
        <Dialog
            ref={modalRef}
            trigger={(setIsOpen) => ( 
                <CreateActivityButton onClick={() => setIsOpen(true)} />
            )}
        >
            <DialogHeader>
                <h2 className="text-lg font-semibold">Add Activity</h2>
            </DialogHeader>
            <DialogBody>
                <p className="text-gray-600">Record an activity you completed towards your goal</p>
                <CreateActivityForm onSubmit={() => {
                    if (modalRef.current) {
                        modalRef.current.close()
                    }
                }} id="create-activity-form" />  
            </DialogBody>
            <DialogFooter className="justify-end">
                <button onClick={() => modalRef.current?.close()} className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 transition">
                    Cancel
                </button>
                <button form="create-activity-form" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition">
                    Submit
                </button>
            </DialogFooter>
        </Dialog>
    )
}
function CreateActivityButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition" {...props}>
            Add Activity
        </button>
    )
}
