import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

interface PublicRouteProps {
  children: ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, role } = useAuthStore()

  if (!isAuthenticated) return <>{children}</>

  if (role === 'admin') return <Navigate to="/admin" replace />
  if (role === 'university') return <Navigate to="/university" replace />
  if (role === 'company') return <Navigate to="/company" replace />
  if (role === 'university_staff') return <Navigate to="/university-staff" replace />
  if (role === 'company_staff') return <Navigate to="/company-staff" replace />
  if (role === 'student') return <Navigate to="/student" replace />

  return <Navigate to="/landing" replace />
}

export default PublicRoute