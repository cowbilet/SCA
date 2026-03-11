import { useForm } from "@tanstack/react-form"
import { CreateLogEntrySchema } from "@/types/schemas/log"
import { HTMLAttributes } from "react"
import { useCreateLogEntry } from "../hooks/useCreateLogEntry"
import { useParams } from "@tanstack/react-router"
export default function CreateActivityForm({onSubmit, ...props}: HTMLAttributes<HTMLFormElement>) {
    const { award, challenge } = useParams({strict: true, from: "/student/$award/$challenge"})
    const { mutate: createLogEntry, isError, error } = useCreateLogEntry({ award, challenge })
    const form = useForm({
        defaultValues: {
            date: '',
            description: '',
        },
        validators: {
            onSubmit: CreateLogEntrySchema,
        },
        onSubmit: async (event) => {
            createLogEntry(event.value)
        }
    })
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
            if (onSubmit) {
                onSubmit(e)
            }
        }} className="flex flex-col gap-4" {...props}>
            <form.Field name="date">
                {(field) => (
                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Date</label>
                        <input 
                            type="date"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="border border-gray-300 rounded px-3 py-2"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((error) => error?.message).join(', ')}</span>
                        )}
                    </div>
                )}
                </form.Field>
            <form.Field name="description">
                {(field) => (
                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Description</label>
                        <textarea 
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="border border-gray-300 rounded px-3 py-2 resize-y"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((error) => error?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            {/* //TODO: Add error handling for submission failure (e.g. network error, server error) */}
            {isError && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error instanceof Error ? error.message : 'An error occurred while submitting your proposal. Please try again.'}
                </div>
            )}
        </form>
    )
}