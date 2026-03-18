import { useParams } from "@tanstack/react-router"
import { useCreateLogEntry } from "../../../../hooks/useCreateLogEntry"
import ActivityForm from "./activityForm";
import type { ComponentProps } from "react";

export default function CreateActivityForm({onSubmit, ...props}: ComponentProps<"form">) {
    const { award, challenge } = useParams({strict: true, from: "/student/$award/$challenge"})
    const { mutate: createLogEntry } = useCreateLogEntry({ award, challenge })
    return (
        <ActivityForm onSubmit={(event) => {
            const formData = new FormData(event.target)
            const date = formData.get("date")
            const description = formData.get("description")

            if (typeof date === "string" && typeof description === "string") {
                // TODO: Check if the error is thrown or not
                createLogEntry({ date, description })
            }

            if (onSubmit) {
                onSubmit(event)
            }
        }} {...props} />
    )
}