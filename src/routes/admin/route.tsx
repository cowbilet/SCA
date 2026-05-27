import { createFileRoute } from '@tanstack/react-router'
import { restrictRoles } from '@/utils/auth'
import { getScopedAdminUsers } from '@/features/admin/api/getScopedAdminUsers'
import AdminPage from '@/features/admin/components/adminPage'

export const Route = createFileRoute('/admin')({
    beforeLoad: async () => {
        await restrictRoles({ data: ['admin'] })
    },
    loader: async () => getScopedAdminUsers(),
    component: AdminPage,
})