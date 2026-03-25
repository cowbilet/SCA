import { Link, useLoaderData, useParams } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import type { ActiveLinkOptions } from '@tanstack/react-router'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'

export default function AdvisorStudentNavigation() {
    const { award } = useParams({ strict: false })
    const student = useLoaderData({ strict: false })

    // TODO: Make this more robust by validating the loader data format and handling loading/error states
    if (!student) {
        return null
    }
    const studentChallenges = student.studentChallenges

    const isAwardPage = !(award === undefined)

    const [availableNavigation, setAvailableAwards] = useState<Record<
        Award,
        Array<Challenge>
    > | null>(null)
    useMemo(() => {
        if (studentChallenges) {
            const awards: Record<Award, Array<Challenge>> = {
                bronze: [],
                silver: [],
                gold: [],
            }
            studentChallenges.forEach(({ award, challenges }) => {
                awards[award].push(challenges)
            })
            setAvailableAwards(awards)
        }
    }, [studentChallenges])
    const availableAwards = availableNavigation
        ? Object.keys(availableNavigation).filter(
              (award) => availableNavigation[award as Award].length > 0,
          )
        : []
    return (
        <div className="flex flex-col gap-4 w-full p-4 drop-shadow-2xl">
            <div className="flex flex-row gap-2">
                <AwardLink
                    link={{
                        to: '/$advisor/$studentId/$award',
                        params: { award: 'bronze' },
                        activeProps: {
                            className: 'bronze text-white border-0!',
                        },
                    }}
                    name="Bronze"
                    disable={!availableAwards.includes('bronze')}
                />
                <AwardLink
                    link={{
                        to: '/$advisor/$studentId/$award',
                        params: { award: 'silver' },
                        activeProps: {
                            className: 'silver text-white border-0!',
                        },
                    }}
                    name="Silver"
                    disable={!availableAwards.includes('silver')}
                />
                <AwardLink
                    link={{
                        to: '/$advisor/$studentId/$award',
                        params: { award: 'gold' },
                        activeProps: { className: 'gold text-white border-0!' },
                    }}
                    name="Gold"
                    disable={!availableAwards.includes('gold')}
                />
            </div>
            <div className="flex flex-row gap-2">
                <AwardLink
                    link={{
                        to: '/$advisor/$studentId/$award/$challenge',
                        params: { award: award, challenge: 'relationships' },
                        activeProps: { className: 'relationships' },
                    }}
                    name="Relationships"
                    disable={
                        !isAwardPage ||
                        !availableNavigation?.[award].includes('relationships')
                    }
                />
                <AwardLink
                    link={{
                        to: '/$advisor/$studentId/$award/$challenge',
                        params: { award: award, challenge: 'challenge' },
                        activeProps: { className: 'challenge' },
                    }}
                    name="Challenge"
                    disable={
                        !isAwardPage ||
                        !availableNavigation?.[award].includes('challenge')
                    }
                />
                <AwardLink
                    link={{
                        to: '/$advisor/$studentId/$award/$challenge',
                        params: { award: award, challenge: 'community' },
                        activeProps: { className: 'community' },
                    }}
                    name="Community"
                    disable={
                        !isAwardPage ||
                        !availableNavigation?.[award].includes('community')
                    }
                />
                <AwardLink
                    link={{
                        to: '/$advisor/$studentId/$award/$challenge',
                        params: { award: award, challenge: 'service' },
                        activeProps: { className: 'service' },
                    }}
                    name="Service"
                    disable={
                        !isAwardPage ||
                        !availableNavigation?.[award].includes('service')
                    }
                />
            </div>
        </div>
    )
}
function AwardLink({
    link,
    name,
    disable,
}: {
    link: ActiveLinkOptions
    name: string
    disable: boolean
}) {
    return (
        <Link
            {...link}
            disabled={disable}
            className={`bg-white border-2 border-gray-400 flex justify-center items-center text-black px-4 py-2 rounded-lg ${disable ? 'opacity-50 hover:cursor-not-allowed' : ''}`}
        >
            {name}
        </Link>
    )
}
