import { useEffect, useRef, useState } from "react"
import { ChevronDown, Circle } from "lucide-react"
import clsx from "clsx"
import type { JSX, ReactNode} from "react";
import type { SubmissionState } from "@/types/awards"

const positiveClass = 'bg-green-500 border-green-500 text-green-500'
const negativeClass = 'bg-red-500 border-red-500 text-red-500'
// TODO: Consider using the pending class
// const pendingClass = 'bg-blue-100 border-blue-500 text-blue-500'

export default function InstructionAndFeedback<T extends {mentorNote: string | null, status: SubmissionState, assessorNote: string | null}>({data, Instructions}: {data: T, Instructions: React.ComponentType<{ status: SubmissionState }>}): JSX.Element {
    return (
    <div className="flex flex-col">
        <Instructions status={data.status} />
        <Feedback data={data} />
    </div>
    )
}
function Feedback<T extends {mentorNote: string | null, assessorNote: string | null, status: SubmissionState}>({data}: {data: T}): Array<ReactNode> {
    const comments: Array<ReactNode> = []
    if (data.status === 'pending mentor' || data.status === 'not started') {
        return comments
    }
    switch (data.status) {
        case 'pending assessor':
            if (data.mentorNote) {
                comments.push(
                    <AccordionFeedback
                        key="mentorFeedback"
                        feedback={data.mentorNote}
                        name="Mentor"
                        className={positiveClass}
                    />

                )
            }
            break
        case 'rejected mentor':
            if (data.mentorNote) {
                comments.push(
                    <AccordionFeedback
                        key="mentorFeedback"
                        feedback={data.mentorNote}
                        name="Mentor"
                        className={negativeClass}
                    />
                )
            }
            break
        case 'rejected assessor':
            if (data.assessorNote) {
                comments.push(
                    <AccordionFeedback
                        key="assessorFeedback"
                        feedback={data.assessorNote}
                        name="Assessor"
                        className={negativeClass}
                    />,
                )
            }
            if (data.mentorNote) {
                comments.push(
                    <AccordionFeedback
                        key="mentorFeedback"
                        feedback={data.mentorNote}
                        name="Mentor"
                        className={positiveClass}
                    />,
                )
            }
            break
        case 'completed':
            if (data.assessorNote) {
                comments.push(
                    <AccordionFeedback
                        key="assessorFeedback"
                        feedback={data.assessorNote}
                        name="Assessor"
                        className={positiveClass}
                    />,
                )
            }
            if (data.mentorNote) {
                comments.push(
                    <AccordionFeedback
                        key="mentorFeedback"
                        feedback={data.mentorNote}
                        name="Mentor"
                        className={positiveClass}
                    />,
                )
            }
            break
    }
    return comments
}
function AccordionFeedback({feedback, name, className}: {feedback?: string, name?: "Mentor" | "Assessor", className?: string}) {
    const [isOpen, setIsOpen] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [height, setHeight] = useState('0px')

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            const textarea = textareaRef.current
            setHeight((textarea.scrollHeight + 2) + 'px')
        } else {
            setHeight('0px')
        }
    }, [isOpen])

    return (
        <div className={clsx("border rounded-md border-gray-300 gap-2 pt-2 px-2 flex flex-col bg-white", { "pb-2": isOpen })}>
            <div className="flex items-center justify-start gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <Circle className={clsx("h-3 w-3 rounded-full", className)} />
                <h2 className="text-lg font-semibold">{name || "Mentor"}</h2>
                <p className="text-sm text-gray-500">{isOpen ? 'View Feedback' : 'Hide Feedback'}</p>
                <ChevronDown className={clsx("h-5 w-5 text-gray-500 ml-auto transition-transform", { "rotate-180": isOpen })} />

            </div>
            {
                feedback && (
                    <div className="transition-all duration-300 overflow-hidden" style={{ height }}>
                        <textarea
                            ref={textareaRef}
                            readOnly
                            value={feedback}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-100 text-gray-700 cursor-text focus:outline-none sm:text-sm resize-none"
                        />
                    </div>
                )
            }
            

        </div>
    )
}