import StudentSidebar from '../components/ui/StudentSidebar'
import { useStudentUiStore } from '../store/student-ui.store'
import type { ReactNode } from 'react'

interface StudentLayoutProps {
  children: ReactNode
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const sidebarCollapsed = useStudentUiStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useStudentUiStore((state) => state.toggleSidebar)

  return (
    <div className="flex min-h-screen bg-white max-[1200px]:flex-col">
      <StudentSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main className="min-w-0 flex-1 overflow-x-hidden bg-white px-14 py-12">
        <div className="grid min-w-0 gap-6">{children}</div>
      </main>
    </div>
  )
}

export default StudentLayout
