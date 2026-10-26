import { api } from './api.service'

// Backend membungkus respons: { success, message, data, meta }
const unwrap = (res: any) => res.data?.data

const unwrapList = (res: any, ...keys: string[]): any[] => {
  const data = unwrap(res)
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []
  for (const k of keys) {
    if (Array.isArray(data[k])) return data[k]
  }
  const firstArray = Object.values(data).find((v) => Array.isArray(v))
  return (firstArray as any[]) ?? []
}

// ============================================================
// TIPE
// ============================================================
export interface StudentProfile {
  id: string
  nim?: string | null
  major?: string | null
  faculty?: string | null
  semester?: number | null
  gpa?: number | null
  entryYear?: number | null
  bio?: string | null
  user?: { id: string; name: string; email: string; phone?: string | null }
  university?: { id: string; name: string } | null
  skills?: { skill: { id: string; name: string; category?: string | null }; source?: string }[]
  subjectsTaken?: {
    semester?: number | null
    score?: number | null
    grade?: string | null
    subject: { id: string; code?: string | null; name: string; sks?: number | null }
  }[]
  certificates?: { id: string; title: string; issuer?: string | null; status: string; fileUrl?: string | null }[]
}

export interface StudentCompetency {
  gpa?: number | null
  semester?: number | null
  major?: string | null
  totalSkills: number
  bySource: Record<string, number>
  skills: { id: string; name: string; category?: string | null; source: string }[]
}

export interface JobMatch {
  id: string
  title: string
  department?: string | null
  location?: string | null
  type?: string | null
  salaryMin?: number | null
  salaryMax?: number | null
  createdAt?: string
  company?: { id: string; name: string; logoUrl?: string | null }
  requiredSkills: { id: string; name: string }[]
  matchScore: number
  matchMethod?: string
  matchedSkills?: { skillId?: string; id?: string; name: string }[]
  gapSkills?: { skillId?: string; id?: string; name: string }[]
  isFavorite?: boolean
  hasApplied?: boolean
  applicationStatus?: string | null
  deprioritized?: boolean
}

export interface AcademicCloItem {
  id: string
  code: string
  description: string
  skills: string[]
  score: number | null
}

export interface AcademicCourse {
  id: string
  code?: string | null
  name: string
  sks?: number | null
  semester?: number | null
  grade?: string | null
  score?: number | null
  clos: AcademicCloItem[]
}

export interface AcademicTranscript {
  student: {
    id: string
    nim?: string | null
    major?: string | null
    faculty?: string | null
    semester?: number | null
    gpa?: number | null
    entryYear?: number | null
    university?: { id: string; name: string } | null
    user?: { id: string; name: string; email: string; phone?: string | null }
  }
  stats: {
    gpa?: number | null
    totalSks: number
    totalClo: number
    totalCourses: number
  }
  courses: AcademicCourse[]
}

export interface RequirementCloItem {
  id: string
  kode: string
  deskripsi: string
  matkul: string
  nilai: string
  skorKemiripan: number
  bobotNilai: number
  kontribusi: number
}

export interface RequirementAnalysis {
  id: string
  deskripsi: string
  matchScore: number
  cloItems: RequirementCloItem[]
}

export interface JobMatchDetail {
  job: {
    id: string
    title: string
    department?: string | null
    company?: { id: string; name: string }
    requiredSkills: { id: string; name: string }[]
    requirements: { id: string; requirement: string; skills: string[] }[]
  }
  matchScore: number
  matchMethod?: string
  // analisis per persyaratan: sama dengan yang dilihat HRD di detail kandidat
  requirementAnalysis: RequirementAnalysis[]
  coveredRequirements?: number | null
  matchedSkills?: { skillId?: string; id?: string; name: string }[]
  gapSkills?: { skillId?: string; id?: string; name: string }[]
}

export interface MyApplication {
  id: string
  status: string
  statusLabel?: string
  matchScore?: number | null
  appliedAt?: string
  job?: {
    id: string
    title: string
    location?: string | null
    type?: string | null
    company?: { id: string; name: string; logoUrl?: string | null }
  }
}

export interface FavoriteJob {
  id: string
  jobId?: string
  created_at?: string
  job: {
    id: string
    title: string
    department?: string | null
    location?: string | null
    type?: string | null
    status?: string
    company?: { id: string; name: string; logoUrl?: string | null }
  }
}

export interface MyCertificate {
  id: string
  title: string
  issuer?: string | null
  issuedAt?: string | null
  credentialId?: string | null
  status: 'pending' | 'approved' | 'rejected' | string
  fileUrl?: string | null
  fileType?: string | null
  note?: string | null
  reviewedAt?: string | null
  created_at?: string
  skills?: { skill: { id: string; name: string } }[]
}

export interface MyInvitation {
  id: string
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | string
  message?: string | null
  created_at?: string
  respondedAt?: string | null
  matchScore?: number
  job?: { id: string; title: string; department?: string | null; type?: string | null }
  company?: { id: string; name: string } | null
}

export interface NotificationItem {
  id: string
  type?: string
  title?: string
  message?: string
  body?: string
  isRead?: boolean
  readAt?: string | null
  created_at?: string
  createdAt?: string
}

export interface CompanyPublicProfile {
  id: string
  name: string
  industry?: string | null
  description?: string | null
  website?: string | null
  logoUrl?: string | null
  size?: string | null
  address?: string | null
  status?: string
  jobs: {
    id: string
    title: string
    department?: string | null
    location?: string | null
    type?: string | null
    created_at?: string
  }[]
}

// ============================================================
// PROFIL & KOMPETENSI
// ============================================================
export const studentProfileApi = {
  // GET /students/me
  getProfile: async (): Promise<StudentProfile> => unwrap(await api.get('/students/me')),

  // PATCH /students/me
  updateProfile: async (payload: Record<string, unknown>) =>
    unwrap(await api.patch('/students/me', payload)),

  // GET /students/me/competency
  getCompetency: async (): Promise<StudentCompetency> =>
    unwrap(await api.get('/students/me/competency')),

  // GET /students/me/academic -> transkrip per matkul + nilai tiap CLO
  getAcademic: async (): Promise<AcademicTranscript> =>
    unwrap(await api.get('/students/me/academic')),
}

// ============================================================
// REKOMENDASI PEKERJAAN (matching)
// ============================================================
export const studentMatchingApi = {
  // GET /matching/jobs?search=
  listJobs: async (search?: string): Promise<JobMatch[]> =>
    unwrapList(await api.get('/matching/jobs', { params: search ? { search } : undefined }), 'jobs'),

  // GET /matching/jobs/:jobId -> detail kecocokan + rincian per persyaratan
  jobDetail: async (jobId: string): Promise<JobMatchDetail> =>
    unwrap(await api.get(`/matching/jobs/${jobId}`)),
}

// ============================================================
// LOWONGAN (info umum)
// ============================================================
export const studentJobApi = {
  // GET /jobs/:id -> info lengkap lowongan (lokasi, tipe, deskripsi, dll.)
  getById: async (jobId: string) => unwrap(await api.get(`/jobs/${jobId}`)),
}

// ============================================================
// LAMARAN
// ============================================================
export const studentApplicationApi = {
  // POST /applications
  apply: async (jobId: string, coverLetter?: string) =>
    unwrap(await api.post('/applications', { jobId, coverLetter })),

  // GET /applications/me
  listMine: async (): Promise<MyApplication[]> =>
    unwrapList(await api.get('/applications/me'), 'applications'),

  // DELETE /applications/:id -> tarik lamaran
  withdraw: async (applicationId: string) =>
    unwrap(await api.delete(`/applications/${applicationId}`)),
}

// ============================================================
// PEKERJAAN TERSIMPAN (bookmark / favorit)
// ============================================================
export const studentFavoriteApi = {
  // GET /interactions/favorites
  list: async (): Promise<FavoriteJob[]> =>
    unwrapList(await api.get('/interactions/favorites'), 'favorites'),

  // POST /interactions/favorites
  add: async (jobId: string) => unwrap(await api.post('/interactions/favorites', { jobId })),

  // DELETE /interactions/favorites/:jobId
  remove: async (jobId: string) => unwrap(await api.delete(`/interactions/favorites/${jobId}`)),
}

// ============================================================
// PENCATATAN KUNJUNGAN LOWONGAN
// Dipakai sebagai sinyal perilaku untuk pemeringkatan sekaligus
// bahan tren aktivitas pada dashboard Super Admin.
// ============================================================
export type ViewSource = 'detail' | 'list' | 'search' | 'recommendation'

export const studentViewApi = {
  // POST /interactions/views -> kembalikan id log agar durasinya bisa dilengkapi
  record: async (jobId: string, source: ViewSource = 'detail'): Promise<string | null> => {
    const data = unwrap(await api.post('/interactions/views', { jobId, source }))
    return data?.id ?? null
  },

  // PATCH /interactions/views/:id/duration -> lama mahasiswa membaca lowongan
  updateDuration: async (viewId: string, durationMs: number) =>
    unwrap(await api.patch(`/interactions/views/${viewId}/duration`, { durationMs })),
}

// ============================================================
// SERTIFIKAT
// ============================================================
export const studentCertificateApi = {
  // GET /certificates/me
  listMine: async (): Promise<MyCertificate[]> =>
    unwrapList(await api.get('/certificates/me'), 'certificates'),

  // POST /certificates (multipart: file + title + issuer + issuedAt +
  // credentialId + skills). skills dikirim sebagai CSV, backend memecahnya.
  upload: async (payload: {
    title: string
    issuer?: string
    issuedAt?: string
    credentialId?: string
    skills?: string[]
    file?: File
  }) => {
    const fd = new FormData()
    fd.append('title', payload.title)
    if (payload.issuer) fd.append('issuer', payload.issuer)
    if (payload.issuedAt) fd.append('issuedAt', payload.issuedAt)
    if (payload.credentialId) fd.append('credentialId', payload.credentialId)
    if (payload.skills?.length) fd.append('skills', payload.skills.join(','))
    if (payload.file) fd.append('file', payload.file)
    return unwrap(await api.post('/certificates', fd))
  },
}

// ============================================================
// UNDANGAN REKRUTMEN
// ============================================================
export const studentInvitationApi = {
  // GET /invitations/me
  listMine: async (): Promise<MyInvitation[]> =>
    unwrapList(await api.get('/invitations/me'), 'invitations'),

  // PATCH /invitations/:id/respond { action: 'accept' | 'decline' }
  respond: async (invitationId: string, action: 'accept' | 'decline') =>
    unwrap(await api.patch(`/invitations/${invitationId}/respond`, { action })),
}

// ============================================================
// NOTIFIKASI
// ============================================================
export const studentNotificationApi = {
  // GET /notifications
  list: async (): Promise<NotificationItem[]> =>
    unwrapList(await api.get('/notifications'), 'notifications'),

  // GET /notifications/unread-count
  unreadCount: async (): Promise<number> => {
    const data = unwrap(await api.get('/notifications/unread-count'))
    if (typeof data === 'number') return data
    return data?.count ?? data?.unread ?? 0
  },

  // PATCH /notifications/:id/read
  markRead: async (id: string) => unwrap(await api.patch(`/notifications/${id}/read`)),

  // PATCH /notifications/read-all
  markAllRead: async () => unwrap(await api.patch('/notifications/read-all')),
}

// ============================================================
// PERUSAHAAN (profil publik untuk mahasiswa)
// ============================================================
export const studentCompanyApi = {
  // GET /companies/:id/public
  getPublicProfile: async (companyId: string): Promise<CompanyPublicProfile> =>
    unwrap(await api.get(`/companies/${companyId}/public`)),
}
