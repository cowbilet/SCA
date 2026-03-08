import Sidebar from '@/components/student/sidebar/sidebar'
import { restrictRoles } from '@/utils/auth'
import { createFileRoute, Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/student')({
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