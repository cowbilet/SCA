import { Challenge } from "@/types/challenges"
import { BookOpen, HandPlatter, Users, Zap } from "lucide-react"
interface ChallengeProps {
    challenge: Challenge
}
export default function ChallengeShell({ challenge }: ChallengeProps) {
    return (
        <div className="flex flex-col">
            <ChallengeHeader challenge={challenge} />
        </div>
    )
}
const iconStyle = 'h-12 w-12 text-white bg-white/20 rounded p-2'
const ChallengeStyles: Record<Challenge, { title: string, style: string, icon: React.ReactNode }> = {
    relationships: { 
        title: 'Relationships', 
        style: 'bg-blue-500',
        icon: <Users className={iconStyle} /> 
    },
    challenge: { 
        title: 'Challenge', 
        style: 'bg-green-500',
        icon: <Zap className={iconStyle} /> 
    },
    community: { 
        title: 'Community', 
        style: 'bg-red-500',
        icon: <BookOpen className={iconStyle} /> 
    },
    service: { 
        title: 'Service', 
        style: 'bg-purple-500',
        icon: <HandPlatter className={iconStyle} /> 
    },
}
function ChallengeHeader({ challenge }: ChallengeProps) {
    const { title, style, icon } = ChallengeStyles[challenge]
    return (
        <div className={`flex gap-4 w-full h-32 ${style} flex-col p-8 justify-center`}>
            <div className="flex items-center gap-4">
                {icon}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold capitalize text-white">{title}</h1>
                    <p className="text-white/90">View your progress and awards for the {title} challenge.</p>
                </div>
            </div>
            
        </div>
    )
}