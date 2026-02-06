import { Link } from "@tanstack/react-router"
import { H1Title } from "../titles"
import { Awards, ALL_AWARDS, Challenges, ALL_CHALLENGES, AwardProgress } from '@/types/SCA'
const AwardStyling = {
    'bronze': {
        title: 'Bronze',
        color: 'from-amber-600 to-amber-700'
    },
    'silver': {
        title: 'Silver',
        color: 'from-gray-400 to-gray-500'
    },
    'gold': {
        title: 'Gold',
        color: 'from-yellow-400 to-yellow-500'
    }
}
const AwardProgressStyling: Record<Exclude<AwardProgress,'not started'>, { display: string, color?: string}> = {
    'locked': { display: '🔒' }, 
    'ongoing': { display: 'Ongoing', color: 'bg-blue-500/25 border-blue-500 text-blue-700!' },
    'completed': { display: 'Completed', color: 'bg-green-500/45 border-green-500 text-green-700!' }, 

}
const TierStatuses: Record<Awards, AwardProgress> = {
    'bronze': 'completed',
    'silver': 'not started',
    'gold': 'locked',
}

export default function SidebarTiers() {
    return (
    <div 
        className="w-full border-b border-gray-200 p-4">
            <H1Title title="Award Tiers" />
            <Tiers />
    </div>
    )
}


function Tiers() {
    return <div className="w-full h-fit flex flex-row justify-center gap-2 ">
        {ALL_AWARDS.map((award) => (
            <TierCard 
                key={award}
                award={award}
            />
        ))}
    </div>
}


function TierCard({award}: {award: Awards}) {
    return (
        <Link
            to='/student/$tier'
            disabled={TierStatuses[award] === 'locked'}
            params={{
                tier: award
            }}
        >
            {({ isActive }) => (
                <div 
                    className={`border-2 border-gray-300 flex-1 p-4 w-24 h-full gap-2 rounded-lg flex flex-col items-center space-x-2 
                        ${TierStatuses[award] === 'locked' 
                            ? 'opacity-50 hover:shadow-0! hover:cursor-not-allowed hover:shadow-none'
                            : 'hover:cursor-pointer hover:shadow-lg transition hover:border-gray-400 '
                        }
                        ${isActive ? 'border-0! bg-linear-to-b ' + AwardStyling[award].color : ''}
                    `}
                >
                    <h1 
                        className={`text-sm font-bold text-center mr-0 ${isActive ? 'text-white' : 'text-black'}`}>
                            {AwardStyling[award].title}
                    </h1>
                    {TierStatuses[award] !== 'not started' && (
                        <TierStatus status={TierStatuses[award]} isActive={isActive} />
                    )}
                </div>
            )}
        </Link>
    )
}
// <h1 
//     className="text-sm font-bold text-center mr-0 text-white">
//         {AwardStyling[award].title}
// </h1>
// <TierStatus status={TierStatuses[award]} />
function TierStatus({status, isActive}: {status: Exclude<AwardProgress,'not started'>, isActive: boolean}) {
    return (
        <div 
            className={`px-2 w-18 py-1 border rounded-sm text-[0.65rem] text-center font-semibold text-white 
                ${isActive ? `bg-white/25 text-white` : `${AwardProgressStyling[status].color}` }
            `}>
                {AwardProgressStyling[status].display}
        </div>
    )
    
}