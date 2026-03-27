import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

export default function FeedbackForm({
    onValidSubmit,
    className,
    isLoading,
    isError,
    error,

    ...props
}: {
    onValidSubmit: (data: {
        feedback: string
        accepted: boolean
    }) => Promise<void>
    isLoading?: boolean
    isError?: boolean
    error?: string
    className?: string
} & HTMLAttributes<HTMLFormElement>) {
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
            className={className}
            {...props}
        >
            <form.Field name="feedback">
                {(field) => (
                    <div className="flex flex-col">
                        <textarea
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={clsx(
                                'w-full border-2 border-gray-400 p-2 rounded-lg mb-4',
                                {
                                    isLoading: 'opacity-50 cursor-not-allowed',
                                    isError: 'border-red-500',
                                },
                            )}
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
            {isError && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
                id="reject"
                type="submit"
                onClick={() => setDecision(false)}
                className={clsx(
                    'bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-150',
                    { isLoading: 'opacity-50 cursor-not-allowed' },
                )}
            >
                Reject
            </button>
            <button
                id="approve"
                type="submit"
                onClick={() => setDecision(true)}
                className={clsx(
                    'bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-150 ml-2',
                    { isLoading: 'opacity-50 cursor-not-allowed' },
                )}
            >
                Approve
            </button>
        </form>
    )
}
