import { useForm } from '@tanstack/react-form'
import { CreateProposalSchema } from '../types/schema/forms'
import { useParams } from '@tanstack/react-router'
import { getUserByEmail } from '@/api/users/getUserByEmail'
import { useCreateChallenge } from '../hooks/useCreateChallenge'
import { clsx } from 'clsx'
import { FunctionComponent } from 'react'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'

interface ProposalFormProps {
    values?: {
        mentorEmail: string,
        description: string,
        goal: string,
    }
    disabled?: boolean,
    Button?: FunctionComponent<{isDisabled: boolean, isPending: boolean}>,
    award?: Award,
    challenge?: Challenge,
}
export default function ProposalForm({values, disabled, Button, award: awardProp, challenge: challengeProp}: ProposalFormProps) {
    let award: Award, challenge: Challenge
    if (awardProp && challengeProp) {
        award = awardProp
        challenge = challengeProp
    } else {
        ({ award, challenge } = useParams({ from: '/student/$award/$challenge', strict: true }))
    }
    const { mutate: createChallenge, isPending, isError, error } = useCreateChallenge(award, challenge)
    const isDisabled = disabled || isPending
    const form = useForm({
        defaultValues: {
            mentorEmail: values?.mentorEmail ?? '',
            description: values?.description ?? '',
            goal: values?.goal ?? '',
        },
        validators: {
            onSubmit: CreateProposalSchema,
            onSubmitAsync: async ({ value }) => {
                const { mentorEmail } = value
                // Validate with zod first to ensure it's a valid email format
                const emailValidation = CreateProposalSchema.shape.mentorEmail.safeParse(mentorEmail)
                if (!emailValidation.success) {
                    return {
                        fields: {
                            mentorEmail: {
                                message: "Invalid email format",
                            }
                        }
                    }
                }

                // Check if the email exists in the database
                try {
                    // If it does not throw an error, we return undefined to indicate successful validation
                    await getUserByEmail({ data: { email: mentorEmail } })
                    return undefined
                }
                catch (error) {                    
                    return {
                        fields: {
                            mentorEmail: {
                                message: "No user found with this email",
                            }
                        }
                    }
                }
            }
        },
        onSubmit: async ({value}) => {
            createChallenge(value)
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
            <form.Field name="mentorEmail">
                {(field) => (
                    <div className="flex flex-col">
                        <FormLabel>Mentor's Email</FormLabel>
                        <input 
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}

                            className={clsx("border border-gray-300 rounded p-2", {
                                "opacity-50 cursor-not-allowed": isDisabled,
                            })}
                            disabled={isDisabled}
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
                            className={clsx("border border-gray-300 rounded p-2 flex-auto resize-y", {
                                "opacity-50 cursor-not-allowed": isDisabled,
                            })}
                            disabled={isDisabled}
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((error) => error?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            <form.Field name="goal">
                {(field) => (
                    <div className="flex flex-col flex-1">
                        <FormLabel>Goals and Objectives</FormLabel>
                        <textarea
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={clsx("border border-gray-300 rounded p-2 flex-auto resize-y", {
                                "opacity-50 cursor-not-allowed": isDisabled,
                            })}
                            disabled={isDisabled}
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
            {Button && <Button isDisabled={isDisabled} isPending={isPending} />}
        </form>
    )
}
export function ProposalFormButton({disabled}: {disabled?: boolean}) {
    return (
        <button
            className={clsx("text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition", {
                "opacity-50 hover:cursor-not-allowed": disabled,
            })}
            disabled={disabled}
        >
            {disabled ? 'Proposal Under Review' : 'Edit Proposal'}
        </button>
    )
}
function FormLabel({children}: {children: React.ReactNode}) {
    return (
        <label className="text-gray-600 text-base mb-1">
            {children}*
        </label>
    )
}