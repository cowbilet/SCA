import { H1Title } from '../titles'
import {
    Users,
    Zap,
    BookOpen,
    HandPlatter
} from 'lucide-react'
import { useMatchRoute, useParams } from '@tanstack/react-router'
import { Challenges } from '@/types/SCA'
import { Link } from '@tanstack/react-router'
import { validateChallenge } from '@/guards/SCA'

const activities: Record<Challenges, { title: string, iconStyle: string, cardStyle: string, icon: React.ReactNode }> = {
    relationships: { 
        title: 'Relationships', 
        iconStyle: 'text-blue-500 border-blue-500', 
        cardStyle: 'bg-blue-500/25 border-blue-500! hover:bg-blue-500/25!',
        icon: <Users /> 
    },
    challenge: { 
        title: 'Challenge', 
        iconStyle: 'text-green-500 border-green-500', 
        cardStyle: 'bg-green-500/25 border-green-500! hover:bg-green-500/25!',
        icon: <Zap /> 
    },
    community: { 
        title: 'Community', 
        iconStyle: 'text-red-500 border-red-500', 
        cardStyle: 'bg-red-500/25 border-red-500! hover:bg-red-500/25!',
        icon: <BookOpen /> 
    },
    service: { 
        title: 'Service', 
        iconStyle: 'text-purple-500 border-purple-500', 
        cardStyle: 'bg-purple-500/25 border-purple-500! hover:bg-purple-500/25!',
        icon: <HandPlatter /> 
    },
}


export default function SidebarActivities() {
    return (
        <div 
            className="w-full border-b flex-1 border-gray-200 mb-4 p-4">
                <H1Title title="Activities" />
                <div className='flex flex-col items-center justify-center gap-4'>
                    {
                        (Object.keys(activities) as Challenges[]).map((activity) => (
                            <ActivityCard 
                                key={activity}
                                title={activities[activity].title}
                                iconStyle={activities[activity].iconStyle}
                                cardStyle={activities[activity].cardStyle}
                                icon={activities[activity].icon}
                            />
                        ))
                    }
                </div>
        </div>
    )
}
interface SidebarCardProps {
    title: string
    iconStyle: string
    cardStyle: string
    icon: React.ReactNode
}
function ActivityCard({ title, iconStyle, cardStyle, icon, }: SidebarCardProps) {
    const matchRoute = useMatchRoute()
    const isAwardIndex = matchRoute({
        to: '/student/$award',
        fuzzy: true
    })
    const challenge = validateChallenge(title.toLowerCase()) ? title.toLowerCase() : undefined
    const params = useParams({ from: '/student/$award', strict: true }) 
    return (
        <Link
            to='/student/$award/$challenge'
            params={{
                award: params.award,
                challenge: challenge
            }}
            disabled={!isAwardIndex}
            className='w-full'
        >   
            {({ isActive }) => (
                <div 
                    className={`w-full border-2 transition duration-150 flex-1 border-gray-400 p-4 rounded-lg flex items-center space-x-2 cursor-pointer hover:shadow-lg hover:bg-gray-100 text-white
                        ${!isAwardIndex ? 'opacity-50 hover:cursor-not-allowed hover:shadow-none hover:bg-transparent' : ''}
                        ${isActive ? cardStyle : ''}
                    `}>
                        <div className={`p-2 rounded-full border-2  ${iconStyle} mr-2`}>
                            {icon}

                        </div>
                        <div className='flex flex-col'>
                            <H1Title title={title} />
                            <p className='text-gray-500 text-xs'>
                                Awaiting Proposal
                            </p>

                        </div>
                </div>
            )}
        </Link>
    )
}
