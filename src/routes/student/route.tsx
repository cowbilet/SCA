import Sidebar from '@/components/student/sidebar/sidebar'
import { restrictRoles } from '@/utils/auth'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/student')({
    //TODO: Optimise this, because it runs for every child navigation 
    // https://tanstack.com/router/latest/docs/guide/authenticated-routes
    beforeLoad: async () => {
        const user = await restrictRoles({ data: ["student"] })
        return { user }
    },
    component: StudentPage,
})
export function StudentPage() {
    return (
        <div className='w-full h-full flex flex-row justify-start'>
            <Sidebar />
            <Outlet />
        </div>
    )
}   