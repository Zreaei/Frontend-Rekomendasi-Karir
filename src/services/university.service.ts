import { api } from './api.service'

// Backend membungkus respons: { success, message, data, meta }
const unwrap = (res: any) => res.data?.data

// Sebagian endpoint mengembalikan array langsung, sebagian membungkusnya.
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
export interface Subject {
  id: string
  code: string
  name: string
  sks: number
  semester?: number | null
  cloCount?: number
  skills?: { id: string; name: string }[]
}

export interface CLO {
  id: string
  subjectId: string
  code?: string | null
  description?: string | null
  paraphrase?: string | null
}

export interface StudentRow {
  id: string                 // studentId
  nim?: string | null
  major?: string | null
  semester?: number | null
  gpa?: number | null
  user?: { id: string; name: string; email: string; phone?: string | null }
  university?: { id: string; name: string } | null
  skills?: any[]
}

export interface CertificateRow {
  id: string
  title: string
  issuer?: string | null
  status: string
  fileUrl?: string | null
  created_at?: string
  student?: StudentRow
}

// ============================================================
// MATA KULIAH & CLO
// ============================================================
export const subjectApi = {
  // GET /subjects
  list: async (params?: { search?: string }): Promise<Subject[]> =>
    unwrapList(await api.get('/subjects', { params }), 'subjects'),

  getById: async (id: string): Promise<Subject> => unwrap(await api.get(`/subjects/${id}`)),

  // GET /subjects/:id/clos
  listClos: async (subjectId: string): Promise<any[]> =>
    unwrapList(await api.get(`/subjects/${subjectId}/clos`), 'clos'),

  createClo: async (subjectId: string, payload: { code: string; description: string; skills: string[] }) =>
    unwrap(await api.post(`/subjects/${subjectId}/clos`, payload)),

  updateClo: async (cloId: string, payload: { code?: string; description?: string; skills?: string[] }) =>
    unwrap(await api.patch(`/subjects/clos/${cloId}`, payload)),

  deleteClo: async (cloId: string, force = false) =>
    unwrap(await api.delete(`/subjects/clos/${cloId}`, { params: force ? { force: true } : undefined })),

  create: async (payload: {
    code: string
    name: string
    sks: number
    semester?: number
    skills?: string[]
  }) => unwrap(await api.post('/subjects', payload)),

  // PATCH /subjects/:id -> termasuk mengatur daftar keahlian matkul
  update: async (
    id: string,
    payload: Partial<{ code: string; name: string; sks: number; semester: number; skills: string[] }>,
  ) => unwrap(await api.patch(`/subjects/${id}`, payload)),

  remove: async (id: string) => unwrap(await api.delete(`/subjects/${id}`)),
}

// ============================================================
// NILAI (memicu mesin OBE: lulus -> skill matkul masuk ke mahasiswa)
// ============================================================
export const gradeApi = {
  // POST /grades
  input: async (payload: {
    studentId: string
    subjectId: string
    score?: number
    grade?: string
    semester?: number
  }) => unwrap(await api.post('/grades', payload)),

  // GET /grades/student/:studentId
  listByStudent: async (studentId: string): Promise<any[]> =>
    unwrapList(await api.get(`/grades/student/${studentId}`), 'grades'),

  remove: async (studentId: string, subjectId: string) =>
    unwrap(await api.delete(`/grades/student/${studentId}/subject/${subjectId}`)),
}

// ============================================================
// MAHASISWA
// ============================================================
export const studentApi = {
  // GET /students
  list: async (params?: { search?: string; page?: number }): Promise<StudentRow[]> =>
    unwrapList(await api.get('/students', { params }), 'students'),

  remove: async (studentId: string) => unwrap(await api.delete(`/students/${studentId}`)),

  // GET /students/:id/detail -> profil + ringkasan + nilai per CLO
  getDetail: async (id: string) => unwrap(await api.get(`/students/${id}/detail`)),

  getById: async (id: string): Promise<StudentRow> => unwrap(await api.get(`/students/${id}`)),

  // studentApi
  update: async (id: string, payload: any) => unwrap(await api.patch(`/students/${id}`, payload)),
  facultyMajorMap: async (): Promise<Record<string, string[]>> =>
    unwrap(await api.get('/students/faculty-major-map')) ?? {},
}

// ============================================================
// IMPOR MAHASISWA
// ============================================================
export const importApi = {
  // POST /import/students -> password awal = NIM
  addOne: async (payload: {
    name: string
    email: string
    nim: string
    major?: string
    semester?: number
  }) => unwrap(await api.post('/import/students', payload)),

  // POST /import/students/csv -> kolom: name, email, nim, major, semester
  uploadCsv: async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return unwrap(await api.post('/import/students/csv', fd))
  },
}

// ============================================================
// VERIFIKASI SERTIFIKAT
// ============================================================
export const certificateApi = {
  // GET /certificates/pending
  listPending: async (): Promise<CertificateRow[]> =>
    unwrapList(await api.get('/certificates/pending'), 'certificates'),

  approve: async (id: string) => unwrap(await api.patch(`/certificates/${id}/approve`)),

  // GET /certificates -> seluruh sertifikat (semua status)
  list: async (params?: { status?: string }): Promise<CertificateRow[]> =>
    unwrapList(await api.get('/certificates', { params }), 'certificates'),

  reject: async (id: string, note?: string) =>
    unwrap(await api.patch(`/certificates/${id}/reject`, { note })),

  getById: async (id: string) => unwrap(await api.get(`/certificates/${id}`)),

  updateSkills: async (id: string, skills: string[]) =>
    unwrap(await api.patch(`/certificates/${id}/skills`, { skills })),

  setPending: async (id: string) => unwrap(await api.patch(`/certificates/${id}/pending`)),
}

// ============================================================
// ANALITIK (Kaprodi)
// ============================================================
export const analyticsApi = {
  // GET /analytics/skill-trends -> keahlian yang paling banyak diminta lowongan
  skillTrends: async (limit = 10): Promise<any[]> =>
    unwrapList(await api.get('/analytics/skill-trends', { params: { limit } }), 'trends', 'skills'),
}

// ============================================================
// MASTER KEAHLIAN
// ============================================================
export const skillApi = {
  list: async (params?: { search?: string }): Promise<{ id: string; name: string; category?: string }[]> =>
    unwrapList(await api.get('/skills', { params }), 'skills'),

  create: async (payload: { name: string; category?: string }) =>
    unwrap(await api.post('/skills', payload)),
}

// ============================================================
// DASHBOARD KAMPUS
// ============================================================
export interface DashboardStats {
  students: number
  courses: number
  totalCLO: number
  gradesInputted: number
}

export interface CourseProgress {
  id: string
  code: string
  name: string
  sks: number
  semester: number | null
  cloCount: number
  gradedStudents: number
  totalStudents: number
  status: 'Selesai' | 'Sebagian' | 'Belum'
  clos: { id: string; name: string; graded: number; total: number; status: string }[]
}

export const universityDashboardApi = {
  // GET /analytics/university/dashboard
  get: async (): Promise<{ stats: DashboardStats; courses: CourseProgress[] }> => {
    const data = unwrap(await api.get('/analytics/university/dashboard'))
    return {
      stats: data?.stats ?? { students: 0, courses: 0, totalCLO: 0, gradesInputted: 0 },
      courses: data?.courses ?? [],
    }
  },
}

export interface SubjectGradeData {
  subject: { id: string; code: string; name: string; sks: number; semester: number | null }
  clos: { id: string; code: string; description: string; weight: number }[]
  students: { id: string; nim: string; name: string; email: string | null; grades: Record<string, number> }[]
}

export const cloGradeApi = {
  // GET /grades/subject/:subjectId
  getBySubject: async (subjectId: string): Promise<SubjectGradeData> =>
    unwrap(await api.get(`/grades/subject/${subjectId}`)),

  // PATCH /grades/subject/:subjectId/clo-weights
  setWeights: async (subjectId: string, weights: { cloId: string; weight: number }[]) =>
    unwrap(await api.patch(`/grades/subject/${subjectId}/clo-weights`, { weights })),

  // POST /grades/clo
  save: async (studentId: string, subjectId: string, scores: { cloId: string; score: number }[]) =>
    unwrap(await api.post('/grades/clo', { studentId, subjectId, scores })),
}
