import SidebarChallenges from './challenges'
import SidebarAwards from './awards'
import SidebarShell from '@/components/sidebarShell'

export default function Sidebar() {
    return (
        <SidebarShell>
            <SidebarHead />
            <SidebarAwards />
            <SidebarChallenges />
        </SidebarShell>
    )
}
function SidebarHead() {
    return (
        <div className="w-full h-32 min-h-32 border-b  border-gray-200 flex flex-col items-center justify-center">
            <h1 className="text-base font-bold">SCA Record</h1>
        </div>
    )
}
