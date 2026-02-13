import { useForm } from '@tanstack/react-form'
import { CreateProposalSchema } from '../../types/schema/forms'
import { useParams } from '@tanstack/react-router'
import { getUserByEmail } from '@/api/users'
import { useCreateChallenge } from '../../hooks/useCreateChallenge'
import { clsx } from 'clsx'
import { LoaderCircle } from 'lucide-react'

export default function ProposalForm() {
    const { award, challenge } = useParams({ from: '/student/$award/$challenge', strict: true })
    const { mutate: createChallenge, isPending, isError } = useCreateChallenge(award, challenge)
    const form = useForm({
        defaultValues: {
            mentorEmail: '',
            description: '',
            goal: '',
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
            <form.Field name="goal">
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
                className={clsx("bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition", {
                    "opacity-50 hover:cursor-not-allowed": isPending,
                })}
            >
                {isPending ? <LoaderCircle className="animate-spin" /> : 'Submit Proposal'}
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