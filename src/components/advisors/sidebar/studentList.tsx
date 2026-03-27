import Skeleton from 'react-loading-skeleton'
import { Link, useParams } from '@tanstack/react-router'
import PendingList from './pendingList'
import type { User } from '@/types/schemas/users'

import { useStudents } from '@/hooks/useStudents'

export default function StudentList() {
    const {
        data: students,
        isLoading: isStudentsLoading,
        isError: isStudentsError,
    } = useStudents()
    return (
        <div className="w-full h-full flex flex-col p-4 gap-4">
            <p className="text-gray-500 font-semibold">Pending</p>
                <PendingList />
            <p className="text-gray-500 font-semibold">Students</p>
            <div className="flex flex-col gap-4">
                {(() => {
                    if (isStudentsLoading) {
                        return (
                            <Skeleton count={3} height={80} className="mb-2" />
                        )
                    }
                    if (isStudentsError) {
                        return (
                            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                Error loading students. Please try again later.
                            </div>
                        )
                    }
                    if (students && students.length > 0) {
                        return students.map((student) => (
                            <StudentListItem
                                student={student}
                                key={student.userId}
                            />
                        ))
                    }
                })()}
            </div>
        </div>
    )
}
function StudentListItem({ student }: { student: User }) {
    const { advisor } = useParams({ from: '/$advisor', strict: true })
    return (
        <Link
            to="/$advisor/$studentId"
            params={{ advisor, studentId: student.userId }}
            key={student.userId}
            className="w-full border-2 gap-1 transition duration-150 flex-1 border-gray-400 p-4 rounded-lg flex flex-col space-x-2 cursor-pointer hover:shadow-lg hover:border-purple-500 text-white"
        >
            <div className="flex items-center gap-2">
                <h1 className="text-base font-bold mr-0 text-black">
                    {student.name}
                </h1>
            </div>
            <p className="text-gray-500 text-xs min-h-5">{student.email}</p>
        </Link>
    )
}


