import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

export default function MainHeaderShell({
    title,
    icon,
    description,
    className,
    ...props
}: {
    title: string
    icon: React.ReactNode
    description?: string
} & HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx(
                'flex gap-4 w-full min-h-32 h-32 flex-col p-8 justify-center',
                className,
            )}
            {...props}
        >
            <div className="flex items-center gap-4">
                {icon}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold capitalize text-white">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-white/90">{description}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
