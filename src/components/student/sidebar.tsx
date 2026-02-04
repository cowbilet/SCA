import {
    Users, 
    Zap,
    BookOpen,
} from 'lucide-react'
import Tiers from './tiers'
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
function SidebarTiers() {
    return (
    <div 
        className="w-full border-b border-gray-200 p-4">
            <SidebarTitle title="Award Tiers" />
            <Tiers />
    </div>
    )
}

const activities = [
    { title: 'Relationships', color: 'bg-blue-500', icon: <Users /> },
    { title: 'Challenge', color: 'bg-green-500', icon: <Zap /> },
    { title: 'Community', color: 'bg-red-500', icon: <BookOpen /> },
]
function SidebarCards() {
    return (
        <div 
            className="w-full border-b flex-1 border-gray-200 mb-4 p-4">
                <SidebarTitle title="Activities" />
                <div className='flex flex-col items-center justify-center ml-2'>
                    {
                        activities.map((activity) => (
                            <SidebarCard 
                                key={activity.title}
                                title={activity.title}
                                color={activity.color}
                                icon={activity.icon}
                            />
                        ))
                    }
                </div>
        </div>
    )
}
function SidebarTitle({title}: {title: string}) {
    return (
        <h1 
            className="text-base font-bold text-gray-600 mb-2">
                {title}
        </h1>
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
            className={`w-full border flex-1 border-gray-400 mb-4 p-4 rounded-lg flex items-center space-x-2 cursor-pointer hover:shadow-lg hover:bg-gray-100`}>
                {icon}
                <SidebarTitle title={title} />
        </div>
    )
}