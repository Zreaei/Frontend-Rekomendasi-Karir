// ==========================================
// 1. MANAJEMEN DATA STATISTIK DASHBOARD

export interface DashboardStats {
  students: number;
  courses: number;
  totalCLO: number;
  gradesInputted: number;
}

export const universityStats: DashboardStats = {
  students: 10,
  courses: 46,
  totalCLO: 157,
  gradesInputted: 296
};

// ==========================================
// 2. MANAJEMEN DATA MATA KULIAH (PENILAIAN)

export interface CLO {
  id: string;
  name: string;
  status: 'Selesai' | 'Sebagian' | 'Belum';
  graded: number;
  total: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  cloCount: number;
  gradedStudents: number;
  totalStudents: number;
  status: 'Sebagian' | 'Selesai' | 'Belum';
  clos: CLO[];
}

export const pendingCourses: Course[] = [
  {
    id: '1',
    name: 'Bahasa Indonesia',
    code: 'BI',
    cloCount: 3,
    gradedStudents: 6,
    totalStudents: 10,
    status: 'Sebagian',
    clos: [
      { id: 'clo1', name: 'CLO 1: Pemahaman Dasar Tata Bahasa', status: 'Selesai', graded: 10, total: 10 },
      { id: 'clo2', name: 'CLO 2: Kemampuan Menulis Akademik', status: 'Sebagian', graded: 6, total: 10 },
      { id: 'clo3', name: 'CLO 3: Analisis Teks Sastra', status: 'Belum', graded: 0, total: 10 },
    ]
  },
  {
    id: '2',
    name: 'Bahasa Inggris',
    code: 'BI2',
    cloCount: 4,
    gradedStudents: 6,
    totalStudents: 10,
    status: 'Sebagian',
    clos: []
  },
  {
    id: '3',
    name: 'Etika Profesi',
    code: 'EP',
    cloCount: 2,
    gradedStudents: 6,
    totalStudents: 10,
    status: 'Sebagian',
    clos: []
  },
  {
    id: '4',
    name: 'Internalisasi Budaya dan Pembentukan Karakter',
    code: 'IBDPK',
    cloCount: 3,
    gradedStudents: 6,
    totalStudents: 10,
    status: 'Sebagian',
    clos: []
  }
];