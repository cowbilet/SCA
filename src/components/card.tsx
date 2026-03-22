import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx('bg-white rounded-lg shadow p-4', className)}
            {...props}
        >
            {props.children}
        </div>
    )
}
export function CardHeader({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx(
                'flex items-center gap-2 w-full h-fit p-4 rounded-t-lg border-b-2',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    )
}
export function CardBody({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx('p-4', className)} {...props}>
            {children}
        </div>
    )
}
