import { Outlet, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { awardSchema } from '@/types/schemas/award'

export const Route = createFileRoute('/$advisor/$studentId/$award')({
    params: z.object({
        award: awardSchema,
        studentId: z.uuid(),
    }),
    component: RouteComponent,
})

function RouteComponent() {
    return <Outlet />
}
