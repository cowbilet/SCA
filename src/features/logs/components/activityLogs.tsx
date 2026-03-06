import { Card } from "@/components/card";
import { Circle } from "lucide-react";
import { CreateActivity } from "./createActivity";
export function ActivityLogs() {
    return (
        <Card className="h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Activity Logs</h2>
            <p className="text-gray-600">Record your progress and evidence</p>
            <CreateActivity />
            <div className="mt-4 flex flex-col gap-2 flex-1 overflow-y-auto">
                <ActivityLogEntry date="2024-06-01" />
                <ActivityLogEntry date="2024-06-02" />
                <ActivityLogEntry date="2024-06-03" />
            </div>
        </Card>
    )
}
function ActivityLogEntry({date}: {date: string}) {
    return (
        <div className="border-2 border-gray-300 rounded p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-lg">
                <div className="flex flex-row items-center gap-2">
                    <Circle className="w-3 h-3 bg-blue-500 rounded-full text-blue-500" />
                    <span className="font-semibold">{date}</span>

                </div>
                <span className="text-sm text-gray-500">10:00 AM</span>
            </div>
            <h2 className="text-sm font-semibold">
                ACTIVITY
            </h2>
            <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur bibendum.
            </p>
        </div>
    )
}