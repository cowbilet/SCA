import { createFileRoute, redirect } from '@tanstack/react-router'
import Auth from '@/features/auth/components/auth';
import { getSession } from '@/utils/auth';
export const Route = createFileRoute('/login')({
    beforeLoad: async ({ context }) => {
        const session = await getSession();
        if (session) {
            if (session.user.role === "student") {
                throw redirect({to: "/student"});
            }
            else if (session.user.role === "mentor") {
                throw redirect({to: "/mentor"});
            }
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Auth />

        </div>
    )
}
