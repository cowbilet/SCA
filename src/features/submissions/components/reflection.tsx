import { BookOpen } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/card";

export default function StudentReflection({ reflection }: { reflection: string | null }) {
    if (!reflection) {
        return null
    }
    return (
        <Card className=" p-0! flex-1">
            <div className="flex flex-col h-full">
                <CardHeader variant="accent">
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
        </Card>
    )
}