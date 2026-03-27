import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/utils/auth'
import { getRoleRedirect, isSessionRole } from '@/utils/authRedirect'

export const Route = createFileRoute('/')({
    beforeLoad: async () => {
        const session = await getSession()
        const role = session?.user?.role

        if (!isSessionRole(role)) {
            throw redirect({ to: '/login' })
        }

        throw redirect(getRoleRedirect(role))
    },
    component: App,
})

function App() {
    return null
}
