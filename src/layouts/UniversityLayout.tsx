import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import UniversitySidebar from '../components/ui/UniversitySidebar'
import Header from '../components/ui/Header' 

const UniversityLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f2f6fb]">
      <UniversitySidebar collapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      <div className="flex flex-1 flex-col overflow-hidden">
         <Header />

        <main className="flex-1 overflow-y-auto py-8 px-10 bg-[#f2f6fb]">
          <div className="max-w-[1280px] w-full mx-auto flex flex-col gap-6">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}

export default UniversityLayout