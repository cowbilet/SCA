import { useParams } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { clsx } from "clsx";
import ProposalForm from "../proposalForm";
import {Comments, Instructions} from "../notifications";
import type { SubmissionState } from "@/types/awards";
import { Card } from "@/components/card";
import { useProposal } from "@/features/proposals/hooks/useProposal";
import { useSession } from "@/integrations/better-auth/authClient";

export function SubmitProposal({proposalStatus}: {proposalStatus: SubmissionState}) {
    return (
        <Card className="h-full flex flex-col">
            <Instructions state={proposalStatus} />
            <ProposalForm 
                Button={SubmitButton}
            />
        </Card>
    )
}
const disabledStates: Array<SubmissionState> = ['pending mentor', 'pending assessor']
export function ActiveProposal({proposalStatus}: {proposalStatus: SubmissionState}) {
    const { award, challenge } = useParams({ from: '/student/$award/$challenge', strict: true })
    const { data } = useSession()
    if (!data) {
        throw new Error("User data is required to view proposal.")
    }
    const {data: proposalData, isLoading, isError} = useProposal(award, challenge, data.user.id)
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
            <Instructions state={proposalStatus} />
            {proposalStatus !== "pending mentor" && <Comments proposal={proposalData} />}
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
            className={clsx("bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center", {
                "opacity-50 hover:cursor-not-allowed": isPending || isDisabled,
            })}
            disabled={isPending || isDisabled}
        >
            {isPending ? <LoaderCircle className="animate-spin" /> : 'Submit Proposal'}
        </button>
    )
}