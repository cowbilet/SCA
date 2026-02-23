import { Card } from "@/components/card";
import ProposalForm from "../proposalForm";
import { SubmissionState } from "@/types/awards";
import { useParams } from "@tanstack/react-router";
import { useProposal } from "@/features/proposals/hooks/useProposal";
import { LoaderCircle } from "lucide-react";
import Notifications from "./notifications";
import { clsx } from "clsx";
export function SubmitProposal({proposalStatus}: {proposalStatus: SubmissionState}) {
    return (
        <Card className="h-full flex flex-col">
            <Notifications state={proposalStatus} />
            <ProposalForm 
                disabled={true}
                Button={SubmitButton}
            />
        </Card>
    )
}
const disabledStates: SubmissionState[] = ['pending mentor', 'pending assessor']
export function ActiveProposal({proposalStatus}: {proposalStatus: SubmissionState}) {
    const { award, challenge } = useParams({ from: '/student/$award/$challenge', strict: true })
    const {data: proposalData, isLoading, isError} = useProposal(award, challenge)
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoaderCircle className="animate-spin text-gray-500" size={48} />
            </div>
        )
    }
    if (isError || !proposalData) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error loading proposal data. Please try again later.
            </div>
        )
    }
    return (
        <Card className="h-full flex flex-col">
            <Notifications proposal={proposalData} state={proposalStatus} />
            <ProposalForm 
                values={proposalData} 
                disabled={disabledStates.includes(proposalStatus)} 
                Button={SubmitButton}
            />
        </Card>
    )
}
function SubmitButton({isDisabled, isPending}: {isDisabled: boolean, isPending: boolean}) {
    return (
        <button
            type="submit"
            className={clsx("bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition", {
                "opacity-50 hover:cursor-not-allowed": isPending || isDisabled,
            })}
            disabled={isPending || isDisabled}
        >
            {isPending ? <LoaderCircle className="animate-spin" /> : 'Submit Proposal'}
        </button>
    )
}