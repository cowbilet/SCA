import { Link, ActiveLinkOptions, useParams } from "@tanstack/react-router"
import { useMatchRoute } from "@tanstack/react-router"
export default function MentorNavigation() {
    const params = useParams({strict: false})
    const award = params["award"]

    const isAwardPage = !(award === undefined)

    return (
        <div className="flex flex-col gap-4 w-full p-4 drop-shadow-2xl border-2 border-gray-400 rounded-lg">
            <div className="flex flex-row gap-2">
                <AwardLink link={{to: "/mentor/$studentId/$award", params: {award: "bronze"}, activeProps: {className: "bronze"}}} name="Bronze" disable={false}/>
                <AwardLink link={{to: "/mentor/$studentId/$award", params: {award: "silver"}, activeProps: {className: "silver"}}} name="Silver" disable={false} />
                <AwardLink link={{to: "/mentor/$studentId/$award", params: {award: "gold"}, activeProps: {className: "gold"}}} name="Gold" disable={false} />
            </div>
            <div className="flex flex-row gap-2">
                <AwardLink link={{to: "/mentor/$studentId/$award/$challenge", params: {award: award, challenge: "relationships"}, activeProps: {className: "relationships"}}} name="Relationships" disable={!isAwardPage} />
                <AwardLink link={{to: "/mentor/$studentId/$award/$challenge", params: {award: award, challenge: "challenge"}, activeProps: {className: "challenge"}}} name="Challenge" disable={!isAwardPage} />
                <AwardLink link={{to: "/mentor/$studentId/$award/$challenge", params: {award: award, challenge: "community"}, activeProps: {className: "community"}}} name="Community" disable={!isAwardPage} />
                <AwardLink link={{to: "/mentor/$studentId/$award/$challenge", params: {award: award, challenge: "service"}, activeProps: {className: "service"}}} name="Service" disable={!isAwardPage} />
            </div>
        </div>
    )
}
function AwardLink({link, name, disable}: {link: ActiveLinkOptions, name: string, disable: boolean}) {
    return (
        <Link {...link} disabled={disable} className={`bg-gray-700 text-black px-4 py-2 rounded-lg ${disable ? "opacity-50 hover:cursor-not-allowed" : ""}`} >
            {name}
        </Link>
    )
}