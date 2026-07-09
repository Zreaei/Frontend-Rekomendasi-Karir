import RightsideMenu from '../components/ui/RightsideMenu'
import StudentSidebar from '../components/ui/StudentSidebar'
import { useStudentUiStore } from '../store/student-ui.store'
import type { ReactNode } from 'react'

interface StudentLayoutProps {
  children: ReactNode
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const sidebarCollapsed = useStudentUiStore((state) => state.sidebarCollapsed)
  const rightsideMenuCollapsed = useStudentUiStore((state) => state.rightsideMenuCollapsed)
  const toggleSidebar = useStudentUiStore((state) => state.toggleSidebar)
  const toggleRightsideMenu = useStudentUiStore((state) => state.toggleRightsideMenu)

  return (
    <div className="h-screen overflow-hidden bg-gray-200 p-2">
      <div className="flex h-full min-h-0 w-full overflow-hidden rounded-l-xl bg-[#052960]">
        <StudentSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <main className="relative min-h-0 w-full overflow-y-auto no-scrollbar rounded-l-xl bg-gray-200 p-8 px-10">
          <RightsideMenu collapsed={rightsideMenuCollapsed} onToggle={toggleRightsideMenu} />
          <div className="grid min-w-0 gap-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default StudentLayout
