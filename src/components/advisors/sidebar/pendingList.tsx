import Skeleton from 'react-loading-skeleton'
import { clsx } from 'clsx'
import { Link } from '@tanstack/react-router'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import { usePending } from '@/hooks/usePending'
import { useStudentById } from '@/hooks/useStudents'
import { capitalizeFirstLetter } from '@/utils/stringUtils'

export default function PendingList() {
    const { data: pendingItems, isLoading, isError } = usePending()
    return (
        <div className="flex flex-col gap-4">
            {(() => {
                if (isLoading) {
                    return (
                        <Skeleton count={3} height={80} className="mb-2" />
                    )
                }
                if (isError) {
                    return (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            Error loading pending proposals. Please try
                            again later.
                        </div>
                    )
                }
                if (pendingItems && pendingItems.length > 0) {
                    return pendingItems.map((pending) => (
                        <PendingListItem
                            pending={pending}
                            key={`${pending.studentId}-${pending.award}-${pending.challenge}`}
                        />
                    ))
                }
            })()}
        </div>
    )
}
function PendingListItem({
    pending
}: {
    pending: {
        studentId: string,
        award: Award,
        challenge: Challenge,
        type: 'log' | 'proposal' | 'submission',
    }
}) {
    const { data: student, isLoading, isError } = useStudentById(
        pending.studentId,
    )

    const studentName = isLoading
        ? 'Loading student...'
        : isError
          ? 'Error loading student'
          : (student?.name ?? 'Unknown student')

    const studentEmail = isLoading
        ? 'Loading contact...'
        : isError
          ? 'Unable to load student email'
          : (student?.email ?? 'No email available')

    return (
        <Link
            to="./$studentId/$award/$challenge"
            from="/$advisor"
            params={{
                studentId: pending.studentId,
                award: pending.award,
                challenge: pending.challenge,
            }}
            activeProps={{ className: 'border-purple-500 border-2' }}
            className="w-full border-2 gap-1 transition duration-150 flex-1 border-gray-400 p-4 rounded-lg flex flex-col space-x-2 cursor-pointer hover:shadow-lg hover:border-purple-500 text-white"
        >
            <div className="flex items-center gap-2">
                <h1 className="text-base font-bold mr-0 text-black">
                    {studentName}
                </h1>
            </div>
            <p className="text-gray-500 text-xs min-h-5">{studentEmail}</p>
            {isError && (
                <p className="text-red-600 text-xs min-h-5">
                    Student details unavailable. You can still review this proposal.
                </p>
            )}
            <div className="flex flex-row justify-start gap-2">
                <ChallengeTag challenge={pending.challenge} />
                <AwardTag award={pending.award} />
                <PendingTag type={pending.type} />
            </div>
        </Link>
    )
}
const PendingTagColors = {
    proposal: 'text-yellow-700 bg-yellow-100 border-yellow-500',
    submission: 'text-blue-700 bg-blue-100 border-blue-500',
    log: 'text-green-700 bg-green-100 border-green-500',
}
function PendingTag({type}: { type: 'proposal' | 'submission' | 'log' }) {
    return (
        <span className={clsx('text-xs font-semibold px-2 py-1 rounded', PendingTagColors[type])}>
            {capitalizeFirstLetter(type)}
        </span>
    )
}
function ChallengeTag({ challenge }: { challenge: Challenge }) {
    return (
        <span
            className={`text-gray-700 bg-gray-100 border ${challenge} px-2 py-1 rounded text-xs font-semibold`}
        >
            {capitalizeFirstLetter(challenge)}
        </span>
    )
}

function AwardTag({ award }: { award: Award }) {
    return (
        <span
            className={`text-white bg-linear-to-r ${award} px-2 py-1 rounded text-xs font-semibold`}
        >
            {capitalizeFirstLetter(award)}
        </span>
    )
}