import { Book, BookOpen } from 'lucide-react'
import { CardHeader } from '@/components/card'

export default function Reflection({
    reflection,
}: {
    reflection: string | null
}) {
    if (!reflection) {
        return null
    }
    return (
        <div className="flex flex-col gap-4">
            <CardHeader className="bg-purple-100/50 border-purple-400/75">
                <BookOpen className="h-6 w-6 text-purple-500" />
                <h2 className="text-lg font-semibold">Reflection</h2>
            </CardHeader>
        </div>
    )
}
