import { Outlet } from 'react-router-dom'
import CompanySidebar from '../components/ui/CompanySidebar'

const CompanyLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f2f6fb]">
      <CompanySidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default CompanyLayout