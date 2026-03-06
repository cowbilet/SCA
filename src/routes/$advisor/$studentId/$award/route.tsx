import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Outlet } from '@tanstack/react-router'
import { awardSchema } from '@/types/schemas/award'
export const Route = createFileRoute('/$advisor/$studentId/$award')({
    params: z.object({
        studentId: z.uuid(),
        award: awardSchema,
    }),
    component: RouteComponent,
})

function RouteComponent() {
    return <Outlet />
}
