import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore, type UserRole } from '../store/auth.store'

interface ProtectedRouteProps {
	children: ReactNode // The component(s) to render if access is granted
	redirectTo?: string // Redirect path if not authenticated
	allowedRoles?: UserRole[] // Roles allowed to access the route
}

const ProtectedRoute = ({ children, redirectTo = '/login', allowedRoles }: ProtectedRouteProps) => {
	const { isAuthenticated, role } = useAuthStore()

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} replace />
	}

	if (allowedRoles && (!role || !allowedRoles.includes(role))) {
		return <Navigate to="/landing" replace />
	}

	return <>{children}</>
}

export default ProtectedRoute