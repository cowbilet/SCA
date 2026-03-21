import { useForm } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import ProposalForm from "../proposalForm";
import { useReviewProposal } from "../../hooks/useReviewProposal";
import { useProposal } from "../../hooks/useProposal";
import { ReviewProposalFeedbackSchema } from "../../types/schema/forms";

import Feedback from "@/components/feedback";

export default function ReviewProposal() {
    const { advisor, studentId, award, challenge } = useParams({ from: "/$advisor/$studentId/$award/$challenge", strict: true })
    const { data: proposal, isError, isLoading } = useProposal(award, challenge, studentId)

    const isMentor = advisor === "mentor"
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError || !proposal) {
        return <div>Error loading proposal. Please try again later.</div>
    }
    return (
        <div className="flex flex-col h-full flex-1 gap-4">
            {/* TODO: Should show instructions for the advisors */}
            <Feedback status={proposal.status} mentorNote={proposal.mentorNote} assessorNote={proposal.assessorNote} />
            <ProposalForm
                values={proposal}
                disabled={true}
                award={proposal.award}
                challenge={proposal.challenge}
            />
            {isMentor && proposal.status === "pending mentor" && <ProposalFeedbackForm />}
            {!isMentor && proposal.status === "pending assessor" && <ProposalFeedbackForm />}
            
        </div>
    )
}
function ProposalFeedbackForm() {
    const { award, challenge, studentId } = useParams({from: "/$advisor/$studentId/$award/$challenge", strict: true})
    const { mutateAsync: submitProposal } = useReviewProposal(studentId, award, challenge)
    const [decision, setDecision] = useState<boolean | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const form = useForm({
        defaultValues: {
            feedback: '',
        },
        validators: {
            onSubmit: ReviewProposalFeedbackSchema,
        },
        onSubmit: async ({value}) => {
            const {feedback} = value
            if (decision === null) {
                setSubmitError("Choose approve or reject before submitting feedback.")
                return
            }
            setSubmitError(null)
            await submitProposal({ notes: feedback, accepted: decision })
        }
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
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((validationError) => validationError?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            {submitError && (
                <p className="text-red-500 text-sm mb-3">{submitError}</p>
            )}
            <button id="reject" type="submit" onClick={() => setDecision(false)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-150">
                Reject Proposal
            </button>
            <button id="approve" type="submit" onClick={() => setDecision(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-150 ml-2">
                Approve Proposal
            </button>
        </form>
    )
}