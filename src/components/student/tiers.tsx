import { AwardStatus, AwardTiers } from "@/types/awards"

const StylingTiers: { award: AwardTiers, color: string }[] = [
    {
        award: 'bronze',

        color: 'bg-yellow-500',
    },
    {
        award: 'silver',
        color: 'bg-gray-500',
    },
    {
        award: 'gold',
        color: 'bg-yellow-300',
    }
]
export default function Tiers() {
    return <div className="w-full h-fit flex flex-row gap-2 ">
        {StylingTiers.map((tier) => (
            <TierCard 
                key={tier.award}
                award={tier.award}
                color={tier.color}
            />
        ))}
    </div>
}
const TierStatuses: Record<AwardTiers, AwardStatus> = {
    'bronze': 'completed',
    'silver': 'ongoing',
    'gold': 'locked',
}
const AwardTitles: Record<AwardTiers, string> = {
    'bronze': 'Bronze',
    'silver': 'Silver',
    'gold': 'Gold',
}
const AwardColors: Record<AwardTiers, string> = {
    'bronze': 'from-amber-600 to-amber-700',
    'silver': 'from-gray-400 to-gray-500',
    'gold': 'from-yellow-400 to-yellow-500',
}
function TierCard({award}: {award: AwardTiers}) {
    return (
        <div 
            className={`border-2 border-gray-300 flex-1 p-4 w-24 gap-2 rounded-lg flex flex-col items-center space-x-2 
                ${TierStatuses[award] === 'locked' 
                    ? 'opacity-50 hover:shadow-0! hover:cursor-not-allowed hover:shadow-none'
                    : 'hover:cursor-pointer hover:shadow-lg transition hover:border-gray-400 '
                }
                bg-linear-to-b ${AwardColors[award]} text-white
            `}
        >
            <h1 
                className="text-sm font-bold text-center mr-0 text-white">
                    {AwardTitles[award]}
            </h1>
            <TierStatus status={TierStatuses[award]} />
        </div>
    )
}
const StylingStatus: Record<AwardStatus, { display: string, color?: string}> = {
    'locked': { display: '🔒' }
    , 'ongoing': { display: 'Ongoing', color: 'bg-blue-500' }
    , 'completed': { display: 'Completed', color: 'bg-green-500' }
    , 'not started': { display: 'Not Started' }
}
function TierStatus({status}: {status: AwardStatus}) {
    return (
        <div 
            className={`px-2 w-18 py-1 rounded-sm text-[0.65rem] text-center font-semibold text-white ${StylingStatus[status].color}`}>
                {StylingStatus[status].display}
        </div>
    )
    
}