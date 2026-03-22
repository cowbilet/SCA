import { Outlet, createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { restrictRoles } from '@/utils/auth'
import AdvisorSidebar from '@/components/advisors/sidebar/sidebar'

export const Route = createFileRoute('/$advisor')({
    params: z.object({
        advisor: z.enum(['mentor', 'assessor']),
    }),
    component: RouteComponent,
    beforeLoad: async () => {
        await restrictRoles({ data: ['mentor', 'assessor'] })
    },
})

function RouteComponent() {
    return (
        <div className="w-full h-full flex flex-row justify-start">
            <AdvisorSidebar />
            <Outlet />
        </div>
    )
}
