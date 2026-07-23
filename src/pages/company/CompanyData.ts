// 1. MANAJEMEN DATA PELAMAR 
// ==========================================
export interface Applicant {
  id: number;
  name: string;
  university: string;
  role: string;
  type: string;
  match: number;
  date: string;
  status: string;
  initial: string;
  bgColor: string;
  source?: string; 
  major?: string;    
  skills?: string[];
}

export const getApplicantSource = (applicant: Applicant): string => {
  return applicant.source || 'Lamar'
}

export const initialApplicants: Applicant[] = [
  { id: 1, name: 'Aditya Rizky', university: 'Universitas Indonesia', role: 'Junior Full-Stack Engineer', type: 'Full-time', match: 92, date: '12 Okt 2023', status: 'Pending', initial: 'AR', bgColor: 'bg-slate-800', skills: ['React.js', 'TypeScript', 'GraphQL'] },
  { id: 2, name: 'Siti Hajar', university: 'Institut Teknologi Bandung', role: 'Data Analyst', type: 'Internship', match: 85, date: '10 Okt 2023', status: 'Diterima', initial: 'SH', bgColor: 'bg-emerald-600', skills: ['Python', 'SQL', 'Tableau'] },
  { id: 3, name: 'Budi Kusuma', university: 'Universitas Gadjah Mada', role: 'Senior UI/UX Designer', type: 'Full-time', match: 64, date: '09 Okt 2023', status: 'Ditolak', initial: 'BK', bgColor: 'bg-slate-700', skills: ['UI/UX Design', 'Figma', 'Prototyping'] },
  { id: 4, name: 'Farhan Putra', university: 'Universitas Brawijaya', role: 'Junior Full-Stack Engineer', type: 'Full-time', match: 88, date: '08 Okt 2023', status: 'Pending', initial: 'FP', bgColor: 'bg-blue-600', skills: ['React.js', 'TypeScript', 'GraphQL'] },
  { id: 5, name: 'Maya Lestari', university: 'Binus University', role: 'Content Strategist', type: 'Full-time', match: 79, date: '05 Okt 2023', status: 'Pending', initial: 'ML', bgColor: 'bg-slate-900', skills: ['SEO', 'Copywriting', 'Google Analytics'] },
  { id: 6, name: 'Rian Hidayat', university: 'Telkom University', role: 'Security Engineer', type: 'Full-time', match: 90, date: '04 Okt 2023', status: 'Diterima', initial: 'RH', bgColor: 'bg-indigo-600', skills: ['Network Security', 'Pen-Testing', 'Linux'] },
  { id: 7, name: 'Dian Permata', university: 'Universitas Padjadjaran', role: 'Data Analyst', type: 'Full-time', match: 82, date: '03 Okt 2023', status: 'Pending', initial: 'DP', bgColor: 'bg-purple-600', skills: ['Python', 'SQL', 'Tableau'] },
  { id: 8, name: 'Hendra Wijaya', university: 'Universitas Diponegoro', role: 'Senior UI/UX Designer', type: 'Full-time', match: 75, date: '02 Okt 2023', status: 'Pending', initial: 'HW', bgColor: 'bg-amber-600', skills: ['UI/UX Design', 'Figma', 'Prototyping'] },
  { id: 9, name: 'Nadia Utami', university: 'Universitas Airlangga', role: 'Content Strategist', type: 'Internship', match: 81, date: '01 Okt 2023', status: 'Diterima', initial: 'NU', bgColor: 'bg-teal-600', skills: ['SEO', 'Copywriting', 'Google Analytics'] },
  { id: 10, name: 'Taufik Hidayat', university: 'Universitas Hasanuddin', role: 'Junior Full-Stack Engineer', type: 'Full-time', match: 87, date: '30 Sep 2023', status: 'Pending', initial: 'TH', bgColor: 'bg-cyan-600', skills: ['React.js', 'TypeScript', 'GraphQL'] },
  { id: 11, name: 'Clarissa Annisa', university: 'Universitas Sebelas Maret', role: 'Data Analyst', type: 'Full-time', match: 89, date: '29 Sep 2023', status: 'Diterima', initial: 'CA', bgColor: 'bg-rose-600', skills: ['Python', 'SQL', 'Tableau'] },
  { id: 12, name: 'Rizky Fauzi', university: 'Universitas Sumatera Utara', role: 'Senior UI/UX Designer', type: 'Internship', match: 70, date: '28 Sep 2023', status: 'Ditolak', initial: 'RF', bgColor: 'bg-zinc-600', skills: ['UI/UX Design', 'Figma', 'Prototyping'] }
];

// 2. MANAJEMEN DATA LOWONGAN (JOBS)
// ==========================================
export interface Lowongan {
  id: number;
  role: string;
  department: string;
  type: string;
  location: string;
  date: string;
  status: 'Aktif' | 'Draft' | 'Selesai';
  tanggalPosting?: string; 
  tanggalBatas?: string;
}

export const initialLowongan: Lowongan[] = [
  { id: 1, role: 'Junior Full-Stack Engineer', department: 'Tech & Product', type: 'Full-time', location: 'Jakarta', date: 'DIBUAT 12 OKT 2023', status: 'Aktif' },
  { id: 2, role: 'Senior UI/UX Designer', department: 'Creative', type: 'Contract', location: 'Remote', date: 'DIBUAT 10 OKT 2023', status: 'Draft' },
  { id: 3, role: 'Accounting Intern', department: 'Finance', type: 'Internship', location: 'Jakarta', date: 'DIBUAT 15 SEP 2023', status: 'Selesai' },
  { id: 4, role: 'Data Analyst', department: 'Business Intelligence', type: 'Full-time', location: 'Jakarta', date: 'DIBUAT 01 OKT 2023', status: 'Aktif' },
  { id: 5, role: 'Security Engineer', department: 'Engineering', type: 'Full-time', location: 'Jakarta', date: 'DIBUAT 15 SEP 2023', status: 'Aktif' },
  { id: 6, role: 'Customer Success Lead', department: 'Ops', type: 'Full-time', location: 'Bali', date: 'DIBUAT 15 SEP 2023', status: 'Selesai' },
  { id: 7, role: 'Content Strategist', department: 'Marketing', type: 'Contract', location: 'Jakarta', date: 'DIBUAT 05 SEP 2023', status: 'Draft' }
];

export const getApplicantCountForRole = (role: string): number => {
  return initialApplicants.filter(a => a.role === role).length
}

export const getAvgMatchForRole = (role: string): number | null => {
  const list = initialApplicants.filter(a => a.role === role)
  if (list.length === 0) return null
  return Math.round(list.reduce((acc, a) => acc + a.match, 0) / list.length)
}

// 3. MANAJEMEN DATA PROFIL PERUSAHAAN
// ==========================================
export interface CompanyProfileData {
  namaPerusahaan: string;
  bidangIndustri: string;
  lokasi: string;
  website: string;
  description: string;
  email: string;
  phone: string;
  jumlahKaryawan: string;
  nib: string;
  namaAdmin: string;
  jabatanAdmin: string;
  logo: string | null;
}

export const initialCompanyProfile: CompanyProfileData = {
  namaPerusahaan: 'PT. TechBridge Solutions Internasional',
  bidangIndustri: 'Teknologi Informasi',
  lokasi: 'Sudirman Central Business District (SCBD), Treasury Tower Lt. 42, Jl. Jend. Sudirman No. Kav. 52-53, Jakarta Selatan 12190',
  website: 'https://www.techbridge.solutions.id',
  description: `TechBridge Solutions adalah perusahaan teknologi terdepan yang berdedikasi untuk menjembatani kesenjangan antara proses industri konvensional dan masa depan digital. Didirikan pada tahun 2015, kami telah berkembang dari sebuah software house kecil menjadi kekuatan regional untuk transformasi digital, melayani klien di seluruh Asia Tenggara.
  Misi kami adalah memberdayakan perusahaan dengan alat pengambilan keputusan berbasis data dan infrastruktur cloud yang kuat. Kami menghargai inovasi, transparansi, dan fokus penuh pada pengalaman pengguna. Dengan tim yang terdiri dari lebih dari 600 pakar, kami ikut membentuk masa depan ekonomi digital Indonesia.`,
  email: 'alex.thompson@techbridge.co',
  phone: '+62 811-4957-890',
  jumlahKaryawan: '501-1000 Anggota',
  nib: '01230495817260001',
  namaAdmin: 'Alex Thompson',
  jabatanAdmin: 'Akun Rekruter Utama',
  logo: null
};

// 4. MANAJEMEN DATA REKOMENDASI KANDIDAT
// ==========================================
export interface Recommendation {
  id: number;
  name: string;
  major: string;
  university: string;
  skills: string[];
  matchScore: number;
  roleMatch: string;
  status: 'Pending' | 'Diterima' | 'Ditolak';
}

export const initialRecommendations: Recommendation[] = [
  { id: 1, name: 'Budi Santoso', major: 'Computer Science', university: 'Universitas Indonesia', skills: ['REACT.JS', 'TYPESCRIPT', 'GRAPHQL'], matchScore: 96, roleMatch: 'SENIOR FRONTEND ENGINEER', status: 'Pending' },
  { id: 2, name: 'Anisa Rahmawati', major: 'Information Systems', university: 'ITB', skills: ['UI/UX DESIGN', 'REACT NATIVE', 'FIGMA'], matchScore: 92, roleMatch: 'PRODUCT DESIGNER', status: 'Pending' },
  { id: 3, name: 'Dimas Pratama', major: 'Software Engineering', university: 'Binus University', skills: ['REDUX', 'NEXT.JS', 'TAILWIND CSS'], matchScore: 88, roleMatch: 'BACKEND ARCHITECT', status: 'Pending' },
  { id: 4, name: 'Siti Aminah', major: 'Informatics', university: 'Telkom University', skills: ['VUE.JS', 'TESTING'], matchScore: 85, roleMatch: 'MOBILE DEVELOPER', status: 'Pending' },
  { id: 5, name: 'Andi Wijaya', major: 'Data Science', university: 'UGM', skills: ['PYTHON', 'SQL', 'TABLEAU'], matchScore: 94, roleMatch: 'DATA ANALYST', status: 'Diterima' },
  { id: 6, name: 'Reza Saputra', major: 'Cyber Security', university: 'Universitas Airlangga', skills: ['AWS', 'PEN-TESTING', 'LINUX'], matchScore: 65, roleMatch: 'SECURITY ENGINEER', status: 'Ditolak' },
  { id: 7, name: 'Diana Fitri', major: 'Computer Science', university: 'Universitas Diponegoro', skills: ['NODE.JS', 'GO', 'DOCKER'], matchScore: 91, roleMatch: 'BACKEND ARCHITECT', status: 'Pending' },
  { id: 8, name: 'Kevin Pratama', major: 'Information Technology', university: 'Universitas Padjadjaran', skills: ['FIGMA', 'ADOBE XD', 'USER RESEARCH'], matchScore: 89, roleMatch: 'PRODUCT DESIGNER', status: 'Diterima' },
  { id: 9, name: 'Rina Ayu', major: 'Information Systems', university: 'Universitas Hasanuddin', skills: ['REACT.JS', 'TAILWIND CSS', 'VERCEL'], matchScore: 72, roleMatch: 'SENIOR FRONTEND ENGINEER', status: 'Ditolak' },
  { id: 10, name: 'Fajar Nugroho', major: 'Computer Science', university: 'Universitas Sebelas Maret', skills: ['JAVA', 'SPRING BOOT', 'MYSQL'], matchScore: 90, roleMatch: 'BACKEND ARCHITECT', status: 'Pending' },
  { id: 11, name: 'Putri Handayani', major: 'Data Science', university: 'Institut Teknologi Sepuluh Nopember', skills: ['PYTHON', 'MACHINE LEARNING', 'PANDAS'], matchScore: 93, roleMatch: 'DATA ANALYST', status: 'Pending' },
  { id: 12, name: 'Yusuf Maulana', major: 'Information Systems', university: 'Universitas Brawijaya', skills: ['UI/UX DESIGN', 'FIGMA', 'DESIGN SYSTEM'], matchScore: 86, roleMatch: 'PRODUCT DESIGNER', status: 'Pending' },
  { id: 13, name: 'Larasati Wulandari', major: 'Software Engineering', university: 'Universitas Sriwijaya', skills: ['FLUTTER', 'DART', 'FIREBASE'], matchScore: 84, roleMatch: 'MOBILE DEVELOPER', status: 'Diterima' },
  { id: 14, name: 'Bayu Firmansyah', major: 'Cyber Security', university: 'Universitas Bina Nusantara', skills: ['LINUX', 'PEN-TESTING', 'SIEM'], matchScore: 68, roleMatch: 'SECURITY ENGINEER', status: 'Ditolak' },
  { id: 15, name: 'Cindy Amelia', major: 'Computer Science', university: 'Universitas Andalas', skills: ['REACT.JS', 'NEXT.JS', 'GRAPHQL'], matchScore: 87, roleMatch: 'SENIOR FRONTEND ENGINEER', status: 'Pending' }
];

// 5. SERVICE TANPA LOCALSTORAGE
// ==========================================
export const CompanyService = {
  // Ambil data langsung dari variabel dummy di file ini
  // Nanti saat ada BE, tinggal ubah return ini menjadi `const res = await axios.get(...); return res.data;`
  getProfile: async (): Promise<CompanyProfileData> => {
    return initialCompanyProfile;
  },

  // Simpan data langsung mengubah objek di memori file ini
  // Nanti saat ada BE, tinggal ubah ini menjadi `await axios.put('/api/company', updatedData);`
  saveProfile: async (updatedData: CompanyProfileData): Promise<void> => {
    Object.assign(initialCompanyProfile, updatedData);
  },

  getRecommendations: async (): Promise<Recommendation[]> => {
    return initialRecommendations;
  },

  getRecommendationById: async (id: number): Promise<Recommendation | undefined> => {
    return initialRecommendations.find(r => r.id === id);
  },

  getApplicants: async (): Promise<Applicant[]> => {
    return initialApplicants;
  },

  getJobs: async (): Promise<Lowongan[]> => {
    return initialLowongan;
  },

  getDashboardSummary: async (): Promise<{ lowonganAktif: number; totalPelamar: number; rekomendasiKandidat: number }> => {
    return {
      lowonganAktif: getActiveJobsCount(),
      totalPelamar: getTotalPelamarCount(),
      rekomendasiKandidat: getPendingRecommendationsCount()
    };
  },

  getCandidateDetailById: async (id: number): Promise<{ kandidat: Recommendation; detail: CandidateAcademicDetail } | null> => {
    const kandidat = initialRecommendations.find(r => r.id === id);
    if (!kandidat) return null;
    return { kandidat, detail: getCandidateAcademicDetail(kandidat) };
  }
};

// 6. AGREGAT UNTUK DASHBOARD (DIHITUNG LANGSUNG DARI DATA DI ATAS)
// ==========================================
export const getActiveJobsCount = (): number => {
  return initialLowongan.filter(j => j.status === 'Aktif').length
}

export const getTotalPelamarCount = (): number => {
  return initialApplicants.filter(a => getApplicantSource(a) === 'Lamar').length
}

export const getPendingRecommendationsCount = (): number => {
  return initialRecommendations.filter(r => r.status === 'Pending').length
}

// 7. DETAIL AKADEMIK KANDIDAT (UNTUK HALAMAN DETAIL KANDIDAT)
// ==========================================
export interface CloItem {
  id: number;
  skor: number;
  matkul: string;
  nilai: number;
  kode: string;
  deskripsi: string;
}

export interface CandidateAcademicDetail {
  bio: string;
  jenjang: string;
  periode: string;
  ipk: string;
  sertifikat: { nama: string; link: string }[];
  cloAnalysis: CloItem[];
}

export const candidateAcademicDetails: Record<number, CandidateAcademicDetail> = {
  1: {
    bio: 'Budi Santoso adalah lulusan Computer Science dengan minat kuat pada pengembangan aplikasi berskala besar. Memiliki pengalaman proyek dalam pengembangan sistem berbasis web menggunakan React.js dan TypeScript, serta terbiasa bekerja dalam tim lintas fungsi menggunakan metodologi Agile.',
    jenjang: 'S1 Ilmu Komputer',
    periode: '2020 - Sekarang',
    ipk: '3.85 / 4.00',
    sertifikat: [
      { nama: 'AWS Certified Cloud Practitioner', link: 'https://aws.amazon.com/certification/' },
      { nama: 'Google Data Analytics Professional', link: 'https://grow.google/certificates/data-analytics/' },
      { nama: 'Meta Front-End Developer Professional', link: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' }
    ],
    cloAnalysis: [
      { id: 1, skor: 98, matkul: 'Komunikasi Profesional', nilai: 100, kode: 'CLO 5', deskripsi: 'Menunjukkan etika profesional dan kemampuan komunikasi interpersonal yang efektif dalam lingkungan kerja kolaboratif.' },
      { id: 2, skor: 95, matkul: 'Basis Data Terdistribusi', nilai: 95, kode: 'CLO 2', deskripsi: 'Mampu merancang, mengimplementasikan, dan mengoptimalkan sistem basis data terdistribusi yang andal dan aman.' },
      { id: 3, skor: 96, matkul: 'Struktur Data', nilai: 95, kode: 'CLO 1', deskripsi: 'Mampu mengimplementasikan berbagai struktur data seperti array, stack, queue, tree, dan graf dalam pemecahan persoalan yang efisien serta menyelesaikan masalah komputasi kompleks.' },
      { id: 4, skor: 96, matkul: 'Rekayasa Perangkat Lunak', nilai: 94, kode: 'CLO 4', deskripsi: 'Mampu merencanakan, mengelola, dan mengeksekusi proyek pengembangan perangkat lunak menggunakan metodologi Agile secara kolaboratif.' },
      { id: 5, skor: 94, matkul: 'Desain & Analisis Algoritma', nilai: 93, kode: 'CLO 3', deskripsi: 'Mampu menganalisis kompleksitas waktu dan ruang suatu algoritma serta menerapkan strategi optimasi yang tepat.' }
    ]
  }
}

const buildFallbackAcademicDetail = (kandidat: Recommendation): CandidateAcademicDetail => {
  const skillList = kandidat.skills.length > 0 ? kandidat.skills : ['Kerja Tim', 'Komunikasi']
  return {
    bio: `${kandidat.name} adalah lulusan ${kandidat.major} dari ${kandidat.university} dengan kompetensi utama pada ${skillList.slice(0, 3).join(', ')}. Berdasarkan riwayat akademik, kandidat ini memiliki kecocokan ${kandidat.matchScore}% terhadap posisi ${kandidat.roleMatch}.`,
    jenjang: `S1 ${kandidat.major}`,
    periode: '2020 - Sekarang',
    ipk: '3.50 / 4.00',
    sertifikat: [
      { nama: `Sertifikasi Kompetensi ${skillList[0]}`, link: '#' }
    ],
    cloAnalysis: skillList.slice(0, 5).map((skill, idx) => ({
      id: idx + 1,
      skor: Math.max(60, kandidat.matchScore - idx * 2),
      matkul: skill,
      nilai: Math.max(60, kandidat.matchScore - idx),
      kode: `CLO ${idx + 1}`,
      deskripsi: `Mampu menerapkan kompetensi ${skill} secara profesional sesuai standar kompetensi lulusan.`
    }))
  }
}

export const getCandidateAcademicDetail = (kandidat: Recommendation): CandidateAcademicDetail => {
  return candidateAcademicDetails[kandidat.id] || buildFallbackAcademicDetail(kandidat)
}

export const getRecommendationById = (id: number): Recommendation | undefined => {
  return initialRecommendations.find(r => r.id === id)
}

export const rejectRecommendation = (id: number): void => {
  const kandidat = initialRecommendations.find(r => r.id === id)
  if (kandidat) kandidat.status = 'Ditolak'
}

export const acceptRecommendationAsApplicant = (kandidat: Recommendation): void => {
  const initials = kandidat.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const newApplicant: Applicant = {
    id: initialApplicants.length > 0 ? Math.max(...initialApplicants.map(a => a.id)) + 1 : 1,
    name: kandidat.name,
    university: kandidat.university,
    role: kandidat.roleMatch,
    type: 'Full-time',
    match: kandidat.matchScore,
    date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ' '),
    status: 'Pending',
    initial: initials,
    bgColor: 'bg-[#0f5ce0]',
    source: 'Undangan',
    major: kandidat.major,
    skills: kandidat.skills
  }

  initialApplicants.unshift(newApplicant)

  const index = initialRecommendations.findIndex(r => r.id === kandidat.id)
  if (index > -1) {
    initialRecommendations.splice(index, 1)
  }
}