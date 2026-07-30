// ==========================================
// 1. TIPE & KATALOG MATA KULIAH (dipakai Dashboard & Manajemen CLO)
// ==========================================
export interface CLO {
  id: string
  name: string
  status: 'Selesai' | 'Sebagian' | 'Belum'
  graded: number
  total: number
}

export interface Course {
  id: string
  name: string
  code: string
  cloCount: number
  gradedStudents: number
  totalStudents: number
  status: 'Sebagian' | 'Selesai' | 'Belum'
  clos: CLO[]
}

export const pendingCourses: Course[] = [
  {
    id: '1', name: 'Bahasa Indonesia', code: 'BI', cloCount: 3, gradedStudents: 6, totalStudents: 10, status: 'Sebagian',
    clos: [
      { id: 'clo1', name: 'CLO 1: Pemahaman Dasar Tata Bahasa', status: 'Selesai', graded: 10, total: 10 },
      { id: 'clo2', name: 'CLO 2: Kemampuan Menulis Akademik', status: 'Sebagian', graded: 6, total: 10 },
      { id: 'clo3', name: 'CLO 3: Analisis Teks Sastra', status: 'Belum', graded: 0, total: 10 },
    ]
  },
  { id: '2', name: 'Bahasa Inggris', code: 'BI2', cloCount: 4, gradedStudents: 6, totalStudents: 10, status: 'Sebagian', clos: [] },
  { id: '3', name: 'Etika Profesi', code: 'EP', cloCount: 2, gradedStudents: 6, totalStudents: 10, status: 'Sebagian', clos: [] },
  { id: '4', name: 'Internalisasi Budaya dan Pembentukan Karakter', code: 'IBDPK', cloCount: 3, gradedStudents: 6, totalStudents: 10, status: 'Sebagian', clos: [] }
]

// ==========================================
// 2. TIPE DATA MAHASISWA, NILAI (CLO), DAN SERTIFIKAT
// ==========================================
export interface Student {
  id: string
  nim: string
  name: string
  email: string
  faculty: string
  major: string
  year: string
  gpa: string
  status: 'Active' | 'Inactive' | 'Graduated'
  initial: string
  bgColor: string
  avatarUrl?: string
  totalSks: number
}

export interface NilaiMahasiswa {
  id: string
  studentId: string
  code: string
  course: string
  description: string
  skills: string[]
  score: number
}

export interface SertifikatMahasiswa {
  id: string
  studentId: string
  title: string
  issuer: string
  date: string
  status: 'VERIFIED' | 'PENDING_REVIEW'
  url?: string
}

export interface StudentDetail extends Student {
  totalClo: number
  certificationsCount: number
  cloDetails: NilaiMahasiswa[]
  certifications: SertifikatMahasiswa[]
}

export interface DashboardStats {
  students: number
  courses: number
  totalCLO: number
  gradesInputted: number
}

// ==========================================
// 3. "DATABASE" SEMENTARA (nanti diganti fetch API asli, cukup di sini)
// ==========================================
const facultyMajorDatabase: Record<string, string[]> = {
  'Fakultas Teknik': ['Teknik Sipil', 'Teknik Mesin'],
  'Fakultas Ilmu Komputer': ['Teknik Informatika', 'Sistem Informasi'],
  'Fakultas Ekonomi Bisnis': ['Manajemen Bisnis', 'Akuntansi']
}

let studentsDatabase: Student[] = [
  { id: '1', nim: '21104410052', name: 'Aditya Dharmawan', email: 'aditya.d@student.univ.ac.id', faculty: 'Fakultas Ilmu Komputer', major: 'Teknik Informatika', year: '2021', gpa: '3.85', status: 'Active', initial: 'AD', bgColor: 'bg-blue-100 text-blue-600', totalSks: 112 },
  { id: '2', nim: '2021008241', name: 'Siti Maryam', email: 'siti.m@unimed.ac.id', faculty: 'Fakultas Ilmu Komputer', major: 'Sistem Informasi', year: '2021', gpa: '3.92', status: 'Active', initial: 'SM', bgColor: 'bg-indigo-100 text-indigo-600', totalSks: 112 },
  { id: '3', nim: '2022015099', name: 'Rizky Nugraha', email: 'rizky.n@usu.ac.id', faculty: 'Fakultas Ekonomi Bisnis', major: 'Manajemen Bisnis', year: '2022', gpa: '3.75', status: 'Active', initial: 'RN', bgColor: 'bg-emerald-100 text-emerald-600', totalSks: 112 },
  { id: '4', nim: '2020001122', name: 'Farah Az-zahra', email: 'farah.a@unp.ac.id', faculty: 'Fakultas Teknik', major: 'Teknik Sipil', year: '2020', gpa: '3.88', status: 'Active', initial: 'FA', bgColor: 'bg-rose-100 text-rose-600', totalSks: 112 },
]

let nilaiDatabase: NilaiMahasiswa[] = [
  { id: 'n1', studentId: '1', code: 'CLO 1', course: 'Algoritma dan Pemrograman', description: 'Mampu mengimplementasikan berbagai struktur data (array, stack, queue, tree, graph) dan algoritma pencarian serta pengurutan yang efisien untuk menyelesaikan permasalahan komputasi kompleks.', skills: ['Data Structures', 'Algorithms'], score: 92 },
  { id: 'n2', studentId: '1', code: 'CLO 2', course: 'Sistem Basis Data', description: 'Mampu merancang, mengimplementasikan, dan mengoptimalkan sistem basis data terdistribusi yang skalabel, aman, dan berkinerja tinggi untuk kebutuhan industri modern.', skills: ['Database', 'SQL'], score: 88 },
  { id: 'n3', studentId: '1', code: 'CLO 3', course: 'Cloud Computing', description: 'Mampu membangun arsitektur sistem berbasis cloud yang handal, toleran terhadap kegagalan, dan efisien biaya menggunakan penyedia layanan cloud ternama.', skills: ['Cloud Computing', 'AWS'], score: 95 },
  { id: 'n4', studentId: '1', code: 'CLO 4', course: 'Desain Pengalaman Pengguna (UI/UX)', description: 'Mampu merancang antarmuka pengguna yang intuitif dan responsif menggunakan prinsip desain UX modern dan tools prototyping terkini.', skills: ['UI/UX Design', 'Figma'], score: 90 },
  { id: 'n5', studentId: '1', code: 'CLO 5', course: 'Pemrograman Berbasis Objek', description: 'Memahami dan menerapkan arsitektur microservices untuk membangun sistem yang skalabel, modular, dan terdistribusi.', skills: ['Docker', 'Kubernetes'], score: 85 },
  { id: 'n6', studentId: '1', code: 'CLO 6', course: 'Dasar-Dasar Pengujian Perangkat Lunak', description: 'Mampu melakukan pengujian perangkat lunak secara otomatis dan memastikan kualitas kode sesuai standar industri dan best practices.', skills: ['QA', 'Testing'], score: 88 },

  { id: 'n7', studentId: '2', code: 'CLO 1', course: 'Algoritma dan Pemrograman', description: 'Mampu mengimplementasikan berbagai struktur data dan algoritma pencarian serta pengurutan yang efisien.', skills: ['Data Structures', 'Algorithms'], score: 90 },
  { id: 'n8', studentId: '2', code: 'CLO 2', course: 'Analisis Sistem Informasi', description: 'Mampu menganalisis kebutuhan bisnis dan merancang sistem informasi yang sesuai.', skills: ['System Analysis', 'UML'], score: 91 },

  { id: 'n9', studentId: '3', code: 'CLO 1', course: 'Manajemen Pemasaran', description: 'Mampu menyusun strategi pemasaran berbasis data untuk produk dan jasa.', skills: ['Marketing Strategy'], score: 87 },

  { id: 'n10', studentId: '4', code: 'CLO 1', course: 'Struktur Beton Bertulang', description: 'Mampu merancang struktur beton bertulang sesuai standar keselamatan konstruksi.', skills: ['Structural Design'], score: 89 },
]

let sertifikatDatabase: SertifikatMahasiswa[] = [
  { id: 'c1', studentId: '1', title: 'Google Cloud Certified', issuer: 'Cloud Digital Leader', date: 'Dec 2023', status: 'VERIFIED', url: 'https://www.credly.com/badges/google-cloud-certified' },
  { id: 'c2', studentId: '1', title: 'Advanced Machine Learning', issuer: 'Coursera', date: 'Sep 2023', status: 'VERIFIED', url: 'https://www.coursera.org/account/accomplishments' },
  { id: 'c3', studentId: '1', title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: 'Jun 2023', status: 'VERIFIED', url: 'https://www.credly.com/badges/aws-cloud-practitioner' },
  { id: 'c4', studentId: '1', title: 'Professional Data Analyst', issuer: 'IBM Data Science', date: 'Feb 2024', status: 'PENDING_REVIEW' },

  { id: 'c5', studentId: '2', title: 'Certified Scrum Master', issuer: 'Scrum Alliance', date: 'Jan 2024', status: 'VERIFIED', url: 'https://www.scrumalliance.org/community/profile/verify' },
]

// ==========================================
// 4. SERVICE — SATU-SATUNYA PINTU YANG BOLEH DIPAKAI HALAMAN LAIN
//    Nanti kalau backend sudah jadi, isi tiap fungsi ini yang diganti
//    (dari baca array in-memory jadi fetch ke API), halaman lain tidak perlu diubah.
// ==========================================
export const UniversityService = {
  getStudents: async (): Promise<Student[]> => {
    return [...studentsDatabase]
  },

  getStudentStats: async (): Promise<{ total: number; active: number; graduated: number }> => {
    return {
      total: studentsDatabase.length,
      active: studentsDatabase.filter(s => s.status === 'Active').length,
      graduated: studentsDatabase.filter(s => s.status === 'Graduated').length,
    }
  },

  getStudentDetail: async (studentId: string): Promise<StudentDetail | undefined> => {
    const student = studentsDatabase.find(s => s.id === studentId)
    if (!student) return undefined

    const cloDetails = nilaiDatabase.filter(n => n.studentId === studentId)
    const certifications = sertifikatDatabase.filter(c => c.studentId === studentId)

    return {
      ...student,
      cloDetails,
      certifications,
      totalClo: cloDetails.length,
      certificationsCount: certifications.length,
    }
  },

  getFacultyMajorMap: async (): Promise<Record<string, string[]>> => {
    return facultyMajorDatabase
  },

  saveStudent: async (updatedStudent: Student): Promise<void> => {
    const index = studentsDatabase.findIndex(s => s.id === updatedStudent.id)
    if (index > -1) {
      studentsDatabase[index] = { ...studentsDatabase[index], ...updatedStudent }
    } else {
      studentsDatabase.unshift(updatedStudent)
    }
  },

  deleteStudent: async (id: string): Promise<void> => {
    const index = studentsDatabase.findIndex(s => s.id === id)
    if (index > -1) {
      studentsDatabase.splice(index, 1)
    }
    nilaiDatabase = nilaiDatabase.filter(n => n.studentId !== id)
    sertifikatDatabase = sertifikatDatabase.filter(c => c.studentId !== id)
  },

  getNilaiByStudent: async (studentId: string): Promise<NilaiMahasiswa[]> => {
    return nilaiDatabase.filter(n => n.studentId === studentId)
  },

  saveNilai: async (record: NilaiMahasiswa): Promise<void> => {
    const index = nilaiDatabase.findIndex(n => n.id === record.id)
    if (index > -1) {
      nilaiDatabase[index] = record
    } else {
      nilaiDatabase.push(record)
    }
  },

  getSertifikatByStudent: async (studentId: string): Promise<SertifikatMahasiswa[]> => {
    return sertifikatDatabase.filter(c => c.studentId === studentId)
  },

  saveSertifikat: async (record: SertifikatMahasiswa): Promise<void> => {
    const index = sertifikatDatabase.findIndex(c => c.id === record.id)
    if (index > -1) {
      sertifikatDatabase[index] = record
    } else {
      sertifikatDatabase.push(record)
    }
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const uniqueCloCodes = new Set(nilaiDatabase.map(n => n.code))
    return {
      students: studentsDatabase.length,
      courses: pendingCourses.length,
      totalCLO: uniqueCloCodes.size,
      gradesInputted: nilaiDatabase.length,
    }
  },
}