import { createFileRoute } from '@tanstack/react-router'
import Auth from '@/features/auth/components/auth';
export const Route = createFileRoute('/signup')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Auth />

        </div>
    )
}