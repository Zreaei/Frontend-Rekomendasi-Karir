import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

interface PublicRouteProps {
  children: ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, role } = useAuthStore()

  if (!isAuthenticated) return <>{children}</>

  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />
  if (role === 'university') return <Navigate to="/university/dashboard" replace />
  if (role === 'company') return <Navigate to="/company/dashboard" replace />
  if (role === 'university_staff') return <Navigate to="/university-staff/dashboard" replace />
  if (role === 'company_staff') return <Navigate to="/company-staff/dashboard" replace />
  if (role === 'student') return <Navigate to="/student/dashboard" replace />

  return <Navigate to="/landing" replace />
}

export default PublicRoute
