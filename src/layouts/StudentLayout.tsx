import type { ReactNode } from 'react'
import StudentSidebar from '../components/ui/StudentSidebar'

interface StudentLayoutProps {
  children: ReactNode
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  return (
    <div className="grid min-h-screen grid-cols-[280px_minmax(0,1fr)] bg-white max-[1200px]:grid-cols-1">
      <StudentSidebar />
      <main className="min-w-0 overflow-x-hidden bg-white px-[clamp(28px,3vw,48px)] py-[clamp(28px,4vw,56px)] pb-8 pr-[clamp(20px,2.5vw,40px)] max-sm:px-5 max-sm:py-7">
        <div className="grid min-w-0 gap-[clamp(18px,2vw,26px)]">{children}</div>
      </main>
    </div>
  )
}

export default StudentLayout
