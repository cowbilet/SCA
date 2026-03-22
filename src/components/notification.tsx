import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

export function Notification({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx(' shadow border-l-4 p-4 mb-4', className)}
            {...props}
        >
            {props.children}
        </div>
    )
}
export function NotificationHeader({
    className,
    ...props
}: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <div
            className={clsx('flex items-center gap-4 mb-4', className)}
            {...props}
        >
            {props.children}
        </div>
    )
}
export function NotificationBody({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx('', className)} {...props}>
            {props.children}
        </div>
    )
}
export function NotificationFooter({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx('flex items-center gap-4 mt-4', className)}
            {...props}
        >
            {props.children}
        </div>
    )
}
