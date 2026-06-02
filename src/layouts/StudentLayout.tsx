import type { ReactNode } from 'react'
import StudentSidebar from '../components/ui/StudentSidebar'

interface StudentLayoutProps {
  children: ReactNode
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  return (
    <div className="grid min-h-screen grid-cols-[300px_minmax(0,1fr)] bg-white max-[1200px]:grid-cols-1">
      <StudentSidebar />
      <main className="min-w-0 overflow-x-hidden bg-white px-[clamp(42px,5vw,84px)] py-[clamp(36px,5vw,72px)] pb-10 pr-[clamp(24px,4vw,64px)] max-sm:px-5 max-sm:py-7">
        <div className="grid min-w-0 gap-[clamp(26px,3vw,36px)]">{children}</div>
      </main>
    </div>
  )
}

export default StudentLayout
