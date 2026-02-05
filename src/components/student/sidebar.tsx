import {
    Users, 
    Zap,
    BookOpen,
    HandPlatter
} from 'lucide-react'
import { Awards, Challenges } from '@/types/SCA'
import SidebarTiers from './tiers'
import { H1Title } from '../titles'

// const activities: Record<Activities, { title: string, color: string, icon: React.ReactNode }> = {
//     relationships: { title: 'Relationships', color: 'bg-blue-500', icon: <Users /> },
//     challenge: { title: 'Challenge', color: 'bg-green-500', icon: <Zap /> },
//     community: { title: 'Community', color: 'bg-red-500', icon: <BookOpen /> },
//     service: { title: 'Service', color: 'bg-purple-500', icon: <HandPlatter /> },
// }


export default function Sidebar() {
    return <div className="w-82 flex flex-col h-full border-r border-gray-200 ">
        <SidebarHead />
        <SidebarTiers />
        <SidebarCards />
    </div>
}
function SidebarHead() {
    return (
    <div 
        className="w-full h-16 border-b  border-gray-200 flex flex-col items-center justify-center">
            <h1 
                className="text-base font-bold">
                    SCA Record
            </h1>
    </div>
    )
}



function SidebarCards() {
    return (
        <div 
            className="w-full border-b flex-1 border-gray-200 mb-4 p-4">
                <H1Title title="Activities" />
                <div className='flex flex-col items-center justify-center ml-2'>
                    {/* {
                        (Object.keys(activities) as Activities[]).map((activity) => (
                            <SidebarCard 
                                key={activity}
                                title={activities[activity].title}
                                color={activities[activity].color}
                                icon={activities[activity].icon}
                            />
                        ))
                    } */}
                </div>
        </div>
    )
}

interface SidebarCardProps {
    title: string
    color: string
    icon: React.ReactNode
}
function SidebarCard({ title, color, icon }: SidebarCardProps) {
    return (
        <div 
            className={`w-full border flex-1 border-gray-400 mb-4 p-4 rounded-lg flex items-center space-x-2 cursor-pointer hover:shadow-lg hover:bg-gray-100 text-white`}>
                <div className={`p-2 rounded-full ${color} mr-2`}>
                    {icon}

                </div>
                <div className='flex flex-col'>
                    <H1Title title={title} />
                    <p className='text-gray-500 text-xs'>
                        Awaiting Proposal
                    </p>

                </div>
        </div>
    )
}