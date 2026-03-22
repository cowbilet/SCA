import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

export default function FeedbackForm({
    onValidSubmit,
}: {
    onValidSubmit: (data: {
        feedback: string
        accepted: boolean
    }) => Promise<void>
}) {
    const [decision, setDecision] = useState<boolean | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const form = useForm({
        defaultValues: {
            feedback: '',
        },
        validators: {
            onSubmit: z.object({
                feedback: z.string().trim().min(1, 'Feedback is required'),
            }),
        },
        onSubmit: async ({ value }) => {
            const { feedback } = value
            if (decision === null) {
                setSubmitError(
                    'Choose approve or reject before submitting feedback.',
                )
                return
            }
            setSubmitError(null)
            await onValidSubmit({ feedback, accepted: decision })
        },
    })
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
        >
            <form.Field name="feedback">
                {(field) => (
                    <div className="flex flex-col">
                        <textarea
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full border-2 border-gray-400 p-2 rounded-lg mb-4"
                            placeholder="Enter feedback for the student..."
                            rows={5}
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">
                                {field.state.meta.errors
                                    .map(
                                        (validationError) =>
                                            validationError?.message,
                                    )
                                    .join(', ')}
                            </span>
                        )}
                    </div>
                )}
            </form.Field>
            {submitError && (
                <p className="text-red-500 text-sm mb-3">{submitError}</p>
            )}
            <button
                id="reject"
                type="submit"
                onClick={() => setDecision(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-150"
            >
                Reject Proposal
            </button>
            <button
                id="approve"
                type="submit"
                onClick={() => setDecision(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-150 ml-2"
            >
                Approve Proposal
            </button>
        </form>
    )
}
