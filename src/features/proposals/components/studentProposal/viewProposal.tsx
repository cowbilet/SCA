import { Card } from "@/components/card";
import { NotificationBody, NotificationHeader, Notification } from "@/components/notification";
import { useProposal } from "@/features/proposals/hooks/useProposal";
import { SubmissionState } from "@/types/awards";
import { useParams } from "@tanstack/react-router";
import ProposalForm from "./proposalForm";
import { LoaderCircle } from "lucide-react";
export default function ViewProposal({proposalStatus}: {proposalStatus: SubmissionState}) {

    return (
        <Card className="h-full flex flex-col">
            <Notification className="bg-yellow-100 border-yellow-500">
                <NotificationHeader className="text-yellow-700 font-bold text-lg">
                    📋 Step 2: Wait For Mentor Feedback
                </NotificationHeader>
                <NotificationBody className="text-yellow-700">
                    Your proposal has been submitted and is now awaiting review by your mentor. They will provide feedback and either approve it, request changes, or reject it. Once your mentor approves the proposal, it will be sent to the assessor for final approval.
                </NotificationBody>
            </Notification>
            <ViewProposalWithForm proposalStatus={proposalStatus} />
        </Card>
    )
}
function ViewProposalWithForm({proposalStatus}: {proposalStatus: SubmissionState}) {
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
        <ProposalForm values={{mentorEmail: proposalData.mentorId, description: proposalData.description, goal: proposalData.goal}} />
    )
}