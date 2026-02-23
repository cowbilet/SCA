import ProposalForm from "../proposalForm";
import { Proposal } from "@/types/schemas/proposal";
export default function ReviewProposal({proposal}: {proposal: Proposal}) {
    return (
        <ProposalForm
            values={proposal}
            disabled={true}
            award={proposal.award}
            challenge={proposal.challenge}
        />
    )
}