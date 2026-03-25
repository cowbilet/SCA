import { createFileRoute, redirect } from '@tanstack/react-router'
import Auth from '@/features/auth/components/auth'
import { getSession } from '@/utils/auth'
import { getRoleRedirect, isSessionRole } from '@/utils/authRedirect'

export const Route = createFileRoute('/signup')({
    beforeLoad: async () => {
        const session = await getSession()

        if (isSessionRole(session?.user.role)) {
            throw redirect(getRoleRedirect(session.user.role))
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
