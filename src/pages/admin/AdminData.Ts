// ==========================================
// INTERFACES
// ==========================================
export interface OverviewMetrics {
  totalUniversitas: number;
  totalMahasiswa: number;
  perusahaanTerverifikasi: number;
  totalLowongan: number;
}

export interface ActivityTrend {
  date: string;
  userLogin: number;
  jobViews: number;
}

export interface VerificationQueue {
  id: string;
  name: string;
  industry: string;
  initials: string;
}

export interface MasterDataStats {
  programStudi: number;
  mataKuliah: number;
  clo: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface CompanyMetrics {
  total: number;
  pending: number;
  verified: number;
}

export interface CompanyVerificationData {
  id: string;
  name: string;
  industry: string;
  email: string;
  phone: string;
  location: string;
  documents: string[];
  date: string;
  status: 'pending' | 'terverifikasi' | 'ditolak';
}

export interface CompanyDetail {
  id: string;
  companyName: string;
  adminName: string;
  adminEmail: string;
  industry: string;
  companySize: string;
  website: string;
  headquarters: string;
  description: string;
  status?: 'pending' | 'terverifikasi' | 'ditolak';
  submissionDate?: string;
  rejectionReason?: string;
  documents: {
    type: string;
    name: string;
    status?: 'verified' | 'pending' | 'rejected';
  }[];
}

export interface UniversityMetrics {
  total: number;
  activeAdmin: number;
}

export interface UniversityData {
  id: string;
  name: string;
  location: string;
  adminName: string;
  adminEmail: string;
  status: 'AKTIF' | 'PENDING';
  lastActive: string;
}

export interface StudentLog {
  id: string;
  time: string;
  name: string;
  initials: string;
  activity: 'Apply Job' | 'View Job' | 'Save Job';
  role: string;
  company: string;
  duration: string;
}

export interface UnivAdminLog {
  id: string;
  time: string;
  date: string;
  name: string;
  univ: string;
  activity: 'VERIFIKASI BERKAS' | 'UPDATE PROFIL' | 'TAMBAH MAHASISWA';
  detail: string;
  subDetail: string;
}

export interface CompanyAdminLog {
  id: string;
  time: string;
  date: string;
  name: string;
  company: string;
  activity: 'Post Lowongan' | 'View Kandidat' | 'Kirim Undangan';
  detail: string;
}

export interface MasterCourse {
  id: string;
  courseName: string;
  courseCode: string;
  category: string;
  univName: string;
  univInitials: string;
  cloCount: number;
  clos: { name: string; skills: string[] }[];
  lastUpdatedDate: string;
  lastUpdatedBy: string;
}

export interface MasterIndustry {
  id: string;
  companyName: string;
  companyInitials: string;
  industry: string;
  position: string;
  responsibility: string;
  skills: string[];
  lastUpdatedDate: string;
}

// ------------------------------------------
// TAMBAHAN INTERFACE MANAJEMEN PENGGUNA (BARU)
// ------------------------------------------
export interface UserManagementMetrics {
  totalUser: number;
  userAktif: number;
  akunDitangguhkan: number;
}

export interface StudentUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  univ: string;
  major: string;
  status: 'Aktif' | 'Ditangguhkan' | 'Dihapus';
}

export interface UnivAdminUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  univ: string;
  nip: string;
  status: 'Aktif' | 'Ditangguhkan' | 'Dihapus';
}

export interface CompanyAdminUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  company: string;
  nip: string;
  status: 'Aktif' | 'Ditangguhkan' | 'Dihapus';
  hasPhoto?: boolean;
}

// ------------------------------------------
// FILTER & STATUS OPTIONS TERPUSAT
// Semua opsi dropdown filter/status di seluruh halaman Super Admin
// wajib bersumber dari sini, tidak boleh di-hardcode langsung di UI.
// ------------------------------------------
export interface FilterOption {
  label: string;
  value: string;
}

export const companyStatusFilterOptions: FilterOption[] = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Terverifikasi', value: 'terverifikasi' },
  { label: 'Ditolak', value: 'ditolak' },
];

export const universityStatusFilterOptions: FilterOption[] = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Aktif', value: 'AKTIF' },
  { label: 'Pending', value: 'PENDING' },
];

export const universityStatusFormOptions: FilterOption[] = [
  { label: 'Aktif', value: 'AKTIF' },
  { label: 'Pending', value: 'PENDING' },
];

export const userStatusFilterOptions: FilterOption[] = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Aktif', value: 'Aktif' },
  { label: 'Ditangguhkan', value: 'Ditangguhkan' },
  { label: 'Dihapus', value: 'Dihapus' },
];

export const userStatusFormOptions: FilterOption[] = [
  { label: 'Aktif', value: 'Aktif' },
  { label: 'Ditangguhkan', value: 'Ditangguhkan' },
  { label: 'Dihapus', value: 'Dihapus' },
];

export const activityLogFilterOptions: Record<'mahasiswa' | 'universitas' | 'perusahaan', FilterOption[]> = {
  mahasiswa: [
    { label: 'Semua Aktivitas', value: 'all' },
    { label: 'Apply Job', value: 'Apply Job' },
    { label: 'Save Job', value: 'Save Job' },
    { label: 'View Job', value: 'View Job' },
  ],
  universitas: [
    { label: 'Semua Aktivitas', value: 'all' },
    { label: 'Verifikasi Berkas', value: 'VERIFIKASI BERKAS' },
    { label: 'Update Profil', value: 'UPDATE PROFIL' },
    { label: 'Tambah Mahasiswa', value: 'TAMBAH MAHASISWA' },
  ],
  perusahaan: [
    { label: 'Semua Aktivitas', value: 'all' },
    { label: 'Post Lowongan', value: 'Post Lowongan' },
    { label: 'Kirim Undangan', value: 'Kirim Undangan' },
    { label: 'View Kandidat', value: 'View Kandidat' },
  ],
};

export const masterDataTabOptions: FilterOption[] = [
  { label: 'Mata Kuliah', value: 'course' },
  { label: 'Kebutuhan Industri', value: 'industry' },
];


// ==========================================
// DUMMY DATA
// ==========================================

export const dummyActivityTrends: Record<'3' | '7' | '30', ActivityTrend[]> = {
  '3': [{ date: '03 Ags', userLogin: 8200, jobViews: 5800 }, { date: '04 Ags', userLogin: 7900, jobViews: 6100 }, { date: '05 Ags', userLogin: 8500, jobViews: 6400 }],
  '7': [{ date: '30 Jul', userLogin: 6200, jobViews: 4100 }, { date: '31 Jul', userLogin: 6800, jobViews: 4600 }, { date: '01 Ags', userLogin: 7100, jobViews: 5100 }, { date: '02 Ags', userLogin: 6500, jobViews: 4800 }, { date: '03 Ags', userLogin: 8200, jobViews: 5800 }, { date: '04 Ags', userLogin: 7900, jobViews: 6100 }, { date: '05 Ags', userLogin: 8500, jobViews: 6400 }],
  '30': [{ date: '12 Jul', userLogin: 5000, jobViews: 3500 }, { date: '17 Jul', userLogin: 5500, jobViews: 3800 }, { date: '22 Jul', userLogin: 6100, jobViews: 4200 }, { date: '27 Jul', userLogin: 5800, jobViews: 4000 }, { date: '01 Ags', userLogin: 7100, jobViews: 5100 }, { date: '05 Ags', userLogin: 8500, jobViews: 6400 }],
};

export const dummyActivityLogs: ActivityLog[] = [
  { id: '1', action: 'Admin Bli tolak verifikasi Univ. Siber Indonesia', time: '3 menit yang lalu', type: 'info' }, { id: '2', action: 'Sinkronisasi data master Prodi dari API PDDIKTI', time: '15 menit yang lalu', type: 'warning' }, { id: '3', action: 'Super Admin login melalui IP 192.168.1.182', time: '45 menit yang lalu', type: 'success' },
];

export const dummyCompanyList: CompanyVerificationData[] = [
  { id: '1', name: 'Skyline Tech Solutions', industry: 'Software Development', email: 'hr@skylinetech.id', phone: '+62 21 5550 1234', location: 'Jakarta Selatan, Indonesia', documents: ['NIB / SIUP', 'Company Profile'], date: '24 Okt 2023', status: 'pending' },
  { id: '2', name: 'EcoGreen Energy', industry: 'Renewable Resources', email: 'admin@ecogreen.org', phone: '+62 31 9992 4455', location: 'Surabaya, Jawa Timur', documents: ['NIB / SIUP', 'Company Profile'], date: '20 Okt 2023', status: 'terverifikasi' },
  { id: '3', name: 'Global Logistics Co.', industry: 'Transport & Cargo', email: 'contact@globallogistics.com', phone: '+62 21 4433 9900', location: 'Bekasi, Jawa Barat', documents: ['NIB / SIUP', 'Company Profile'], date: '18 Okt 2023', status: 'ditolak' },
  { id: '4', name: 'MedCare Pharma', industry: 'Healthcare & Medical', email: 'support@medcare.co.id', phone: '+62 21 3333 1122', location: 'Tangerang Selatan, Banten', documents: ['NIB / SIUP', 'Company Profile'], date: '15 Okt 2023', status: 'pending' },
];

export const dummyCompanyDetails: Record<string, CompanyDetail> = {
  '1': { id: '1', companyName: 'Skyline Tech Solutions', adminName: 'Sigit Kurnia', adminEmail: 'hr@skylinetech.id', industry: 'Software Development', companySize: '100 - 500 Karyawan', website: 'https://skylinetech.id', headquarters: 'Jakarta Selatan, Indonesia', description: 'Skyline Tech Solutions adalah perusahaan yang berfokus pada pengembangan perangkat lunak berbasis cloud dan solusi transformasi digital untuk berbagai sektor industri.', status: 'pending', submissionDate: '24 Okt 2023 • 14:32 WIB', documents: [{ type: 'Nomor NIB', name: '9120000000458', status: 'pending' }, { type: 'Izin Usaha', name: 'Skyline_Izin_Usaha.pdf' }, { type: 'Company Profile', name: 'Profile_Skyline.pdf' }] },
  '2': { id: '2', companyName: 'EcoGreen Energy', adminName: 'Aulia Fitria', adminEmail: 'admin@ecogreen.org', industry: 'Renewable Resources', companySize: '50 - 100 Karyawan', website: 'https://ecogreen.org', headquarters: 'Surabaya, Jawa Timur', description: 'EcoGreen berfokus pada energi terbarukan dan pengelolaan sumber daya ramah lingkungan untuk masa depan yang lebih baik.', status: 'terverifikasi', submissionDate: '20 Okt 2023 • 09:15 WIB', documents: [{ type: 'Nomor NIB', name: '8820000000123', status: 'verified' }, { type: 'Company Profile', name: 'EcoGreen_Profile.pdf' }] },
  '3': { id: '3', companyName: 'Global Logistics Co.', adminName: 'Budi Santoso', adminEmail: 'contact@globallogistics.com', industry: 'Transport & Cargo', companySize: '1.000 - 5.000 Karyawan', website: 'https://globallogistics.com', headquarters: 'Bekasi, Jawa Barat', description: 'Global Logistics Co. adalah penyedia layanan transportasi dan kargo terkemuka di Asia Tenggara, melayani pengiriman domestik dan internasional.', status: 'ditolak', submissionDate: '18 Okt 2023 • 16:45 WIB', rejectionReason: 'Dokumen SIUP tidak terbaca jelas dan masa berlaku hampir habis. Mohon unggah kembali dokumen yang valid dan terbaca dengan jelas untuk melanjutkan proses verifikasi.', documents: [{ type: 'Nomor NIB', name: '7720000000999', status: 'rejected' }, { type: 'Company Profile', name: 'GlobalLogistics_Profile.pdf' }] },
  '4': { id: '4', companyName: 'MedCare Pharma', adminName: 'Dr. Sarah Widi', adminEmail: 'support@medcare.co.id', industry: 'Healthcare & Medical', companySize: '500 - 1.000 Karyawan', website: 'https://medcare.co.id', headquarters: 'Tangerang Selatan, Banten', description: 'MedCare Pharma bergerak di bidang riset dan distribusi alat kesehatan serta obat-obatan farmasi berkualitas tinggi.', status: 'pending', submissionDate: '15 Okt 2023 • 11:20 WIB', documents: [{ type: 'Nomor NIB', name: '5520000000444', status: 'pending' }, { type: 'Izin Usaha', name: 'MedCare_Izin_BPOM.pdf' }, { type: 'Company Profile', name: 'MedCare_Profile.pdf' }] },
  'default': { id: 'default', companyName: 'Perusahaan Belum Lengkap', adminName: 'Admin Default', adminEmail: 'admin@default.com', industry: 'Umum', companySize: '1 - 50 Karyawan', website: '-', headquarters: '-', description: 'Data detail perusahaan belum tersedia sepenuhnya di database mockup.', status: 'pending', documents: [] }
};

export const dummyUniversityList: UniversityData[] = [
  { id: '1', name: 'Institut Teknologi Bandung', location: 'Bandung, Jawa Barat', adminName: 'Prof. Dr. Ir. Sudirman', adminEmail: 'sudirman@itb.ac.id', status: 'AKTIF', lastActive: '24 Mei 2024, 14:32' },
  { id: '2', name: 'Universitas Indonesia', location: 'Depok, Jawa Barat', adminName: 'Dra. Maya Puspita, M.Hum.', adminEmail: 'm.puspita@ui.ac.id', status: 'AKTIF', lastActive: '24 Mei 2024, 09:15' },
  { id: '3', name: 'Universitas Airlangga', location: 'Surabaya, Jawa Timur', adminName: 'Bambang Wijaya', adminEmail: 'b.wijaya@unair.ac.id', status: 'PENDING', lastActive: '23 Mei 2024, 16:45' },
  { id: '4', name: 'Telkom University', location: 'Dayeuhkolot, Bandung', adminName: 'Andi Pratama', adminEmail: 'pratama.admin@telkomuniversity.ac.id', status: 'AKTIF', lastActive: '22 Mei 2024, 11:20' },
  { id: '5', name: 'Universitas Gadjah Mada', location: 'Sleman, DI Yogyakarta', adminName: 'Dr. Hendra Gunawan', adminEmail: 'h.gunawan@ugm.ac.id', status: 'AKTIF', lastActive: '21 Mei 2024, 10:10' },
  { id: '6', name: 'Universitas Diponegoro', location: 'Semarang, Jawa Tengah', adminName: 'Siti Rahayu, S.Kom.', adminEmail: 's.rahayu@undip.ac.id', status: 'AKTIF', lastActive: '20 Mei 2024, 13:45' },
  { id: '7', name: 'Institut Pertanian Bogor', location: 'Bogor, Jawa Barat', adminName: 'Ir. Agus Santoso', adminEmail: 'agus.s@ipb.ac.id', status: 'PENDING', lastActive: '19 Mei 2024, 08:30' },
  { id: '8', name: 'Universitas Brawijaya', location: 'Malang, Jawa Timur', adminName: 'Dr. Rina Kusuma', adminEmail: 'rina.k@ub.ac.id', status: 'AKTIF', lastActive: '18 Mei 2024, 15:20' },
  { id: '9', name: 'Universitas Hasanuddin', location: 'Makassar, Sulawesi Selatan', adminName: 'Fajar Siddiq', adminEmail: 'fajar.s@unhas.ac.id', status: 'AKTIF', lastActive: '17 Mei 2024, 09:00' },
  { id: '10', name: 'Universitas Padjadjaran', location: 'Sumedang, Jawa Barat', adminName: 'Dian Sastro, M.T.', adminEmail: 'dian.s@unpad.ac.id', status: 'AKTIF', lastActive: '16 Mei 2024, 14:15' },
  { id: '11', name: 'Institut Teknologi Sepuluh Nopember', location: 'Surabaya, Jawa Timur', adminName: 'Prof. Budiarjo', adminEmail: 'budiarjo@its.ac.id', status: 'PENDING', lastActive: '15 Mei 2024, 11:45' },
  { id: '12', name: 'Universitas Sebelas Maret', location: 'Surakarta, Jawa Tengah', adminName: 'Anita Wijayanti', adminEmail: 'anita.w@uns.ac.id', status: 'AKTIF', lastActive: '14 Mei 2024, 10:30' },
];

export const dummyStudentLogs: StudentLog[] = [
  { id: '1', time: '14:20:05', name: 'Aditama Pratama', initials: 'AD', activity: 'Apply Job', role: 'Software Engineer', company: 'Tokopedia Technology', duration: '12m 45s' },
  { id: '2', time: '14:18:22', name: 'Siti Khadijah', initials: 'SK', activity: 'View Job', role: 'UX Designer Intern', company: 'Gojek Indonesia', duration: '03m 12s' },
  { id: '3', time: '14:15:10', name: 'Rizky Wahyudi', initials: 'RW', activity: 'Save Job', role: 'Data Analyst', company: 'Bank Mandiri', duration: '00m 45s' },
  { id: '4', time: '14:12:45', name: 'Maya Bahari', initials: 'MB', activity: 'Apply Job', role: 'HR Administrator', company: 'Telkom Indonesia', duration: '18m 20s' },
  { id: '5', time: '14:10:02', name: 'Fahri Septian', initials: 'FS', activity: 'View Job', role: 'Mobile Dev (Flutter)', company: 'Bukalapak', duration: '02m 55s' },
];

export const dummyUnivLogs: UnivAdminLog[] = [
  { id: '1', time: '14:20:05', date: '12 Okt 2023', name: 'Budi Santoso', univ: 'Universitas Indonesia', activity: 'VERIFIKASI BERKAS', detail: 'Mahasiswa: Aditama Pratama', subDetail: 'ID Berkas: UI-7793-X' },
  { id: '2', time: '13:45:12', date: '12 Okt 2023', name: 'Siti Aminah', univ: 'ITB Bandung', activity: 'UPDATE PROFIL', detail: 'Instansi: Fakultas Teknik', subDetail: 'Modifikasi: Kuota Magang' },
];

export const dummyCompanyLogs: CompanyAdminLog[] = [
  { id: '1', time: '14:22', date: '24 Okt 2023', name: 'Andi Wijaya', company: 'PT Tech Solusi Indonesia', activity: 'Post Lowongan', detail: 'Senior Frontend Developer' },
  { id: '2', time: '13:45', date: '24 Okt 2023', name: 'Siti Aminah', company: 'Global Creative Agency', activity: 'View Kandidat', detail: 'Budi Santoso (Intern UI/UX)' },
];

export const dummyMasterCourses: MasterCourse[] = [
  {
    id: '1',
    courseName: 'Algoritma & Struktur Data',
    courseCode: 'CS-101',
    category: 'Dasar Pemrograman',
    univName: 'Universitas Indonesia',
    univInitials: 'UI',
    cloCount: 4,
    clos: [
      { name: 'CLO 1 - Analisis Algoritma', skills: ['Problem Solving'] },
      { name: 'CLO 2 - Implementasi Tree', skills: ['Java', 'C++'] }
    ],
    lastUpdatedDate: '12 Okt 2023',
    lastUpdatedBy: 'Admin_Sara'
  },
  {
    id: '2',
    courseName: 'Basis Data',
    courseCode: 'CS-202',
    category: 'Manajemen Data',
    univName: 'Institut Teknologi Bandung',
    univInitials: 'ITB',
    cloCount: 3,
    clos: [
      { name: 'CLO 1 - Desain ERD', skills: ['Database Design'] },
      { name: 'CLO 2 - Optimasi Query', skills: ['SQL', 'PostgreSQL'] }
    ],
    lastUpdatedDate: '15 Okt 2023',
    lastUpdatedBy: 'Admin_Rizky'
  },
  {
    id: '3',
    courseName: 'Pemrograman Berbasis Objek',
    courseCode: 'CS-103',
    category: 'Software Engineering',
    univName: 'BINUS University',
    univInitials: 'BN',
    cloCount: 5,
    clos: [
      { name: 'CLO 1 - Konsep Encapsulation', skills: ['OOP Fundamentals'] },
      { name: 'CLO 2 - Design Patterns', skills: ['System Design', 'UML'] }
    ],
    lastUpdatedDate: '18 Okt 2023',
    lastUpdatedBy: 'Admin_Sara'
  },
  {
    id: '4',
    courseName: 'Kecerdasan Buatan',
    courseCode: 'CS-401',
    category: 'Machine Learning',
    univName: 'Universitas Gadjah Mada',
    univInitials: 'UGM',
    cloCount: 4,
    clos: [
      { name: 'CLO 1 - Supervised Learning', skills: ['Python', 'Scikit-Learn'] },
      { name: 'CLO 2 - Neural Networks', skills: ['Deep Learning', 'PyTorch'] }
    ],
    lastUpdatedDate: '20 Okt 2023',
    lastUpdatedBy: 'Admin_Budi'
  },
  {
    id: '5',
    courseName: 'Pengembangan Aplikasi Web',
    courseCode: 'CS-305',
    category: 'Software Engineering',
    univName: 'Telkom University',
    univInitials: 'TU',
    cloCount: 6,
    clos: [
      { name: 'CLO 1 - Frontend Fundamental', skills: ['HTML', 'CSS', 'JavaScript'] },
      { name: 'CLO 2 - Framework React', skills: ['ReactJS', 'Tailwind'] }
    ],
    lastUpdatedDate: '21 Okt 2023',
    lastUpdatedBy: 'Admin_Tono'
  },
  {
    id: '6',
    courseName: 'Jaringan Komputer',
    courseCode: 'CS-210',
    category: 'Infrastruktur',
    univName: 'Universitas Diponegoro',
    univInitials: 'UD',
    cloCount: 3,
    clos: [
      { name: 'CLO 1 - Topologi Jaringan', skills: ['Networking', 'Cisco'] },
      { name: 'CLO 2 - Protokol TCP/IP', skills: ['TCP/IP', 'Wireshark'] }
    ],
    lastUpdatedDate: '22 Okt 2023',
    lastUpdatedBy: 'Admin_Siti'
  },
  {
    id: '7',
    courseName: 'Rekayasa Perangkat Lunak',
    courseCode: 'CS-301',
    category: 'Software Engineering',
    univName: 'Universitas Airlangga',
    univInitials: 'UA',
    cloCount: 5,
    clos: [
      { name: 'CLO 1 - SDLC', skills: ['Agile', 'Scrum'] },
      { name: 'CLO 2 - Software Testing', skills: ['QA', 'Jest'] }
    ],
    lastUpdatedDate: '23 Okt 2023',
    lastUpdatedBy: 'Admin_Dian'
  },
  {
    id: '8',
    courseName: 'Sistem Operasi',
    courseCode: 'CS-205',
    category: 'Infrastruktur',
    univName: 'Institut Teknologi Sepuluh Nopember',
    univInitials: 'ITS',
    cloCount: 4,
    clos: [
      { name: 'CLO 1 - Manajemen Memori', skills: ['OS Concept', 'C'] },
      { name: 'CLO 2 - Shell Scripting', skills: ['Linux', 'Bash'] }
    ],
    lastUpdatedDate: '24 Okt 2023',
    lastUpdatedBy: 'Admin_Andi'
  },
  {
    id: '9',
    courseName: 'Keamanan Siber',
    courseCode: 'CS-405',
    category: 'Keamanan',
    univName: 'Universitas Sebelas Maret',
    univInitials: 'UNS',
    cloCount: 4,
    clos: [
      { name: 'CLO 1 - Kriptografi Dasar', skills: ['Cryptography', 'Security'] },
      { name: 'CLO 2 - Penetration Testing', skills: ['PenTest', 'Kali Linux'] }
    ],
    lastUpdatedDate: '25 Okt 2023',
    lastUpdatedBy: 'Admin_Rizky'
  },
  {
    id: '10',
    courseName: 'Pengolahan Citra Digital',
    courseCode: 'CS-410',
    category: 'Data Science',
    univName: 'Universitas Hasanuddin',
    univInitials: 'UNH',
    cloCount: 3,
    clos: [
      { name: 'CLO 1 - Filtering Citra', skills: ['Matlab', 'Python'] },
      { name: 'CLO 2 - Deteksi Tepi', skills: ['OpenCV', 'Computer Vision'] }
    ],
    lastUpdatedDate: '26 Okt 2023',
    lastUpdatedBy: 'Admin_Sara'
  },
  {
    id: '11',
    courseName: 'Pengembangan Game',
    courseCode: 'CS-415',
    category: 'Software Engineering',
    univName: 'Universitas Brawijaya',
    univInitials: 'UB',
    cloCount: 5,
    clos: [
      { name: 'CLO 1 - Game Engine Fundamental', skills: ['Unity', 'C#'] },
      { name: 'CLO 2 - 3D Modeling', skills: ['Blender', '3D Design'] }
    ],
    lastUpdatedDate: '27 Okt 2023',
    lastUpdatedBy: 'Admin_Budi'
  },
  {
    id: '12',
    courseName: 'Cloud Computing',
    courseCode: 'CS-420',
    category: 'Infrastruktur',
    univName: 'Universitas Padjadjaran',
    univInitials: 'UNP',
    cloCount: 4,
    clos: [
      { name: 'CLO 1 - Virtualisasi', skills: ['Docker', 'Kubernetes'] },
      { name: 'CLO 2 - Layanan AWS', skills: ['AWS', 'Cloud Architecture'] }
    ],
    lastUpdatedDate: '28 Okt 2023',
    lastUpdatedBy: 'Admin_Tono'
  }
];

export const dummyMasterIndustries: MasterIndustry[] = [
  {
    id: '1',
    companyName: 'Tokopedia',
    companyInitials: 'T',
    industry: 'E-commerce',
    position: 'Senior Data Scientist',
    responsibility: 'Designing machine learning models to improve...',
    skills: ['PYTHON', 'PYTORCH', 'SQL'],
    lastUpdatedDate: '24 Okt 2023'
  },
  {
    id: '2',
    companyName: 'Gojek (GoTo)',
    companyInitials: 'G',
    industry: 'On-demand Service',
    position: 'Fullstack Engineer',
    responsibility: 'Developing and maintaining high-performance...',
    skills: ['GO', 'REACT', 'KAFKA'],
    lastUpdatedDate: '22 Okt 2023'
  },
  {
    id: '3',
    companyName: 'Bank Mandiri',
    companyInitials: 'B',
    industry: 'Banking & Finance',
    position: 'Security Engineer',
    responsibility: 'Ensuring infrastructure resilience and conducting...',
    skills: ['CISSP', 'PYTHON', 'AWS'],
    lastUpdatedDate: '20 Okt 2023'
  },
  {
    id: '4',
    companyName: 'Shopee',
    companyInitials: 'S',
    industry: 'E-commerce',
    position: 'UX Researcher',
    responsibility: 'Conducting user interviews and usability testing to...',
    skills: ['INTERVIEW', 'FIGMA'],
    lastUpdatedDate: '18 Okt 2023'
  },
  {
    id: '5',
    companyName: 'Bukalapak',
    companyInitials: 'B',
    industry: 'Marketplace',
    position: 'DevOps Engineer',
    responsibility: 'Managing CI/CD pipelines and Kubernetes clusters for...',
    skills: ['DOCKER', 'K8S', 'TERRAFORM'],
    lastUpdatedDate: '15 Okt 2023'
  },
  {
    id: '6',
    companyName: 'Traveloka',
    companyInitials: 'T',
    industry: 'Travel & Lifestyle',
    position: 'Android Developer',
    responsibility: 'Building and optimizing mobile application features...',
    skills: ['KOTLIN', 'ANDROID STUDIO', 'MVVM'],
    lastUpdatedDate: '14 Okt 2023'
  },
  {
    id: '7',
    companyName: 'OVO',
    companyInitials: 'O',
    industry: 'Fintech',
    position: 'Backend Engineer',
    responsibility: 'Designing scalable payment APIs and microservices...',
    skills: ['NODE.JS', 'TYPESCRIPT', 'POSTGRESQL'],
    lastUpdatedDate: '12 Okt 2023'
  },
  {
    id: '8',
    companyName: 'Ruangguru',
    companyInitials: 'R',
    industry: 'EdTech',
    position: 'Product Manager',
    responsibility: 'Leading cross-functional teams to deliver educational...',
    skills: ['AGILE', 'JIRA', 'PRODUCT STRATEGY'],
    lastUpdatedDate: '10 Okt 2023'
  },
  {
    id: '9',
    companyName: 'Blibli',
    companyInitials: 'B',
    industry: 'E-commerce',
    position: 'Quality Assurance',
    responsibility: 'Creating and executing automated test scripts for...',
    skills: ['SELENIUM', 'JAVA', 'CYPRESS'],
    lastUpdatedDate: '08 Okt 2023'
  },
  {
    id: '10',
    companyName: 'Dana',
    companyInitials: 'D',
    industry: 'Fintech',
    position: 'Data Analyst',
    responsibility: 'Analyzing transaction data to uncover business insights...',
    skills: ['SQL', 'TABLEAU', 'EXCEL'],
    lastUpdatedDate: '05 Okt 2023'
  },
  {
    id: '11',
    companyName: 'Telkomsel',
    companyInitials: 'T',
    industry: 'Telecommunication',
    position: 'Cloud Architect',
    responsibility: 'Designing and migrating legacy systems to cloud...',
    skills: ['AWS', 'GCP', 'ARCHITECTURE'],
    lastUpdatedDate: '02 Okt 2023'
  },
  {
    id: '12',
    companyName: 'Halodoc',
    companyInitials: 'H',
    industry: 'HealthTech',
    position: 'iOS Developer',
    responsibility: 'Developing telemedicine features and ensuring app stability...',
    skills: ['SWIFT', 'XCODE', 'RXSWIFT'],
    lastUpdatedDate: '01 Okt 2023'
  }
];

export const dummyStudentUsers: StudentUser[] = [
  { id: '1', name: 'Adi Saputra', initials: 'AS', email: 'adi.saputra@student.ui.ac.id', univ: 'Universitas Indonesia', major: 'Ilmu Komputer', status: 'Aktif' },
  { id: '2', name: 'Budi Pratama', initials: 'BP', email: 'budi.p@itb.ac.id', univ: 'Institut Teknologi Bandung', major: 'Teknik Elektro', status: 'Aktif' },
  { id: '3', name: 'Citra Maharani', initials: 'CM', email: 'citra.m@ugm.ac.id', univ: 'Universitas Gadjah Mada', major: 'Manajemen Bisnis', status: 'Ditangguhkan' },
  { id: '4', name: 'Deni Kusuma', initials: 'DK', email: 'deni.kusuma@binus.ac.id', univ: 'Universitas Binus', major: 'Desain Komunikasi Visual', status: 'Dihapus' },
  { id: '5', name: 'Eka Wijaya', initials: 'EW', email: 'eka.w@ipb.ac.id', univ: 'IPB University', major: 'Teknologi Pangan', status: 'Aktif' },
  { id: '6', name: 'Fani Handayani', initials: 'FH', email: 'fani.h@unair.ac.id', univ: 'Universitas Airlangga', major: 'Kedokteran Gigi', status: 'Aktif' },
  { id: '7', name: 'Gilang Ramadhan', initials: 'GR', email: 'gilang.r@its.ac.id', univ: 'Institut Teknologi Sepuluh Nopember', major: 'Sistem Informasi', status: 'Ditangguhkan' },
  { id: '8', name: 'Hani Susanti', initials: 'HS', email: 'hani.s@undip.ac.id', univ: 'Universitas Diponegoro', major: 'Ilmu Hukum', status: 'Aktif' },
  { id: '9', name: 'Irfan Hakim', initials: 'IH', email: 'irfan.h@unpad.ac.id', univ: 'Universitas Padjadjaran', major: 'Ilmu Komunikasi', status: 'Aktif' },
  { id: '10', name: 'Joko Widodo', initials: 'JW', email: 'joko.w@uns.ac.id', univ: 'Universitas Sebelas Maret', major: 'Teknik Sipil', status: 'Dihapus' },
  { id: '11', name: 'Kartika Sari', initials: 'KS', email: 'kartika.s@unhas.ac.id', univ: 'Universitas Hasanuddin', major: 'Kesehatan Masyarakat', status: 'Aktif' },
  { id: '12', name: 'Lukman Sardi', initials: 'LS', email: 'lukman.s@telkomuniversity.ac.id', univ: 'Telkom University', major: 'Teknik Informatika', status: 'Aktif' },
];

export const dummyUnivAdminUsers: UnivAdminUser[] = [
  { id: '1', name: 'Dr. Aris Sudarsono', initials: 'AS', email: 'aris.s@ui.ac.id', univ: 'Universitas Indonesia', nip: '197805122003121002', status: 'Dihapus' },
  { id: '2', name: 'Budi Santoso', initials: 'BS', email: 'budi.san@itb.ac.id', univ: 'Institut Teknologi Bandung', nip: 'ITB-ADM-042', status: 'Ditangguhkan' },
  { id: '3', name: 'Rina Putri', initials: 'RP', email: 'rina.p@ugm.ac.id', univ: 'Universitas Gadjah Mada', nip: 'UGM-2021-089', status: 'Aktif' },
  { id: '4', name: 'Dedi Wijaya', initials: 'DW', email: 'dedi.w@unpad.ac.id', univ: 'Universitas Padjadjaran', nip: 'UNPAD-ADM-112', status: 'Aktif' },
  { id: '5', name: 'Siti Maryam', initials: 'SM', email: 'siti.m@binus.ac.id', univ: 'Bina Nusantara University', nip: 'BINUS-9982', status: 'Aktif' },
  { id: '6', name: 'Prof. Bambang S.', initials: 'BS', email: 'bambang.s@ipb.ac.id', univ: 'IPB University', nip: '196508171990031001', status: 'Aktif' },
  { id: '7', name: 'Ahmad Fauzi', initials: 'AF', email: 'ahmad.f@unair.ac.id', univ: 'Universitas Airlangga', nip: 'UNAIR-ADM-021', status: 'Ditangguhkan' },
  { id: '8', name: 'Dra. Nita Kumala', initials: 'NK', email: 'nita.k@undip.ac.id', univ: 'Universitas Diponegoro', nip: '197204051998022003', status: 'Aktif' },
  { id: '9', name: 'Hendra Setiawan', initials: 'HS', email: 'hendra.s@its.ac.id', univ: 'Institut Teknologi Sepuluh Nopember', nip: 'ITS-ADM-105', status: 'Aktif' },
  { id: '10', name: 'Cici Paramida', initials: 'CP', email: 'cici.p@uns.ac.id', univ: 'Universitas Sebelas Maret', nip: 'UNS-2020-055', status: 'Dihapus' },
  { id: '11', name: 'Ir. Doni Tata', initials: 'DT', email: 'doni.t@unhas.ac.id', univ: 'Universitas Hasanuddin', nip: '198001012005011005', status: 'Aktif' },
  { id: '12', name: 'Erna Wati', initials: 'EW', email: 'erna.w@telkomuniversity.ac.id', univ: 'Telkom University', nip: 'TEL-ADM-008', status: 'Aktif' },
];

export const dummyCompanyAdminUsers: CompanyAdminUser[] = [
  { id: '1', name: 'Budi Santoso', initials: 'BS', email: 'budi.s@techindo.co.id', company: 'PT Teknologi Nusantara', nip: 'TN-2021-045', status: 'Aktif', hasPhoto: true },
  { id: '2', name: 'Siti Aminah', initials: 'SA', email: 's.aminah@kreatifmandiri.com', company: 'CV Kreatif Mandiri', nip: 'KM-HR-002', status: 'Aktif', hasPhoto: false },
  { id: '3', name: 'Gabriel Sabar', initials: 'GS', email: 's.aminah@abadi.com', company: 'CV Abadi Selama', nip: 'AS-HR-8702', status: 'Aktif', hasPhoto: false },
  { id: '4', name: 'Dian Pertiwi', initials: 'DP', email: 'dian.p@globallogistics.id', company: 'Global Logistics ID', nip: 'GL-9982-B', status: 'Dihapus', hasPhoto: true },
  { id: '5', name: 'Arif Rahman', initials: 'AR', email: 'arahman@agrobisnis.com', company: 'PT Agro Bisnis Sejahtera', nip: 'AGB-2015-88', status: 'Ditangguhkan', hasPhoto: true },
  { id: '6', name: 'Eka Putri', initials: 'EP', email: 'eka.putri@fintechjaya.co.id', company: 'PT Fintech Jaya', nip: 'FJ-HR-012', status: 'Aktif', hasPhoto: false },
  { id: '7', name: 'Heri Susanto', initials: 'HS', email: 'heri.s@konstruksimegah.com', company: 'PT Konstruksi Megah', nip: 'KM-2019-105', status: 'Aktif', hasPhoto: true },
  { id: '8', name: 'Ika Sari', initials: 'IS', email: 'ika.sari@edutechindo.id', company: 'EduTech Indonesia', nip: 'ET-HR-005', status: 'Ditangguhkan', hasPhoto: false },
  { id: '9', name: 'Joko Prabowo', initials: 'JP', email: 'joko.p@healthmed.co.id', company: 'HealthMed Solutions', nip: 'HM-2022-033', status: 'Aktif', hasPhoto: true },
  { id: '10', name: 'Kiki Amalia', initials: 'KA', email: 'kiki.a@retailmaju.com', company: 'CV Retail Maju', nip: 'RM-HR-021', status: 'Dihapus', hasPhoto: true },
  { id: '11', name: 'Lia Ananda', initials: 'LA', email: 'lia.a@logistikcepat.id', company: 'PT Logistik Cepat', nip: 'LC-2018-077', status: 'Aktif', hasPhoto: false },
  { id: '12', name: 'Maman Abdurahman', initials: 'MA', email: 'maman.a@panganmakmur.com', company: 'PT Pangan Makmur', nip: 'PM-HR-050', status: 'Aktif', hasPhoto: true },
];

// ==========================================
// MOCK API LOGIC
// ==========================================
export const updateCompanyData = (id: string, updatedDetail: CompanyDetail, newStatus?: 'pending' | 'terverifikasi' | 'ditolak', rejectReason?: string) => {
  if (dummyCompanyDetails[id]) {
    dummyCompanyDetails[id] = { ...updatedDetail };
    if (newStatus) dummyCompanyDetails[id].status = newStatus;
    if (rejectReason !== undefined) dummyCompanyDetails[id].rejectionReason = rejectReason;
  }
  const listIndex = dummyCompanyList.findIndex(c => c.id === id);
  if (listIndex !== -1) {
    dummyCompanyList[listIndex].name = updatedDetail.companyName;
    dummyCompanyList[listIndex].industry = updatedDetail.industry;
    if (newStatus) dummyCompanyList[listIndex].status = newStatus;
  }
};

export const addUniversityData = (newUniv: Omit<UniversityData, 'id' | 'lastActive'>) => {
  const newId = (dummyUniversityList.length + 1).toString();
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  dummyUniversityList.unshift({ id: newId, ...newUniv, lastActive: formattedDate });
};

export const updateUniversityData = (id: string, updatedData: Partial<UniversityData>) => {
  const index = dummyUniversityList.findIndex(u => u.id === id);
  if (index !== -1) {
    dummyUniversityList[index] = { ...dummyUniversityList[index], ...updatedData };
  }
};

export const deleteUniversityData = (id: string) => {
  const index = dummyUniversityList.findIndex(u => u.id === id);
  if (index !== -1) {
    dummyUniversityList.splice(index, 1);
  }
};

// ==========================================
// METRIC SELECTORS
// ==========================================

const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

export const getCompanyMetrics = (): CompanyMetrics => ({
  total: dummyCompanyList.length,
  pending: dummyCompanyList.filter(c => c.status === 'pending').length,
  verified: dummyCompanyList.filter(c => c.status === 'terverifikasi').length,
});

export const getVerificationQueue = (): VerificationQueue[] =>
  dummyCompanyList
    .filter(c => c.status === 'pending')
    .map(c => ({ id: c.id, name: c.name, industry: c.industry, initials: getInitials(c.name) }));

export const getUniversityMetrics = (): UniversityMetrics => ({
  total: dummyUniversityList.length,
  activeAdmin: dummyUniversityList.filter(u => u.status === 'AKTIF').length,
});

export const getUserManagementMetrics = (
  tab: 'mahasiswa' | 'universitas' | 'perusahaan'
): UserManagementMetrics => {
  const source: { status: string }[] =
    tab === 'mahasiswa' ? dummyStudentUsers :
    tab === 'universitas' ? dummyUnivAdminUsers :
    dummyCompanyAdminUsers;

  return {
    totalUser: source.length,
    userAktif: source.filter(u => u.status === 'Aktif').length,
    akunDitangguhkan: source.filter(u => u.status === 'Ditangguhkan').length,
  };
};

export const getMasterDataStats = (): MasterDataStats => ({
  // Belum ada modul "Program Studi" tersendiri di data terpusat ini,
  // jadi angka ini masih placeholder sampai dataset/API-nya tersedia.
  programStudi: 0,
  mataKuliah: dummyMasterCourses.length,
  clo: dummyMasterCourses.reduce((sum, c) => sum + c.cloCount, 0),
});

export const getOverviewMetrics = (): OverviewMetrics => ({
  totalUniversitas: dummyUniversityList.length,
  totalMahasiswa: dummyStudentUsers.length,
  perusahaanTerverifikasi: dummyCompanyList.filter(c => c.status === 'terverifikasi').length,
  // Belum ada modul Lowongan/Jobs di data terpusat admin ini (domain-nya
  // ada di sisi perusahaan/recruitment), jadi belum bisa dihitung live.
  // Ganti dengan hasil fetch ke endpoint lowongan saat API tersambung.
  totalLowongan: 0,
});