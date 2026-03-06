
import { Award } from "@/types/awards"
import { useLoaderData } from "@tanstack/react-router"
import { Challenge } from "@/types/challenges"
import { Link, ActiveLinkOptions, useParams } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { useLocation } from "@tanstack/react-router"
export default function AdvisorStudentNavigation() {
    const location = useLocation();
    const isMentorPage = location.pathname.includes('/mentor')
    if (!(location.pathname.includes('/mentor') || location.pathname.includes('/assessor'))) {
        return null
    }

    const params = useParams({strict: false})
    const award = params["award"] as Award | undefined
    // TODO: Make this more robust by validating the loader data format and handling loading/error states
    const student = useLoaderData({strict: false})
    if (!student) {
        return null
    }
    const studentChallenges = student.studentChallenges
    // Validate that studentChallenges is in the correct format
    if (!studentChallenges || !Array.isArray(studentChallenges)) {
        return null
    }
    const isAwardPage = !(award === undefined)
    
    const [availableNavigation, setAvailableAwards] = useState<Record<Award, Challenge[]> | null>(null)
    useMemo(() => {
        if (studentChallenges) {
            const awards: Record<Award, Challenge[]> = {
                bronze: [],
                silver: [],
                gold: [],
            }
            studentChallenges.forEach(({award, challenges}) => {
                awards[award as Award].push(challenges)
            })
            setAvailableAwards(awards)
        }
    }, [studentChallenges])
    const availableAwards = availableNavigation ? Object.keys(availableNavigation).filter(award => availableNavigation[award as Award].length > 0) : []
    return (
        <div className="flex flex-col gap-4 w-full p-4 drop-shadow-2xl">
            <div className="flex flex-row gap-2">
                <AwardLink link={{to: "/$advisor/$studentId/$award", params: {award: "bronze"}, activeProps: {className: "bronze text-white border-0!"}}} name="Bronze" disable={!availableAwards.includes("bronze")}/>
                <AwardLink link={{to: "/$advisor/$studentId/$award", params: {award: "silver"}, activeProps: {className: "silver text-white border-0!"}}} name="Silver" disable={!availableAwards.includes("silver")} />
                <AwardLink link={{to: "/$advisor/$studentId/$award", params: {award: "gold"}, activeProps: {className: "gold text-white border-0!"}}} name="Gold" disable={!availableAwards.includes("gold") } />
            </div>
            <div className="flex flex-row gap-2">
                <AwardLink link={{to: "/$advisor/$studentId/$award/$challenge", params: {award: award, challenge: "relationships"}, activeProps: {className: "relationships"}}} name="Relationships" disable={!isAwardPage || !availableNavigation?.[award]?.includes("relationships") } />
                <AwardLink link={{to: "/$advisor/$studentId/$award/$challenge", params: {award: award, challenge: "challenge"}, activeProps: {className: "challenge"}}} name="Challenge" disable={!isAwardPage || !availableNavigation?.[award]?.includes("challenge") } />
                <AwardLink link={{to: "/$advisor/$studentId/$award/$challenge", params: {award: award, challenge: "community"}, activeProps: {className: "community"}}} name="Community" disable={!isAwardPage || !availableNavigation?.[award]?.includes("community") } />
                <AwardLink link={{to: "/$advisor/$studentId/$award/$challenge", params: {award: award, challenge: "service"}, activeProps: {className: "service"}}} name="Service" disable={!isAwardPage || !availableNavigation?.[award]?.includes("service") } />
            </div>
        </div>
    )
}
function AwardLink({link, name, disable}: {link: ActiveLinkOptions, name: string, disable: boolean}) {
    return (
        <Link {...link} disabled={disable} className={`bg-white border-2 border-gray-400 text-black px-4 py-2 rounded-lg ${disable ? "opacity-50 hover:cursor-not-allowed" : ""}`} >
            {name}
        </Link>
    )
}