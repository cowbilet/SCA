import { Book, BookOpen } from 'lucide-react'
import { CardBody, CardHeader } from '@/components/card'

export default function Reflection({
    reflection,
}: {
    reflection: string | null
}) {
    if (!reflection) {
        return null
    }
    return (
        <div className="flex flex-col gap-4 h-full">
            <CardHeader className="bg-purple-100/50 border-purple-400/75">
                <BookOpen className="h-6 w-6 text-purple-500" />
                <h2 className="text-lg font-semibold">Reflection</h2>
            </CardHeader>
            <CardBody className="h-full">
                <textarea
                    readOnly
                    value={reflection}
                    className="w-full h-full p-2 rounded-md border border-gray-300 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </CardBody>
        </div>
    )
}
