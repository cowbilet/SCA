import Dialog from "@/components/dialog"
import { DialogBody, DialogFooter, DialogHeader } from "@/components/dialog"
import { Target, Clipboard } from "lucide-react"
import { Comments } from "./notifications"
import { useProposal } from "../hooks/useProposal"
import { useParams } from "@tanstack/react-router"
import { useSession } from "@/integrations/better-auth/authClient"
export function ViewProposal() {
    const {data: user} = useSession()
    const {award, challenge} = useParams({strict: false})
    //This is never false however, but if it is then we break the rules of hook
    if (!user || !user.user || !award || !challenge) {
        return null
    }
    const {data: proposal, isLoading, isError} = useProposal(award, challenge, user.user.id)
    return (
        <Dialog
            trigger={(setIsOpen) => (
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    View Proposal
                </button>
            )}
        >
            <DialogHeader className="flex flex-row gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                <span>Proposal Details</span>
            </DialogHeader>

            <DialogBody className="p-8">
                {/* TODO: This styling is pretty rough... */}
                {
                    proposal ? (
                        <div className="space-y-4">
                            <Comments proposal={proposal} />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900"><Clipboard className="h-5 w-5 inline mr-2" />Description</h3>
                                <p className="mt-1 text-sm text-gray-700">{proposal.description}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 flex flex-row items-center"><Target className="h-5 w-5 inline mr-2" />Goals and Objectives</h3>
                                <p className="mt-1 text-sm text-gray-700">{proposal.goal}</p>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <p className="text-sm text-gray-500">Loading proposal...</p>
                    ) : isError ? (
                        <p className="text-sm text-gray-500">Error loading proposal.</p>
                    ) : (
                        <p className="text-sm text-gray-500">No proposal found for this award and challenge.</p>
                    )
                }
            </DialogBody>
            <DialogFooter>
                {/* You can add actions here if needed */}
            </DialogFooter>
        </Dialog>
    )
}