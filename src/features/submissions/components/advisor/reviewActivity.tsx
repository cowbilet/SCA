import { useParams } from "@tanstack/react-router"
import { AdvisorActivityLogs } from "@/features/logs/components/advisors/advisorLogs"
import { useChallenge } from "@/hooks/useChallenge"

export default function ReviewActivity() {
    const { studentId, award, challenge } = useParams({ from: "/$advisor/$studentId/$award/$challenge", strict: true })
    const { data: challengeData, isLoading, isError } = useChallenge(award, challenge, studentId)
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError || !challengeData) {
        return <div>Error loading activity logs. Please try again later.</div>
    }
    return (
        <>
            <AdvisorActivityLogs />
        </>
    )
}