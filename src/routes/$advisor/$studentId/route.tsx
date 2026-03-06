import { getUserById } from '@/api/users/getUserById'
import MainHeaderShell from '@/components/mainHeaderShell'
import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { User } from 'lucide-react'
import { z } from 'zod'
import AdvisorStudentNavigation from '@/components/advisors/advisorStudentNavigation'
import { getStudentAwardAndChallenges } from '@/api/students/getStudentAwardAndChallenges'
export const Route = createFileRoute('/$advisor/$studentId')({
    component: RouteComponent,
    params: z.object({
        studentId: z.uuid(),
    }),
    loader: async ({ params }) => {
        const { studentId } = params
        const student = await getUserById({data: {studentId}})
        const studentChallenges = await getStudentAwardAndChallenges({data: {studentId}})
        if (!student) {
            throw new Response('Student not found', { status: 404 })
        }
        return {student, studentChallenges}
    }
})

function RouteComponent() {
    const {student} = Route.useLoaderData()
    return (
        <div className="flex flex-col h-full flex-1">
            <MainHeaderShell title={student.name} description={student.email} icon={<User className='h-12 w-12 text-white bg-white/20 rounded p-2' />} className='bg-gray-500' />
            <AdvisorStudentNavigation />
            <div className="flex-1 flex-col flex p-4 bg-gray-50">
                <Outlet />

            </div>
        </div>
    )
}
        