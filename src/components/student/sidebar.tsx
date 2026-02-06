
import SidebarActivities from './activites'
import SidebarAwards from './awards'




export default function Sidebar() {
    return <div className="w-90 flex flex-col h-full border-r border-gray-200 ">
        <SidebarHead />
        <SidebarAwards />
        <SidebarActivities />
    </div>
}
function SidebarHead() {
    return (
    <div 
        className="w-full h-16 border-b  border-gray-200 flex flex-col items-center justify-center">
            <h1 
                className="text-base font-bold">
                    SCA Record
            </h1>
    </div>
    )
}




