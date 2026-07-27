import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'university' | 'company' | 'university_staff' | 'company_staff' | 'student' | null

// Data user dari API login (backend: data.user)
export interface AuthUser {
	id: string
	name: string
	email: string
	role: Exclude<UserRole, null>
	status: string
}

interface AuthState {
	isAuthenticated: boolean
	role: UserRole
	token: string | null
	user: AuthUser | null
	// ===== login berbasis API (dipakai LoginPage) =====
	loginWithApi: (user: AuthUser, token: string) => void
	// ===== action lama (biarkan; masih dipakai komponen lain) =====
	loginAsAdmin: (token?: string | null) => void
	loginAsUniversity: (token?: string | null) => void
	loginAsCompany: (token?: string | null) => void
	loginAsUniversityStaff: (token?: string | null) => void
	loginAsCompanyStaff: (token?: string | null) => void
	loginAsStudent: (token?: string | null) => void
	logout: () => void
	setAuthenticated: (value: boolean) => void
	setRole: (role: UserRole) => void
	setToken: (token: string | null) => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			isAuthenticated: false,
			role: null,
			token: null,
			user: null,

			// Login hasil API: simpan user + token + role sekaligus.
			// Token juga ke localStorage "accessToken" (dipakai interceptor axios).
			loginWithApi: (user, token) => {
				localStorage.setItem('accessToken', token)
				set({
					isAuthenticated: true,
					role: user.role,
					token,
					user,
				})
			},

			loginAsAdmin: (token) => set({ isAuthenticated: true, role: 'admin', token: token ?? null }),
			loginAsUniversity: (token) => set({ isAuthenticated: true, role: 'university', token: token ?? null }),
			loginAsCompany: (token) => set({ isAuthenticated: true, role: 'company', token: token ?? null }),
			loginAsUniversityStaff: (token) => set({ isAuthenticated: true, role: 'university_staff', token: token ?? null }),
			loginAsCompanyStaff: (token) => set({ isAuthenticated: true, role: 'company_staff', token: token ?? null }),
			loginAsStudent: (token) => set({ isAuthenticated: true, role: 'student', token: token ?? null }),

			logout: () => {
				localStorage.removeItem('accessToken')
				set({ isAuthenticated: false, role: null, token: null, user: null })
			},

			setAuthenticated: (value) => set({ isAuthenticated: value }),
			setRole: (role) => set({ role }),
			setToken: (token) => set({ token }),
		}),
		{ name: 'auth-store' },
	),
)