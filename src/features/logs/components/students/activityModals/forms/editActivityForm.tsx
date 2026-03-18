// import { useParams } from "@tanstack/react-router"
// import { useCreateLogEntry } from "../../../../hooks/useCreateLogEntry"
import { useEditLog } from "../../../../hooks/useEditLogs";
import ActivityForm from "./activityForm";
import type { LogEntry } from "@/types/schemas/log";
import type { ComponentProps } from "react";

export default function EditActivityForm({log, onSubmit, ...props}: ComponentProps<"form"> & {log: LogEntry}) {
    const { mutate: editLog } = useEditLog({ oldLog: log })
    return (
        <ActivityForm id="edit-activity-form" log={log} onSubmit={(event) => {
            const formData = new FormData(event.target)
            const date = formData.get("date")
            const description = formData.get("description")

            if (typeof date === "string" && typeof description === "string") {
                editLog({description, date})
            }

            if (onSubmit) {
                onSubmit(event)
            }
        }} {...props} />
    )
}