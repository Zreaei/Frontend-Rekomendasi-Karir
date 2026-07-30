// ==========================================
// 1. MANAJEMEN DATA STATISTIK DASHBOARD
// ==========================================
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
// ==========================================
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
];

// ==========================================
// 3. MANAJEMEN DATA MAHASISWA (SINKRON DGN EDIT)
// ==========================================
export interface Student {
  id: string;
  nim: string;
  name: string;
  email: string;
  faculty: string; // Dinamis, string biasa bukan enum hardcode
  major: string;
  year: string;
  gpa: string; // IPK Wajib Ada
  status: 'Active' | 'Inactive' | 'Graduated';
  initial: string;
  bgColor: string;
}

export const studentStatsData = {
  total: '1,284',
  active: '1,150',
  graduated: '134'
};

// Data Relasi Master (Akan diganti API /api/fakultas-prodi)
const mockFacultyMajorDB: Record<string, string[]> = {
  'Fakultas Teknik': ['Teknik Sipil', 'Teknik Mesin'],
  'Fakultas Ilmu Komputer': ['Teknik Informatika', 'Sistem Informasi'],
  'Fakultas Ekonomi Bisnis': ['Manajemen Bisnis', 'Akuntansi']
};

export const initialStudents: Student[] = [
  { id: '1', nim: '2021008234', name: 'Aditya Dharmawan', email: 'aditya.d@usk.ac.id', faculty: 'Fakultas Ilmu Komputer', major: 'Teknik Informatika', year: '2021', gpa: '3.85', status: 'Active', initial: 'AD', bgColor: 'bg-blue-100 text-blue-600' },
  { id: '2', nim: '2021008241', name: 'Siti Maryam', email: 'siti.m@unimed.ac.id', faculty: 'Fakultas Ilmu Komputer', major: 'Sistem Informasi', year: '2021', gpa: '3.92', status: 'Active', initial: 'SM', bgColor: 'bg-indigo-100 text-indigo-600' },
  { id: '3', nim: '2022015099', name: 'Rizky Nugraha', email: 'rizky.n@usu.ac.id', faculty: 'Fakultas Ekonomi Bisnis', major: 'Manajemen Bisnis', year: '2022', gpa: '3.75', status: 'Active', initial: 'RN', bgColor: 'bg-emerald-100 text-emerald-600' },
  { id: '4', nim: '2020001122', name: 'Farah Az-zahra', email: 'farah.a@unp.ac.id', faculty: 'Fakultas Teknik', major: 'Teknik Sipil', year: '2020', gpa: '3.88', status: 'Active', initial: 'FA', bgColor: 'bg-rose-100 text-rose-600' },
];

// Service Layer asinkron, siap dihubungkan ke Axios/Fetch
export const UniversityService = {
  getStudents: async (): Promise<Student[]> => {
    // Simulasi delay API
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...initialStudents];
  },
  // API untuk mengambil Data Master Relasi (Fakultas & Prodi)
  getFacultyMajorMap: async (): Promise<Record<string, string[]>> => {
    return mockFacultyMajorDB;
  },
  saveStudent: async (updatedStudent: Student): Promise<void> => {
    // Logika simpan simulasi
    const index = initialStudents.findIndex(s => s.id === updatedStudent.id);
    if (index > -1) {
      initialStudents[index] = updatedStudent;
    } else {
      initialStudents.unshift(updatedStudent);
    }
  },
  deleteStudent: async (id: string): Promise<void> => {
    const index = initialStudents.findIndex(s => s.id === id);
    if (index > -1) {
      initialStudents.splice(index, 1);
    }
  }
};