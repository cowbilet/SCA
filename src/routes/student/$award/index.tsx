import { awardSchema } from '@/types/schemas/award'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'


export const Route = createFileRoute('/student/$award/')({
    params: z.object({
        award: awardSchema,
    }),
    component: RouteComponent,    
})


function RouteComponent() {
    return <div>Please select a challenge</div>
}
