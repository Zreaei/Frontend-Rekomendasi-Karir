import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'university' | 'company' | 'university_staff' | 'company_staff' | 'student' | null

interface AuthState {
	isAuthenticated: boolean
	role: UserRole
	token: string | null
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
			// Default state
			isAuthenticated: false,
			role: null,
			token: null,
			
			// Actions
			loginAsAdmin: (token) => set({ 
				isAuthenticated: true,
				role: 'admin',
				token: token ?? null 
			}),
			loginAsUniversity: (token) => set({ 
				isAuthenticated: true, 
				role: 'university', 
				token: token ?? null 
			}),
			loginAsCompany: (token) => set({ 
				isAuthenticated: true, 
				role: 'company', 
				token: token ?? null 
			}),
			loginAsUniversityStaff: (token) => set({ 
				isAuthenticated: true, 
				role: 'university_staff', 
				token: token ?? null 
			}),
			loginAsCompanyStaff: (token) => set({ 
				isAuthenticated: true, 
				role: 'company_staff', 
				token: token ?? null 
			}),
			loginAsStudent: (token) => set({ 
				isAuthenticated: true, 
				role: 'student', 
				token: token ?? null 
			}),
			logout: () => set({ 
				isAuthenticated: false,
				role: null, 
				token: null 
			}),
			setAuthenticated: (value) => set({ 
				isAuthenticated: value 
			}),
			setRole: (role) => set({ 
				role 
			}),
			setToken: (token) => set({ 
				token 
			}),
		}),
		{ name: 'auth-store' },
	),
)