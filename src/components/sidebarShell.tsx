import type { HTMLAttributes } from 'react'

export default function SidebarShell({
    children,
    className,
    ...props
}: { children: React.ReactNode } & HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`w-90 flex flex-col h-full border-r border-gray-200 ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
