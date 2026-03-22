import { useRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import Dialog, { DialogBody, DialogFooter, DialogHeader } from "@/components/dialog";

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
                <h2 className="text-lg font-semibold">Submit Activity</h2>
            </DialogHeader>
            <DialogBody>
                <p className="text-gray-600 mb-4">Please fill out the reflection below to submit your activity for this challenge.</p>
                <form id="submission-form" className="flex flex-col gap-4">
                    <label htmlFor="reflection" className="text-sm font-medium text-gray-700">Reflection</label>
                    <textarea id="reflection" name="reflection" rows={4} className=" p-2 mt-1 block w-full rounded-md border border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </form>
            </DialogBody>
            <DialogFooter className="justify-end">
                <button onClick={() => modalRef.current?.close()} className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 transition">
                    Cancel
                </button>
                <button form="submission-form" type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition">
                    Submit
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
