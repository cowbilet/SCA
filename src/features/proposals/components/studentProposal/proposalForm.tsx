import { FieldApi, useForm } from '@tanstack/react-form'
import { CreateProposalSchema } from '../../types/forms'
export default function ProposalForm() {
    const form = useForm({
        defaultValues: {
            title: '',
            description: '',
            goals: '',
        },
        validators: {
            onSubmit: CreateProposalSchema,
        }
    })
    return (
        <form 
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="flex flex-col gap-4 p-4 flex-1"
        >
            <form.Field name="title">
                {(field) => (
                    <div className="flex flex-col">
                        <FormLabel>Proposal Title</FormLabel>
                        <input 
                            type="text"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="border border-gray-300 rounded p-2"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((error) => error?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            <form.Field name="description">
                {(field) => (
                    <div className="flex flex-col flex-1">
                        <FormLabel>Proposal Description</FormLabel>
                        <textarea
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="border border-gray-300 rounded p-2 flex-auto resize-y"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((error) => error?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            <form.Field name="goals">
                {(field) => (
                    <div className="flex flex-col flex-1">
                        <FormLabel>Goals and Objectives</FormLabel>
                        <textarea
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="border border-gray-300 rounded p-2 flex-auto resize-y"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((error) => error?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
            >
                Submit Proposal
            </button>
        </form>
    )
}
function FormLabel({children}: {children: React.ReactNode}) {
    return (
        <label className="text-gray-600 text-base mb-1">
            {children}*
        </label>
    )
}