import { ComponentProps } from "react"
import clsx from "clsx"
export function Card({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div className={clsx("bg-white rounded-lg shadow p-4", className)} {...props}>
            {props.children}
        </div>
    )
}