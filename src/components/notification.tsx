import { ComponentProps } from "react"
import clsx from "clsx"

export function Notification({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div className={clsx(" shadow border-l-4 p-4 mb-4", className)} {...props}>
            {props.children}
        </div>
    )
}
export function NotificationHeader({ className, ...props }: ComponentProps<'h1'>) {
    return (
        <div className={clsx("flex items-center gap-4 mb-4", className)} {...props}>
            {props.children}
        </div>
    )
}
export function NotificationBody({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div className={clsx("", className)} {...props}>
            {props.children}
        </div>
    )
}
export function NotificationFooter({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div className={clsx("flex items-center gap-4 mt-4", className)} {...props}>
            {props.children}
        </div>
    )
}