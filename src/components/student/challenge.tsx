import { BookOpen, HandPlatter, Users, Zap } from 'lucide-react'
import MainHeaderShell from '../mainHeaderShell'
import type { Challenge } from '@/types/challenges'

interface ChallengeProps {
    challenge: Challenge
    children?: React.ReactNode
}
export default function ChallengeShell({
    challenge,
    children,
}: ChallengeProps) {
    return (
        <div className="flex flex-col h-full">
            <ChallengeHeader challenge={challenge} />
            <div className="flex-1 p-4 flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    )
}
const iconStyle = 'h-12 w-12 text-white bg-white/20 rounded p-2'
const ChallengeStyles: Record<
    Challenge,
    { title: string; style: string; icon: React.ReactNode }
> = {
    relationships: {
        title: 'Relationships',
        style: 'bg-blue-500',
        icon: <Users className={iconStyle} />,
    },
    challenge: {
        title: 'Challenge',
        style: 'bg-green-500',
        icon: <Zap className={iconStyle} />,
    },
    community: {
        title: 'Community',
        style: 'bg-red-500',
        icon: <BookOpen className={iconStyle} />,
    },
    service: {
        title: 'Service',
        style: 'bg-purple-500',
        icon: <HandPlatter className={iconStyle} />,
    },
}
function ChallengeHeader({ challenge }: ChallengeProps) {
    const { title, style, icon } = ChallengeStyles[challenge]
    return (
        <MainHeaderShell
            title={title}
            icon={icon}
            description={`View your progress and awards for the ${title} challenge.`}
            className={style}
        />
    )
}
