import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import CompanySidebar from '../components/ui/CompanySidebar'

const CompanyLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f2f6fb]">
      <CompanySidebar collapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      
      <main className="flex-1 h-screen overflow-y-auto py-8 px-10 bg-[#f2f6fb]">
        <div className="max-w-[1280px] w-full mx-auto flex flex-col gap-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default CompanyLayout