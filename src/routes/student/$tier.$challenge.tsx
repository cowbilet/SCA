import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/$tier/$challenge')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/student/$tier/$challenge"!</div>
}
