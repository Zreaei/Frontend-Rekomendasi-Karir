import Header from '../components/ui/Header'
import StudentSidebar from '../components/ui/StudentSidebar'
import type { ReactNode } from 'react'

interface StudentLayoutProps {
  children: ReactNode
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  return (
    <div className="h-screen overflow-hidden bg-[#edf0f5] p-0.5">
      <div className="flex h-full min-h-0 w-full overflow-hidden rounded-none bg-[#edf0f5]">
        <StudentSidebar />
        <main className="relative min-h-0 w-full overflow-y-auto no-scrollbar bg-[#edf0f5]">
          <Header />
          <div className="px-6 py-6 lg:px-8 lg:py-7">
            <div className="grid min-w-0 gap-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentLayout
