import AdvisorSidebar from '@/components/advisors/sidebar/sidebar'
import { restrictRoles } from '@/utils/auth'
import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import z from 'zod'
export const Route = createFileRoute('/$advisor')({
    params: z.object({
        advisor: z.enum(["mentor", "assessor"]),
    }),
    component: RouteComponent,
    beforeLoad: async () => {
        await restrictRoles({ data: ["mentor", "assessor"] })
    }
})

function RouteComponent() {
    return (
        <div className='w-full h-full flex flex-row justify-start'>
            <AdvisorSidebar />
            <Outlet />
        </div>
    )
}
