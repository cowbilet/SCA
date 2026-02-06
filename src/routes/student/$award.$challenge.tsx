import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/$award/$challenge')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/student/$award/$challenge"!</div>
}
