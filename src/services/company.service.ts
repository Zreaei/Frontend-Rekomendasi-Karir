import { api } from './api.service'

// Backend membungkus respons: { success, message, data, meta }
const unwrap = (res: any) => res.data?.data

// Beberapa endpoint mengembalikan array langsung, sebagian membungkusnya
// ({ jobs: [...] }, { applications: [...] }, dst). Normalisasi di satu tempat
// supaya halaman tidak perlu peduli bentuknya.
const unwrapList = (res: any, ...keys: string[]): any[] => {
  const data = unwrap(res)
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []
  for (const k of keys) {
    if (Array.isArray(data[k])) return data[k]
  }
  // fallback: ambil array pertama yang ditemukan di dalam objek
  const firstArray = Object.values(data).find((v) => Array.isArray(v))
  return (firstArray as any[]) ?? []
}

// GET /companies/me bisa berupa { ...company } atau { company: {...}, stats: {...} }
const unwrapCompany = (res: any) => {
  const data = unwrap(res)
  return data?.company ?? data ?? {}
}

// ============================================================
// TIPE
// ============================================================
export interface CompanyProfile {
  id: string
  name: string
  industry?: string | null
  description?: string | null
  website?: string | null
  logoUrl?: string | null
  size?: string | null
  address?: string | null
  nib?: string | null
  rejectionReason?: string | null
  rejectedAt?: string | null
  izinUsahaUrl?: string | null
  suratResmiUrl?: string | null
  status: 'pending' | 'verified' | 'rejected'
  verifiedAt?: string | null
}

export interface JobRequirementItem {
  requirement: string
  skills: string[]
}

export interface Job {
  id: string
  title: string
  department?: string | null
  description?: string | null
  location?: string | null
  type: string
  status: string
  salaryMin?: number | null
  salaryMax?: number | null
  postingDate?: string | null
  deadline?: string | null
  createdAt: string
  skills: { id: string; name: string }[]
  requirements: { id: string; requirement: string; skills: string[] }[]
}

// Payload buat/ubah lowongan dipisah jadi tipe bernama supaya tidak ada
// referensi melingkar (jobApi mengacu ke dirinya sendiri) yang ditolak TypeScript.
export interface CreateJobPayload {
  title: string
  department: string
  type: string
  location: string
  description?: string
  salaryMin?: number
  salaryMax?: number
  status?: string          // 'active' | 'draft'
  postingDate?: string     // format YYYY-MM-DD
  deadline?: string
  requirements: JobRequirementItem[]
}

export type UpdateJobPayload = Partial<CreateJobPayload> & { status?: string }

export interface Applicant {
  id: string            // applicationId (untuk ubah status)
  status: string
  statusLabel?: string
  matchScore?: number
  coverLetter?: string | null
  created_at?: string
  createdAt?: string
  job?: { id: string; title: string; department?: string | null; type?: string }
  student: {
    id: string
    nim?: string | null
    major?: string | null
    semester?: number | null
    user?: { id: string; name: string; email: string; phone?: string | null }
    university?: { id: string; name: string } | null
  }
}

export interface Candidate {
  studentId: string
  matchScore: number
  matchedSkills: { id: string; name: string }[]
  gapSkills: { id: string; name: string }[]
  student?: any
}

export interface JobStats {
  jobId: string
  applicantCount: number
  favoriteCount: number
  viewCount: number
  totalDurationMs: number
  avgDurationMs: number
}

// ============================================================
// PROFIL PERUSAHAAN
// ============================================================
export const companyApi = {
  // GET /companies/me
  getProfile: async (): Promise<CompanyProfile> => unwrapCompany(await api.get('/companies/me')),

  // PATCH /companies/me
  updateProfile: async (payload: Partial<CompanyProfile>) =>
    unwrap(await api.patch('/companies/me', payload)),

  // PATCH /companies/me/logo -> unggah logo ke Supabase, kembalikan URL publik
  uploadLogo: async (file: File): Promise<{ logoUrl: string }> => {
    const fd = new FormData()
    fd.append('logo', file)
    return unwrap(await api.patch('/companies/me/logo', fd))
  },

  // PATCH /companies/me/documents -> unggah ulang dokumen legal.
  // Bila status sedang ditolak, pengajuan otomatis dikembalikan ke pending.
  uploadDocuments: async (files: { izinUsaha?: File; suratResmi?: File }) => {
    const fd = new FormData()
    if (files.izinUsaha) fd.append('izinUsaha', files.izinUsaha)
    if (files.suratResmi) fd.append('suratResmi', files.suratResmi)
    return unwrap(await api.patch('/companies/me/documents', fd))
  },
}

// ============================================================
// LOWONGAN
// ============================================================
export const jobApi = {
  // GET /jobs/mine
  listMine: async (): Promise<Job[]> => unwrapList(await api.get('/jobs/mine'), 'jobs'),

  getById: async (jobId: string): Promise<Job> => unwrap(await api.get(`/jobs/${jobId}`)),

  // POST /jobs -> format baru: department + requirements[]
  create: async (payload: CreateJobPayload): Promise<Job> =>
    unwrap(await api.post('/jobs', payload)),

  update: async (jobId: string, payload: UpdateJobPayload): Promise<Job> =>
    unwrap(await api.patch(`/jobs/${jobId}`, payload)),

  close: async (jobId: string) => unwrap(await api.patch(`/jobs/${jobId}/close`)),

  remove: async (jobId: string) => unwrap(await api.delete(`/jobs/${jobId}`)),

  // GET /interactions/signals/job/:jobId
  stats: async (jobId: string): Promise<JobStats> =>
    unwrap(await api.get(`/interactions/signals/job/${jobId}`)),
}

// ============================================================
// PELAMAR
// ============================================================
export const applicationApi = {
  // GET /applications/job/:jobId -> pelamar satu lowongan
  listByJob: async (jobId: string): Promise<Applicant[]> =>
    unwrapList(await api.get(`/applications/job/${jobId}`), 'applications'),

  // GET /applications/company -> semua pelamar perusahaan sekali request
  listByCompany: async (params?: {
    jobId?: string
    status?: string
    search?: string
  }): Promise<{ applications: Applicant[]; summary: Record<string, number> }> => {
    const res = await api.get('/applications/company', { params })
    const data = unwrap(res)
    return {
      applications: Array.isArray(data) ? data : (data?.applications ?? []),
      summary: data?.summary ?? {},
    }
  },

  // PATCH /applications/:id/status
  updateStatus: async (applicationId: string, status: 'processing' | 'accepted' | 'rejected') =>
    unwrap(await api.patch(`/applications/${applicationId}/status`, { status })),
}

// ============================================================
// REKOMENDASI KANDIDAT
// ============================================================
export const matchingApi = {
  // GET /matching/candidates/detail/:studentId -> profil + analisis kesesuaian
  candidateDetail: async (studentId: string, jobId?: string) => {
    const res = await api.get(`/matching/candidates/detail/${studentId}`, {
      params: jobId ? { jobId } : undefined,
    })
    return unwrap(res)
  },
  
  // GET /matching/candidates/:jobId -> mahasiswa terurut match score
  candidates: async (jobId: string): Promise<Candidate[]> =>
    unwrapList(await api.get(`/matching/candidates/${jobId}`), 'candidates'),

  // GET /matching/candidates -> talent pool lintas lowongan
  companyCandidates: async (params?: { jobId?: string }) => {
    const res = await api.get('/matching/candidates', { params })
    const data = res.data?.data
    return {
      candidates: (data?.candidates ?? []) as any[],
      jobs: (data?.jobs ?? []) as { id: string; title: string }[],
    }
  },
}

// ============================================================
// MAHASISWA (detail kandidat)
// ============================================================
export const studentApi = {
  getById: async (studentId: string) => unwrap(await api.get(`/students/${studentId}`)),
}

// ============================================================
// UNDANGAN KANDIDAT
// ============================================================
export const invitationApi = {
  // POST /invitations -> undang kandidat ke sebuah lowongan
  invite: async (jobId: string, studentId: string, message?: string) =>
    unwrap(await api.post('/invitations', { jobId, studentId, message })),

  // GET /invitations/company
  listByCompany: async (params?: { jobId?: string; status?: string }) => {
    const res = await api.get('/invitations/company', { params })
    const data = unwrap(res)
    return {
      invitations: (data?.invitations ?? []) as any[],
      summary: (data?.summary ?? {}) as Record<string, number>,
    }
  },

  // PATCH /invitations/:id/cancel
  cancel: async (invitationId: string) =>
    unwrap(await api.patch(`/invitations/${invitationId}/cancel`)),
}