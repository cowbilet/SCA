import SidebarShell from '../../sidebarShell'
import StudentList from './studentList'
import { useLocation } from "@tanstack/react-router"

export default function MentorSidebar() {
    return (
        <SidebarShell>
            <SidebarHead />
            <StudentList />
        </SidebarShell>
    )
}

function SidebarHead() {
    const location = useLocation()
    const isMentorHome = location.pathname.includes("/mentor")
    return (
        <div className="w-full h-32 border-b  border-gray-200 flex flex-col items-start justify-center p-4">
            <div>
                <h1 className="text-2xl font-bold">
                    {isMentorHome ? "Mentor" : "Assessor"} Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                    Review and provide feedback on student proposals
                </p>
            </div>
        </div>
    )
}