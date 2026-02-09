import { createFileRoute } from '@tanstack/react-router'



export const Route = createFileRoute('/student/$award/')({
    component: RouteComponent,
    
})


function RouteComponent() {
    return <div>Please select a challenge</div>
}
