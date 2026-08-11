import { api } from './api.service'

const unwrap = (res: any) => res.data?.data

const unwrapList = (res: any, ...keys: string[]): any[] => {
  const data = unwrap(res)
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []
  for (const k of keys) if (Array.isArray(data[k])) return data[k]
  const firstArray = Object.values(data).find((v) => Array.isArray(v))
  return (firstArray as any[]) ?? []
}

// ============================================================
// TIPE
// ============================================================
export interface AdminUser {
  id: string
  name: string
  email: string
  phone?: string | null
  role: string
  status: string
  created_at?: string
}

export interface AdminCompany {
  id: string
  name: string
  industry?: string | null
  size?: string | null
  address?: string | null
  website?: string | null
  nib?: string | null
  izinUsahaUrl?: string | null
  suratResmiUrl?: string | null
  description?: string | null
  logoUrl?: string | null
  status: 'pending' | 'verified' | 'rejected'
  verifiedAt?: string | null
  created_at?: string
  members?: { userId: string; position: string; user: AdminUser }[]
}

// ============================================================
// PENGGUNA
// ============================================================
export const adminUserApi = {
  // GET /users?role=&status=&search=
  list: async (params?: { role?: string; status?: string; search?: string; page?: number }): Promise<AdminUser[]> =>
    unwrapList(await api.get('/users', { params }), 'users'),

  getById: async (id: string): Promise<AdminUser> => unwrap(await api.get(`/users/${id}`)),

  // POST /users/university-admin -> buat akun Admin Kampus
  createUniversityAdmin: async (payload: {
    name: string
    email: string
    password: string
    universityId?: string
    universityName?: string
    universityCode?: string
  }) => unwrap(await api.post('/users/university-admin', payload)),

  suspend: async (id: string) => unwrap(await api.patch(`/users/${id}/suspend`)),
  activate: async (id: string) => unwrap(await api.patch(`/users/${id}/activate`)),
  remove: async (id: string) => unwrap(await api.delete(`/users/${id}`)),
}

// ============================================================
// VERIFIKASI PERUSAHAAN
// ============================================================
export const adminCompanyApi = {
  // GET /companies?status=pending
  list: async (params?: { status?: string }): Promise<AdminCompany[]> =>
    unwrapList(await api.get('/companies', { params }), 'companies'),

  // GET /companies/:id/review -> detail lengkap + dokumen legal + kontak direktur
  getForReview: async (id: string): Promise<AdminCompany> =>
    unwrap(await api.get(`/companies/${id}/review`)),

  // PATCH /companies/:id/verify -> mengirim email pemberitahuan otomatis
  verify: async (id: string, message?: string) =>
    unwrap(await api.patch(`/companies/${id}/verify`, { message })),

  // PATCH /companies/:id/reject -> akun DIHAPUS permanen + email pemberitahuan
  reject: async (id: string, reason: string) =>
    unwrap(await api.patch(`/companies/${id}/reject`, { reason })),
}

// ============================================================
// RINGKASAN SISTEM
// ============================================================
export const adminAnalyticsApi = {
  // GET /analytics/overview
  overview: async () => unwrap(await api.get('/analytics/overview')),

  // GET /analytics/applications -> distribusi status lamaran
  applications: async () => unwrap(await api.get('/analytics/applications')),
}