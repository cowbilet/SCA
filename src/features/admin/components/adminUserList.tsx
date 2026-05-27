import clsx from 'clsx'
import type { User } from '@/types/schemas/users'

export default function AdminUserList({
    users,
    selectedUserId,
    onSelectUser,
}: {
    users: Array<User>
    selectedUserId: string
    onSelectUser: (userId: string) => void
}) {
    if (users.length === 0) {
        return <p className="text-sm text-gray-500">No users available.</p>
    }

    return (
        <div className="flex flex-col gap-2">
            {users.map((user) => {
                const isActive = user.userId === selectedUserId

                return (
                    <button
                        key={user.userId}
                        type="button"
                        onClick={() => onSelectUser(user.userId)}
                        className={clsx(
                            'w-full rounded-lg border-2 p-4 text-left transition duration-150 hover:bg-gray-100',
                            isActive
                                ? 'border-gray-700 bg-gray-100'
                                : 'border-gray-300 bg-white',
                        )}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold text-gray-900">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-500">
                                {user.role} · {user.state}
                            </p>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}