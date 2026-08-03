// ==========================================
// 1. TIPE & KATALOG MATA KULIAH (dipakai Dashboard)
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
// 3. "DATABASE" SEMENTARA (Akan diganti API Asli nantinya)
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
  { id: 'n1', studentId: '1', code: 'CLO 1', course: 'Algoritma dan Pemrograman', description: 'Mampu mengimplementasikan berbagai struktur data...', skills: ['Data Structures', 'Algorithms'], score: 92 },
  { id: 'n2', studentId: '1', code: 'CLO 2', course: 'Sistem Basis Data', description: 'Mampu merancang sistem basis data...', skills: ['Database', 'SQL'], score: 88 },
  { id: 'n7', studentId: '2', code: 'CLO 1', course: 'Algoritma dan Pemrograman', description: 'Mampu mengimplementasikan...', skills: ['Data Structures', 'Algorithms'], score: 90 },
]

let sertifikatDatabase: SertifikatMahasiswa[] = [
  { id: 'c1', studentId: '1', title: 'Google Cloud Certified', issuer: 'Cloud Digital Leader', date: 'Dec 2023', status: 'VERIFIED' },
  { id: 'c5', studentId: '2', title: 'Certified Scrum Master', issuer: 'Scrum Alliance', date: 'Jan 2024', status: 'VERIFIED' },
]

// ==========================================
// 4. MANAJEMEN DATA MATA KULIAH (MASTER)
// ==========================================
export interface Subject {
  id: string;
  code: string;
  name: string;
  sks: number;
  semester: number;
  cloCount: number;
}

export const subjectStatsData = {
  totalSubjects: 46,
  totalCLO: 157,
  noCLO: 2
};

// Data Dummy Mata Kuliah (cloCount disinkronkan dengan database CLO di bawah)
export const initialSubjects: Subject[] = [
  { id: '1', code: 'ADP', name: 'Algoritma dan Pemrograman', sks: 4, semester: 1, cloCount: 3 },
  { id: '2', code: 'ADPB', name: 'Arsitektur dan Pengembangan Backend', sks: 3, semester: 2, cloCount: 2 },
  { id: '3', code: 'ADPSI', name: 'Analisis dan Perancangan Sistem Informasi', sks: 3, semester: 1, cloCount: 2 },
  { id: '4', code: 'AE', name: 'Arsitektur Enterprise', sks: 3, semester: 1, cloCount: 0 },
  { id: '5', code: 'ATI', name: 'Adopsi Teknologi Informasi', sks: 3, semester: 2, cloCount: 0 },
  { id: '6', code: 'BI', name: 'Bahasa Indonesia', sks: 2, semester: 1, cloCount: 0 },
];

// ==========================================
// 5. MANAJEMEN DATA DETAIL CLO MATA KULIAH
// ==========================================
export interface SubjectCLO {
  id: string;
  subjectId: string;
  code: string;
  description: string;
  skills: string[];
}

// DATABASE CLO DINAMIS (Berisi CLO untuk berbagai Mata Kuliah)
export let subjectCloDatabase: SubjectCLO[] = [
  // --- CLO UNTUK ADP (id: 1) ---
  {
    id: 'clo1', subjectId: '1', code: 'CLO 1',
    description: 'Memahami dasar-dasar pemrograman komputer meliputi sejarah, cara kerja, perkembangan, serta pentingnya belajar bahasa pemrograman, dan mampu menguraikan konsep flowchart serta pseudocode.',
    skills: ['Logic Building', 'Flowcharting', 'Pseudocode', 'Basic Programming', 'Debugging']
  },
  {
    id: 'clo2', subjectId: '1', code: 'CLO 2',
    description: 'Mampu merancang algoritma dengan memberikan contoh penggunaan algoritma sederhana serta mampu membuat solusi program untuk menyelesaikan permasalahan atau kasus nyata yang sederhana.',
    skills: ['Algorithm Design', 'Problem Solving', 'Computational Thinking']
  },
  {
    id: 'clo3', subjectId: '1', code: 'CLO 3',
    description: 'Mampu mengimplementasikan algoritma sederhana untuk menciptakan solusi program yang menyelesaikan permasalahan atau kasus nyata.',
    skills: ['Software Implementation', 'Complexity Analysis', 'Applied Algorithms']
  },
  
  // --- CLO UNTUK ADPB (id: 2) ---
  {
    id: 'clo4', subjectId: '2', code: 'CLO 1',
    description: 'Mampu memahami dan merancang arsitektur backend modern menggunakan pola desain RESTful API dan Microservices untuk skalabilitas aplikasi.',
    skills: ['Backend Architecture', 'RESTful API', 'Microservices', 'System Design']
  },
  {
    id: 'clo5', subjectId: '2', code: 'CLO 2',
    description: 'Mampu mengelola integrasi database relasional dan non-relasional serta mengamankan endpoint menggunakan autentikasi JWT.',
    skills: ['Database Management', 'Security', 'JWT', 'Integration']
  },

  // --- CLO UNTUK ADPSI (id: 3) ---
  {
    id: 'clo6', subjectId: '3', code: 'CLO 1',
    description: 'Mampu menganalisis kebutuhan sistem informasi dalam sebuah organisasi menggunakan metode observasi dan wawancara.',
    skills: ['Requirement Analysis', 'Observation', 'Data Gathering']
  },
  {
    id: 'clo7', subjectId: '3', code: 'CLO 2',
    description: 'Mampu memodelkan proses bisnis dan merancang sistem menggunakan Unified Modeling Language (UML).',
    skills: ['Business Process Modeling', 'UML', 'System Design']
  }
];

// ==========================================
// 6. SERVICE — PINTU UTAMA AKSES DATA
// ==========================================
export const UniversityService = {
  getStudents: async (): Promise<Student[]> => {
    return [...studentsDatabase]
  },

  getSubjects: async (): Promise<Subject[]> => {
    return [...initialSubjects];
  },
  
  deleteSubject: async (id: string): Promise<void> => {
    const index = initialSubjects.findIndex(s => s.id === id);
    if (index > -1) {
      initialSubjects.splice(index, 1);
    }
  },

  saveSubject: async (newSubject: Subject): Promise<void> => {
    initialSubjects.unshift(newSubject); 
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
      ...student, cloDetails, certifications, totalClo: cloDetails.length, certificationsCount: certifications.length,
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

  getDashboardStats: async (): Promise<DashboardStats> => {
    const uniqueCloCodes = new Set(nilaiDatabase.map(n => n.code))
    return {
      students: studentsDatabase.length, courses: pendingCourses.length, totalCLO: uniqueCloCodes.size, gradesInputted: nilaiDatabase.length,
    }
  },

  // --- FUNGSI MANAJEMEN DETAIL CLO ---
  getCLOsBySubject: async (subjectId: string): Promise<SubjectCLO[]> => {
    return subjectCloDatabase.filter(c => c.subjectId === subjectId);
  },

  saveCLO: async (record: SubjectCLO): Promise<void> => {
    const index = subjectCloDatabase.findIndex(c => c.id === record.id);
    if (index > -1) {
      subjectCloDatabase[index] = record;
    } else {
      subjectCloDatabase.push(record);
    }
    
    const subjectIndex = initialSubjects.findIndex(s => s.id === record.subjectId);
    if (subjectIndex > -1) {
      initialSubjects[subjectIndex].cloCount = subjectCloDatabase.filter(c => c.subjectId === record.subjectId).length;
    }
  },

  deleteCLO: async (id: string): Promise<void> => {
    const clo = subjectCloDatabase.find(c => c.id === id);
    if (clo) {
      subjectCloDatabase = subjectCloDatabase.filter(c => c.id !== id);
      const subjectIndex = initialSubjects.findIndex(s => s.id === clo.subjectId);
      if (subjectIndex > -1) {
        initialSubjects[subjectIndex].cloCount = subjectCloDatabase.filter(c => c.subjectId === clo.subjectId).length;
      }
    }
  },
}