import ProposalForm from "../proposalForm";
import { Proposal } from "@/types/schemas/proposal";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Route } from "@/routes/mentor/$studentId/$award/$challenge"
import { useReviewProposal } from "../../hooks/useReviewProposal";
export default function ReviewProposal({proposal}: {proposal: Proposal}) {
    return (
        <div className="flex flex-col h-full flex-1 gap-4">
            <ProposalForm
                values={proposal}
                disabled={true}
                award={proposal.award}
                challenge={proposal.challenge}
            />
            <ProposalFeedbackForm />
        </div>
    )
}
function ProposalFeedbackForm() {
    const { award, challenge, studentId } = Route.useParams()
    const { mutate: submitProposal, isPending } = useReviewProposal(studentId, award, challenge)
    const form = useForm({
        defaultValues: {
            feedback: '',
        },
        onSubmit: async ({value}) => {
            const {feedback} = value
            //Get the button that was clicked (approve or reject) and the feedback from the form
            const action = (document.activeElement as HTMLButtonElement).id
            console.log("Submitting proposal review with action:", action, "and feedback:", feedback, value)
            submitProposal({ notes: feedback, accepted: action === "approve" })
            // Handle approve/reject logic here, using value.feedback for the mentor's feedback
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
                            required
                        />
                    </div>
                )}
            </form.Field>
            <button id="reject" type="submit" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-150">
                Reject Proposal
            </button>
            <button id="approve" type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-150 ml-2">
                Approve Proposal
            </button>
        </form>
    )
}