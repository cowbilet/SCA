import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import { H1Title } from '../../titles'
import type { Award } from '@/types/awards'
import { ALL_AWARDS } from '@/types/awards'

import { capitalizeFirstLetter } from '@/utils/stringUtils'

export default function SidebarAwards() {
    return (
        <div className="w-full border-b border-gray-200 p-4">
            <H1Title title="Awards" />
            <AwardCards />
        </div>
    )
}

function AwardCards() {
    return (
        <div className="w-full h-fit flex flex-row justify-center gap-2 ">
            {ALL_AWARDS.map((award) => (
                <AwardCard key={award} award={award} />
            ))}
        </div>
    )
}

function AwardCard({ award }: { award: Award }) {
    return (
        <Link
            to="/student/$award"
            // TODO: make this gold lock actually work
            // disabled={AwardStatuses[award] === 'locked'}
            params={{
                award: award,
            }}
            draggable={false}
        >
            {({ isActive }) => (
                <div
                    className={clsx(
                        'border-2 border-gray-300 flex-1 p-4 w-24 h-full gap-2 rounded-lg flex flex-col items-center space-x-2',
                        isActive ? `border-0! bg-linear-to-b ${award}` : '',
                    )}
                >
                    <h1
                        className={`text-sm font-bold text-center mr-0 ${isActive ? 'text-white' : 'text-black'}`}
                    >
                        {capitalizeFirstLetter(award)}
                    </h1>
                    {/* TODO: Bring this back */}
                    {/* {AwardStatuses[award] !== 'not started' && (
                        <AwardStatus status={AwardStatuses[award]} isActive={isActive} />
                    )} */}
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
// function AwardStatus({status, isActive}: {status: Exclude<AwardProgress,'not started'>, isActive: boolean}) {
//     return (
//         <div
//             className={`px-2 w-18 py-1 border rounded-sm text-[0.65rem] text-center font-semibold text-white
//                 ${isActive ? `bg-white/25 text-white` : `${AwardProgressStyling[status].color}` }
//             `}>
//                 {AwardProgressStyling[status].display}
//         </div>
//     )
// }
