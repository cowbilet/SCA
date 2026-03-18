import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import type {HTMLAttributes} from "react"
import type { LogEntry } from "@/types/schemas/log"
import { CreateLogEntrySchema } from "@/types/schemas/log"

export default function ActivityForm({log, onSubmit, ...props}: {log?: LogEntry} & HTMLAttributes<HTMLFormElement>) {
    const [error, setError] = useState<string | null>(null)
    const form = useForm({
        defaultValues: {

            date: new Date(log?.date || Date.now()).toISOString().split("T")[0], // Format date as YYYY-MM-DD for input value
            description: log?.description || '',
        },
        validators: {
            onSubmit: CreateLogEntrySchema,
        },
    })
    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            await form.handleSubmit()
            if (form.state.isValid) {
                setError(null)
                if (onSubmit) {
                    try {
                        onSubmit(e)
                    }
                    catch (err) {
                        setError(err instanceof Error ? err.message : "An unknown error occurred.")
                    }
                }
            }

        }} className="flex flex-col gap-4" {...props}>
            <form.Field name="date">
                {(field) => (
                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Date</label>
                        <input 
                            type="date"
                            name="date"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="border border-gray-300 rounded px-3 py-2"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((fieldError) => fieldError?.message).join(', ')}</span>
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
                            name="description"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="border border-gray-300 rounded px-3 py-2 resize-y"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((fieldError) => fieldError?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            {/* //TODO: Add error handling for submission failure (e.g. network error, server error) */}
            {error !== null && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
        </form>
    )
}