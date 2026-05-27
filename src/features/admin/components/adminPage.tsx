import { useMemo, useState } from 'react'
import { Shield } from 'lucide-react'
import AdminSidebar from './adminSidebar'
import { Card, CardBody, CardHeader } from '@/components/card'
import MainHeaderShell from '@/components/mainHeaderShell'
import { Route } from '@/routes/admin/route'

export default function AdminPage() {
    const { admin, users } = Route.useLoaderData()
    const [selectedUserId, setSelectedUserId] = useState(
        users[0]?.userId ?? '',
    )

    const selectedUser = useMemo(
        () => users.find((user) => user.userId === selectedUserId) ?? null,
        [users, selectedUserId],
    )

    return (
        <div className="w-full h-full flex flex-row justify-start">
            <AdminSidebar
                admin={admin}
                users={users}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
            />
            <div className="flex-1 flex flex-col overflow-scroll">
                <MainHeaderShell
                    title="Admin"
                    description="Select a user from the sidebar to view state-scoped account details."
                    icon={
                        <Shield className="h-12 w-12 rounded bg-white/20 p-2 text-white" />
                    }
                    className="bg-gray-500"
                />
                <div className="flex-1 flex flex-col gap-4 p-4 bg-gray-50">
                    <Card>
                        <CardHeader variant="info">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Selected user
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Admins can view users within their permitted state.
                                </p>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {selectedUser ? (
                                <div className="grid gap-2 text-sm text-gray-700">
                                    <p className="text-lg font-semibold text-gray-900">
                                        {selectedUser.name}
                                    </p>
                                    <p>{selectedUser.email}</p>
                                    <p>
                                        Role: {selectedUser.role} · State:{' '}
                                        {selectedUser.state}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No user selected.
                                </p>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}