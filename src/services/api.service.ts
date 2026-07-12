import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '../store/auth.store'

export const API_BASE_URL = 'http://localhost:5000/api'

// Read persisted token from zustand storage
export function getPersistedToken(): string | null {
  try {
    const raw = localStorage.getItem('auth-store')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const token = parsed?.state?.token || parsed?.token || null
    return token ? String(token) : null
  } catch {
    return null
  }
}

export function attachAuthInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use((config) => {
    // Normalize headers type
    const headers: Record<string, any> = (config.headers as any) || {}
    const hasAuth = !!headers.Authorization
    if (!hasAuth) {
      // Prefer persisted token; fallback to Zustand store state
      let token = getPersistedToken()
      if (!token) {
        try {
          token = useAuthStore.getState().token || null
        } catch {
          token = null
        }
      }
      if (token) {
        const t = String(token).replace(/^Bearer\s+/i, '')
        headers.Authorization = `Bearer ${t}`
      }
    }
    config.headers = headers as any
    return config
  })

  // Response interceptor to handle 401/403 errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status
      if (status === 401 || status === 403) {
        // Token expired or invalid - logout and redirect to login
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
}

// Default API instance with interceptor (optional for services to reuse)
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

attachAuthInterceptor(api)