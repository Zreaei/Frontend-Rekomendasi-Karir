import { api } from './api.service'

const unwrap = (res: any) => res.data?.data
const unwrapMeta = (res: any) => res.data?.meta

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
  status: string // active | pending | suspended | deleted
  created_at?: string
  student?: {
    id: string
    nim?: string | null
    major?: string | null
    university?: { id: string; name: string } | null
  } | null
  universityMember?: {
    position: string
    nip?: string | null
    university?: { id: string; name: string } | null
  } | null
  companyMember?: {
    position: string
    nip?: string | null
    company?: { id: string; name: string } | null
  } | null
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
  rejectionReason?: string | null
  rejectedAt?: string | null
  created_at?: string
  members?: { userId: string; position: string; user: AdminUser }[]
  _count?: { jobs: number; members: number }
}

export interface AdminUniversity {
  id: string
  name: string
  code: string
  city?: string | null
  address?: string | null
  website?: string | null
  created_at?: string
  totalStudents: number
  totalMembers: number
  admin: {
    id: string
    name: string | null
    email: string
    phone?: string | null
    status: string // active | pending | suspended
    lastLoginAt?: string | null
  } | null
}

export interface ActivityTrendPoint {
  date: string // YYYY-MM-DD
  jobViews: number
  applications: number
}

export interface AdminActivityLog {
  id: string
  time: string // ISO
  actorName: string | null
  orgName: string | null
  activity: string
  detail: string | null
  subDetail: string | null
  durationMs?: number | null
}

export interface RecentSystemLog {
  id: string
  action: string
  time: string // ISO
  type: 'info' | 'warning' | 'success'
}

export interface MasterCourseRow {
  id: string
  courseName: string
  courseCode?: string | null
  sks?: number | null
  semester?: number | null
  universityName: string | null
  cloCount: number
  clos: { id: string; name: string; text: string; skills: string[] }[]
  updatedAt: string
}

export interface MasterIndustryRow {
  id: string
  companyName: string
  industry?: string | null
  position: string
  /** Tiap tanggung jawab beserta keahlian yang dibutuhkannya. */
  responsibilities: { requirement: string; skills: string[] }[]
  updatedAt: string
}

export interface SystemOverview {
  universities: number
  students: number
  companies: { total: number; verified: number; pending: number }
  jobs: { total: number; active: number }
  applications: number
  subjects: number
}

export interface MasterDataStats {
  programStudi: number
  mataKuliah: number
  clo: number
}

export interface ListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

// ============================================================
// PENGGUNA
// ============================================================
export const adminUserApi = {
  // GET /users?role=&status=&search=&page=&limit=
  list: async (params?: {
    role?: string
    status?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<{ users: AdminUser[]; meta?: ListMeta }> => {
    const res = await api.get('/users', { params })
    return { users: unwrapList(res, 'users'), meta: unwrapMeta(res) }
  },

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

  // PATCH /users/:id -> edit profil pengguna dari Manajemen Pengguna
  update: async (
    id: string,
    payload: {
      name?: string
      email?: string
      phone?: string
      status?: 'active' | 'pending' | 'suspended' | 'deleted'
      major?: string
      nip?: string
    },
  ) => unwrap(await api.patch(`/users/${id}`, payload)),

  suspend: async (id: string) => unwrap(await api.patch(`/users/${id}/suspend`)),
  activate: async (id: string) => unwrap(await api.patch(`/users/${id}/activate`)),
  remove: async (id: string) => unwrap(await api.delete(`/users/${id}`)),
}

// ============================================================
// VERIFIKASI & KELOLA PERUSAHAAN
// ============================================================
export const adminCompanyApi = {
  // GET /companies?status=pending&search=
  list: async (params?: {
    status?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<{ companies: AdminCompany[]; meta?: ListMeta }> => {
    const res = await api.get('/companies', { params })
    return { companies: unwrapList(res, 'companies'), meta: unwrapMeta(res) }
  },

  // GET /companies/:id/review -> detail lengkap + dokumen legal + kontak direktur
  getForReview: async (id: string): Promise<AdminCompany> =>
    unwrap(await api.get(`/companies/${id}/review`)),

  // PATCH /companies/:id -> Super Admin mengedit profil perusahaan
  update: async (
    id: string,
    payload: {
      name?: string
      industry?: string
      description?: string
      website?: string
      size?: string
      address?: string
      nib?: string
    },
  ) => unwrap(await api.patch(`/companies/${id}`, payload)),

  // PATCH /companies/:id/verify -> mengirim email pemberitahuan otomatis
  verify: async (id: string, message?: string) =>
    unwrap(await api.patch(`/companies/${id}/verify`, { message })),

  // PATCH /companies/:id/reject -> status rejected + email pemberitahuan
  reject: async (id: string, reason: string) =>
    unwrap(await api.patch(`/companies/${id}/reject`, { reason })),

  // PATCH /companies/:id/reevaluate -> cabut status, kembali ke pending
  reevaluate: async (id: string) => unwrap(await api.patch(`/companies/${id}/reevaluate`)),
}

// ============================================================
// KELOLA UNIVERSITAS
// ============================================================
export const adminUniversityApi = {
  // GET /universities?search=&page=&limit=
  list: async (params?: {
    search?: string
    page?: number
    limit?: number
  }): Promise<{ universities: AdminUniversity[]; meta?: ListMeta }> => {
    const res = await api.get('/universities', { params })
    return { universities: unwrapList(res, 'universities'), meta: unwrapMeta(res) }
  },

  getById: async (id: string): Promise<AdminUniversity> =>
    unwrap(await api.get(`/universities/${id}`)),

  // POST /universities -> buat universitas + akun Admin Kampus sekaligus
  create: async (payload: {
    name: string
    city: string
    address: string
    website: string
    code?: string
    admin: { name: string; email: string; password: string; phone?: string; nip?: string }
  }) => unwrap(await api.post('/universities', payload)),

  // PATCH /universities/:id -> edit data universitas + admin utamanya
  update: async (
    id: string,
    payload: {
      name?: string
      city?: string
      address?: string
      website?: string
      adminName?: string
      adminStatus?: 'active' | 'pending' | 'suspended'
    },
  ): Promise<AdminUniversity> => unwrap(await api.patch(`/universities/${id}`, payload)),

  // DELETE /universities/:id -> hapus universitas + akun admin terkait
  remove: async (id: string) => unwrap(await api.delete(`/universities/${id}`)),
}

// ============================================================
// RINGKASAN SISTEM, TREN & LOG (dashboard Super Admin)
// ============================================================
export const adminAnalyticsApi = {
  // GET /analytics/overview
  overview: async (): Promise<SystemOverview> => unwrap(await api.get('/analytics/overview')),

  // GET /analytics/applications -> distribusi status lamaran
  applications: async () => unwrap(await api.get('/analytics/applications')),

  // GET /analytics/activity-trends?days=30
  activityTrends: async (days: number): Promise<ActivityTrendPoint[]> =>
    unwrapList(await api.get('/analytics/activity-trends', { params: { days } })),

  // GET /analytics/activity-logs?group=&activity=&search=&page=&limit=
  activityLogs: async (params: {
    group: 'student' | 'university' | 'company'
    activity?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<{ logs: AdminActivityLog[]; meta?: ListMeta }> => {
    const res = await api.get('/analytics/activity-logs', { params })
    return { logs: unwrapList(res, 'logs'), meta: unwrapMeta(res) }
  },

  // GET /analytics/recent-logs?limit=5
  recentLogs: async (limit = 5): Promise<RecentSystemLog[]> =>
    unwrapList(await api.get('/analytics/recent-logs', { params: { limit } })),

  // GET /analytics/master/courses
  masterCourses: async (params?: {
    search?: string
    page?: number
    limit?: number
  }): Promise<{ courses: MasterCourseRow[]; meta?: ListMeta }> => {
    const res = await api.get('/analytics/master/courses', { params })
    return { courses: unwrapList(res, 'courses'), meta: unwrapMeta(res) }
  },

  // GET /analytics/master/industries
  masterIndustries: async (params?: {
    search?: string
    page?: number
    limit?: number
  }): Promise<{ industries: MasterIndustryRow[]; meta?: ListMeta }> => {
    const res = await api.get('/analytics/master/industries', { params })
    return { industries: unwrapList(res, 'industries'), meta: unwrapMeta(res) }
  },

  // GET /analytics/master/stats
  masterStats: async (): Promise<MasterDataStats> =>
    unwrap(await api.get('/analytics/master/stats')),
}

// ============================================================
// HELPER LABEL STATUS (mapping istilah backend -> label UI)
// ============================================================
export const USER_STATUS_LABEL: Record<string, string> = {
  active: 'Aktif',
  pending: 'Pending',
  suspended: 'Ditangguhkan',
  deleted: 'Dihapus',
}

export const COMPANY_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  verified: 'Terverifikasi',
  rejected: 'Ditolak',
}

export const getInitialsOf = (name?: string | null) =>
  (name ?? '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

export const formatDateID = (iso?: string | null, withTime = false) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  const date = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  if (!withTime) return date
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  return `${date}, ${time}`
}
