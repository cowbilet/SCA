import MentorSidebar from '@/components/mentor/sidebar/sidebar'
import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/mentor')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className='w-full h-full flex flex-row justify-start'>
            <MentorSidebar />
            <Outlet />
        </div>
    )
}
