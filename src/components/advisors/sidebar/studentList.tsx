import { Award } from "@/types/awards"
import { usePendingProposals } from "@/hooks/usePendingProposals"
import Skeleton from "react-loading-skeleton"
import { ProposalWithStudent } from "@/types/schemas/proposal"
import { Challenge } from "@/types/challenges"
import { Link } from "@tanstack/react-router"
import { capitalizeFirstLetter } from "@/utils/stringUtils"
import { User } from "@/types/schemas/users"
import { useParams } from "@tanstack/react-router"
import { useStudents } from "@/hooks/useStudents"
export default function StudentList() {

    const {data: pendingProposals, isLoading, isError} = usePendingProposals()
    const {data: students, isLoading: isStudentsLoading, isError: isStudentsError} = useStudents()
    return (
        <div className="w-full h-full flex flex-col p-4 gap-4">
            <p className="text-gray-500 font-semibold">Pending</p>
            <div className="flex flex-col gap-4">
                {
                    (() => {
                        if (isLoading) {
                            return <Skeleton count={3} height={80} className="mb-2" />
                        }
                        if (isError) {
                            return (
                                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                    Error loading pending proposals. Please try again later.
                                </div>
                            )
                        }
                        if (pendingProposals && pendingProposals.length > 0) {
                            return pendingProposals.map((proposal) => (
                                <PendingListItem proposal={proposal} key={`${proposal.student.userId}-${proposal.proposal.award}-${proposal.proposal.challenge}`} />
                            ))
                        }
                    })()
                }
                
            </div>
            <p className="text-gray-500 font-semibold">Students</p>
            <div className="flex flex-col gap-4">
                {
                    (() => {
                        if (isStudentsLoading) {
                            return <Skeleton count={3} height={80} className="mb-2" />
                        }
                        if (isStudentsError) {
                            return (
                                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                    Error loading students. Please try again later.
                                </div>
                            )
                        }
                        if (students && students.length > 0) {
                            return students.map((student) => (
                                <StudentListItem student={student} key={student.userId} />
                            ))
                        }
                    })()
                }
            </div>
        </div>
    )
}
function StudentListItem({student}: {student: User}) {
    const { advisor } = useParams({from: "/$advisor", strict: true})
    return (
        <Link to="/$advisor/$studentId" params={{advisor, studentId: student.userId}} key={student.userId} className="w-full border-2 gap-1 transition duration-150 flex-1 border-gray-400 p-4 rounded-lg flex flex-col space-x-2 cursor-pointer hover:shadow-lg hover:border-purple-500 text-white">
            <div className="flex items-center gap-2">
                <h1 className="text-base font-bold mr-0 text-black">{student.name}</h1>
            </div>
            <p className="text-gray-500 text-xs min-h-5">
                {student.email}
            </p>
        </Link>
    )
}
function PendingListItem({proposal}: {proposal: ProposalWithStudent}) {
    const { advisor } = useParams({from: "/$advisor", strict: true})
    return (
        <Link to="/$advisor/$studentId/$award/$challenge" params={{advisor, studentId: proposal.student.userId, award: proposal.proposal.award, challenge: proposal.proposal.challenge}} activeProps={{className: "border-purple-500 border-2"}} className="w-full border-2 gap-1 transition duration-150 flex-1 border-gray-400 p-4 rounded-lg flex flex-col space-x-2 cursor-pointer hover:shadow-lg hover:border-purple-500 text-white">

            <div className="flex items-center gap-2">
                <h1 className="text-base font-bold mr-0 text-black">{proposal.student.name}</h1>

            </div>
            <p className="text-gray-500 text-xs min-h-5">
                {proposal.student.email}
            </p>
            <div className="flex flex-row justify-start gap-2">
                <ChallengeTag challenge={proposal.proposal.challenge} />
                <AwardTag award={proposal.proposal.award} />
                <PendingProposalTag />
            </div>

        </Link>
    )
}
function PendingProposalTag() {
    return (
        <span className="text-yellow-700 bg-yellow-100 border border-yellow-500 px-2 py-1 rounded text-xs font-semibold">
            Proposal
        </span>
    )
}
function ChallengeTag({challenge}: {challenge: Challenge}) {
    return (
        <span className={`text-gray-700 bg-gray-100 border ${challenge} px-2 py-1 rounded text-xs font-semibold`}>
            {capitalizeFirstLetter(challenge)}
        </span>
    )
}

function AwardTag({award}: {award: Award}) {
    return (
        <span className={`text-white bg-linear-to-r ${award} px-2 py-1 rounded text-xs font-semibold`}>
            {capitalizeFirstLetter(award)}
        </span>
    )
}