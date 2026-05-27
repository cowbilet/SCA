type SessionRole = 'student' | 'mentor' | 'assessor' | 'admin'

export function getRoleRedirect(role?: string | null) {
    if (role === 'student') {
        return { to: '/student' as const }
    }

    if (role === 'mentor') {
        return {
            to: '/$advisor' as const,
            params: { advisor: 'mentor' as const },
        }
    }

    if (role === 'assessor') {
        return {
            to: '/$advisor' as const,
            params: { advisor: 'assessor' as const },
        }
    }

    if (role === 'admin') {
        return { to: '/admin' as const }
    }

    return { to: '/login' as const }
}

export function isSessionRole(role: unknown): role is SessionRole {
    return (
        role === 'student' ||
        role === 'mentor' ||
        role === 'assessor' ||
        role === 'admin'
    )
}
