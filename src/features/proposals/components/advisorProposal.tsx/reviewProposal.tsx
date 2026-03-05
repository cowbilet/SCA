import ProposalForm from "../proposalForm";
import { Proposal } from "@/types/schemas/proposal";
import { useForm } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import { useReviewProposal } from "../../hooks/useReviewProposal";
import { Comments } from "../notifications";
import { useSession } from "@/integrations/better-auth/authClient";
import { Award } from "@/types/awards";
import { useProposal } from "../../hooks/useProposal";
export default function ReviewProposal() {
    const { data } = useSession()
    const { studentId, award, challenge } = useParams({ strict: false })
    const { data: proposal, isError, isLoading } = useProposal(award! as Award, challenge!, studentId!)
    if (!data || !data.user || !studentId || !award || !challenge) {
        return null
    }
    const { user } = data
    const isMentor = user.role === "mentor"
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError || !proposal) {
        return <div>Error loading proposal. Please try again later.</div>
    }
    return (
        <div className="flex flex-col h-full flex-1 gap-4">
            <Comments proposal={proposal} />
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
    const { award, challenge, studentId } = useParams({strict: false})
    if (!award || !challenge || !studentId) {
        return null
    }
    //TODO: Fix the type here
    const { mutate: submitProposal, isPending } = useReviewProposal(studentId, award as Award, challenge)
    const form = useForm({
        defaultValues: {
            feedback: '',
        },
        onSubmit: async ({value}) => {
            const {feedback} = value
            //Get the button that was clicked (approve or reject) and the feedback from the form
            const action = (document.activeElement as HTMLButtonElement).id
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