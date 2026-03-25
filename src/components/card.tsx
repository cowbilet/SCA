import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

type CardHeaderVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent'

const headerVariantStyles: Record<CardHeaderVariant, string> = {
    success: 'bg-green-100/50 border-green-400/75',
    warning: 'bg-yellow-100/50 border-yellow-400/75',
    danger: 'bg-red-100/50 border-red-400/75',
    info: 'bg-blue-100/50 border-blue-400/75',
    neutral: 'bg-amber-100/50 border-amber-400/75',
    accent: 'bg-purple-100/50 border-purple-400/75',
}

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
    variant,
    ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: CardHeaderVariant }) {
    return (
        <div
            className={clsx(
                'flex items-center gap-2 w-full h-fit p-4 rounded-t-lg border-b-2',
                variant && headerVariantStyles[variant],
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
