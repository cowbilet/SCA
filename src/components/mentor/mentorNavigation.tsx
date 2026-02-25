import { Route } from "@/routes/mentor/$studentId/route"
import { Award } from "@/types/awards"
import { Challenge } from "@/types/challenges"
import { Link, ActiveLinkOptions, useParams } from "@tanstack/react-router"
import { useMatchRoute } from "@tanstack/react-router"
export default function MentorNavigation() {
    const params = useParams({strict: false})
    const award = params["award"] as Award | undefined
    const {studentChallenges} = Route.useLoaderData()
    const isAwardPage = !(award === undefined)
    
    const availableAwards = studentChallenges.map((sc) => sc.award)
    const availableChallengesForAward = studentChallenges.reduce((acc, sc) => {
        const award: Award = sc.award
        const challenge: Challenge[] = sc.challenges as unknown as Challenge[]
        acc[award] = challenge
        return acc
    }, {} as Record<Award, Challenge[]>)
    return (
        <div className="flex flex-col gap-4 w-full p-4 drop-shadow-2xl">
            <div className="flex flex-row gap-2">
                <AwardLink link={{to: "/mentor/$studentId/$award", params: {award: "bronze"}, activeProps: {className: "bronze"}}} name="Bronze" disable={!availableAwards.includes("bronze")}/>
                <AwardLink link={{to: "/mentor/$studentId/$award", params: {award: "silver"}, activeProps: {className: "silver"}}} name="Silver" disable={!availableAwards.includes("silver")} />
                <AwardLink link={{to: "/mentor/$studentId/$award", params: {award: "gold"}, activeProps: {className: "gold"}}} name="Gold" disable={!availableAwards.includes("gold") } />
            </div>
            <div className="flex flex-row gap-2">
                <AwardLink link={{to: "/mentor/$studentId/$award/$challenge", params: {award: award, challenge: "relationships"}, activeProps: {className: "relationships"}}} name="Relationships" disable={!isAwardPage || !availableChallengesForAward[award]?.includes("relationships") } />
                <AwardLink link={{to: "/mentor/$studentId/$award/$challenge", params: {award: award, challenge: "challenge"}, activeProps: {className: "challenge"}}} name="Challenge" disable={!isAwardPage || !availableChallengesForAward[award]?.includes("challenge") } />
                <AwardLink link={{to: "/mentor/$studentId/$award/$challenge", params: {award: award, challenge: "community"}, activeProps: {className: "community"}}} name="Community" disable={!isAwardPage || !availableChallengesForAward[award]?.includes("community") } />
                <AwardLink link={{to: "/mentor/$studentId/$award/$challenge", params: {award: award, challenge: "service"}, activeProps: {className: "service"}}} name="Service" disable={!isAwardPage || !availableChallengesForAward[award]?.includes("service") } />
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