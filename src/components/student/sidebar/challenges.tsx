import { BookOpen, HandPlatter, Users, Zap } from 'lucide-react'
import { Link, useMatchRoute, useParams } from '@tanstack/react-router'
import Skeleton from 'react-loading-skeleton'
import { H1Title } from '../../titles'
import type { SubmissionState } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import { Route } from '@/routes/student/route'
import { useProposal } from '@/features/proposals/hooks/useProposal'
// TODO: Clean this up
const challenges: Record<
    Challenge,
    {
        title: string
        iconStyle: string
        cardStyle: string
        icon: React.ReactNode
    }
> = {
    relationships: {
        title: 'Relationships',
        iconStyle: 'text-blue-500 border-blue-500',
        cardStyle: 'bg-blue-500/25 border-blue-500! hover:bg-blue-500/25!',
        icon: <Users />,
    },
    challenge: {
        title: 'Challenge',
        iconStyle: 'text-green-500 border-green-500',
        cardStyle: 'bg-green-500/25 border-green-500! hover:bg-green-500/25!',
        icon: <Zap />,
    },
    community: {
        title: 'Community',
        iconStyle: 'text-red-500 border-red-500',
        cardStyle: 'bg-red-500/25 border-red-500! hover:bg-red-500/25!',
        icon: <BookOpen />,
    },
    service: {
        title: 'Service',
        iconStyle: 'text-purple-500 border-purple-500',
        cardStyle:
            'bg-purple-500/25 border-purple-500! hover:bg-purple-500/25!',
        icon: <HandPlatter />,
    },
}

export default function SidebarChallenges() {
    return (
        <div className="w-full border-b flex-1 border-gray-200 mb-4 p-4">
            <H1Title title="Challenges" />
            <div className="flex flex-col items-center justify-center gap-4">
                {(Object.keys(challenges) as Array<Challenge>).map(
                    (challenge) => (
                        <ActivityCard
                            key={challenge}
                            title={challenges[challenge].title}
                            challenge={challenge}
                            iconStyle={challenges[challenge].iconStyle}
                            className={challenges[challenge].cardStyle}
                            icon={challenges[challenge].icon}
                        />
                    ),
                )}
            </div>
        </div>
    )
}
interface SidebarCardProps {
    title: string
    iconStyle: string
    className?: string
    challenge: Challenge
    icon: React.ReactNode
}

const lockedStyle =
    'opacity-50 hover:cursor-not-allowed hover:shadow-none hover:bg-transparent'
function ActivityCard({
    title,
    iconStyle,
    challenge,
    className,
    icon,
}: SidebarCardProps) {
    const matchRoute = useMatchRoute()
    const isAwardIndex = matchRoute({
        to: '/student/$award',
        fuzzy: true,
    })
    if (!isAwardIndex) {
        return (
            <GenericActivityCard
                title={title}
                iconStyle={iconStyle}
                icon={icon}
                className={lockedStyle}
            />
        )
    }
    return (
        <ActiveActivityCard
            title={title}
            iconStyle={iconStyle}
            challenge={challenge}
            icon={icon}
            className={className}
        />
    )
}
interface ActiveActivityCardProps extends GenericSidebarCardProps {
    challenge: Challenge
}
const ChallengeStatuses: Record<SubmissionState, React.ReactNode> = {
    'not started': 'Not started',
    'pending assessor': 'Pending assessor review',
    'pending mentor': 'Pending mentor review',
    'rejected assessor': 'Rejected by assessor',
    'rejected mentor': 'Rejected by mentor',
    withdrawn: 'Withdrawn',
    completed: 'Completed',
}
// Has to be a seperate component otherwhise there will be more hooks called in the component than in the parent which causes rules of hooks errors
function ActiveActivityCard({
    title,
    iconStyle,
    challenge,
    icon,
    className,
}: ActiveActivityCardProps) {
    const params = useParams({ from: '/student/$award', strict: true })
    const { user } = Route.useRouteContext()
    const {
        data: proposal,
        isLoading: isProposalLoading,
        isError: isProposalError,
    } = useProposal(params.award, challenge, user.userId)
    const status = isProposalLoading ? (
        <Skeleton />
    ) : isProposalError ? (
        'Error loading challenge status'
    ) : (
        (ChallengeStatuses[proposal?.status ?? 'not started'] ??
        'Unknown status')
    )
    return (
        <Link
            to="/student/$award/$challenge"
            params={{
                award: params.award,
                challenge: challenge,
            }}
            draggable={false}
            className="w-full"
        >
            {({ isActive }) => (
                <GenericActivityCard
                    title={title}
                    iconStyle={iconStyle}
                    icon={icon}
                    className={isActive ? className : ''}
                    status={status}
                />
            )}
        </Link>
    )
}
interface GenericSidebarCardProps {
    title: string
    iconStyle: string
    icon: React.ReactNode
    className?: string
    status?: React.ReactNode
}
function GenericActivityCard({
    title,
    iconStyle,
    icon,
    className,
    status,
}: GenericSidebarCardProps) {
    return (
        <div
            className={`w-full border-2 transition duration-150 flex-1 border-gray-400 p-4 rounded-lg flex items-center space-x-2 cursor-pointer hover:shadow-lg hover:bg-gray-100 text-white
                ${className}
            `}
        >
            <div className={`p-2 rounded-full border-2  ${iconStyle} mr-2`}>
                {icon}
            </div>
            <div className="flex flex-col">
                <H1Title title={title} />
                <p className="text-gray-500 text-xs min-h-5">{status}</p>
            </div>
        </div>
    )
}
