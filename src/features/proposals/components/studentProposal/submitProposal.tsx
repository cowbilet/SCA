import { Card } from "@/components/card";
import { NotificationBody, NotificationHeader, Notification } from "@/components/notification";
import ProposalForm from "./proposalForm";
import { SubmissionState } from "@/types/awards";

export default function SubmitProposal({proposalStatus}: {proposalStatus: SubmissionState}) {
    return (
        <Card className="h-full flex flex-col">
            <Notification className="bg-blue-100 border-blue-500">
                <NotificationHeader className="text-blue-700 font-bold text-lg">
                    📋 Step 1: Create Your Proposal
                </NotificationHeader>
                <NotificationBody className="text-blue-700">
                    Before you can start logging activities, you need to submit a proposal describing what you plan to do. Your mentor will review it first, and if approved, it will be sent to the assessor for final approval.
                </NotificationBody>
            </Notification>
            <ProposalForm />
        </Card>
    )
}
