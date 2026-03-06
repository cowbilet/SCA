import { useForm } from "@tanstack/react-form"
import { CreateLogEntrySchema } from "@/types/schemas/log"
import { HTMLAttributes } from "react"
export default function CreateActivityForm(props: HTMLAttributes<HTMLFormElement>) {
    const form = useForm({
        defaultValues: {
            date: '',
            description: '',
        },
        validators: {
            onSubmit: CreateLogEntrySchema,
        },
    })
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
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
        </form>
    )
}