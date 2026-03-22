import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { awardSchema } from '@/types/schemas/award'


export const Route = createFileRoute('/student/$award/')({
    params: z.object({
        award: awardSchema,
    }),
    component: RouteComponent,    
})


function RouteComponent() {
    return <div>Please select a challenge</div>
}
