import SidebarShell from '@/components/sidebarShell'
import { H1Title } from '@/components/titles'
import type { User } from '@/types/schemas/users'
import AdminUserList from './adminUserList'

export default function AdminSidebar({
    admin,
    users,
    selectedUserId,
    onSelectUser,
}: {
    admin: User
    users: Array<User>
    selectedUserId: string
    onSelectUser: (userId: string) => void
}) {
    return (
        <SidebarShell>
            <SidebarHead adminState={admin.state} />
            <div className="w-full border-b border-gray-200 p-4">
                <H1Title title="Users" />
                <p className="text-sm text-gray-500 mb-4">
                    Browse state-scoped users.
                </p>
                <AdminUserList users={users} selectedUserId={selectedUserId} onSelectUser={onSelectUser} />
            </div>
        </SidebarShell>
    )
}

function SidebarHead({ adminState }: { adminState: User['state'] }) {
    return (
        <div className="w-full h-32 min-h-32 border-b border-gray-200 flex flex-col items-start justify-center p-4">
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">
                    {adminState === 'NAT'
                        ? 'National access across all users'
                        : `${adminState} admin access`}
                </p>
            </div>
        </div>
    )
}