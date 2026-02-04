import Sidebar from '@/components/student/sidebar'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/student/')({
    component: StudentPage,
})
export function StudentPage() {
    return (
        <div className='w-full h-full flex flex-col justify-start'>
            <Sidebar />
        </div>
    )
}