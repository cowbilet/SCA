import Sidebar from '@/components/student/sidebar/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/student')({
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