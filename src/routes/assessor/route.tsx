import AdvisorSidebar from '@/components/advisors/sidebar/sidebar'
import { ensureSession, restrictRoles } from '@/utils/server/auth.server'
import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/assessor')({
    component: RouteComponent,
    beforeLoad: async () => {
        await restrictRoles({ data: ["assessor"] })
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
