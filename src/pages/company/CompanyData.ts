// ==========================================
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
}

export const initialApplicants: Applicant[] = [
  { id: 1, name: 'Aditya Rizky', university: 'Universitas Indonesia', role: 'Junior Full-Stack Engineer', type: 'Full-time', match: 92, date: '12 Okt 2023', status: 'Pending', initial: 'AR', bgColor: 'bg-slate-800' },
  { id: 2, name: 'Siti Hajar', university: 'Institut Teknologi Bandung', role: 'Data Analyst', type: 'Internship', match: 85, date: '10 Okt 2023', status: 'Diterima', initial: 'SH', bgColor: 'bg-emerald-600' },
  { id: 3, name: 'Budi Kusuma', university: 'Universitas Gadjah Mada', role: 'Senior UI/UX Designer', type: 'Full-time', match: 64, date: '09 Okt 2023', status: 'Ditolak', initial: 'BK', bgColor: 'bg-slate-700' },
  { id: 4, name: 'Farhan Putra', university: 'Universitas Brawijaya', role: 'Junior Full-Stack Engineer', type: 'Full-time', match: 88, date: '08 Okt 2023', status: 'Pending', initial: 'FP', bgColor: 'bg-blue-600' },
  { id: 5, name: 'Maya Lestari', university: 'Binus University', role: 'Content Strategist', type: 'Full-time', match: 79, date: '05 Okt 2023', status: 'Pending', initial: 'ML', bgColor: 'bg-slate-900' },
  { id: 6, name: 'Rian Hidayat', university: 'Telkom University', role: 'Security Engineer', type: 'Full-time', match: 90, date: '04 Okt 2023', status: 'Diterima', initial: 'RH', bgColor: 'bg-indigo-600' },
  { id: 7, name: 'Dian Permata', university: 'Universitas Padjadjaran', role: 'Data Analyst', type: 'Full-time', match: 82, date: '03 Okt 2023', status: 'Pending', initial: 'DP', bgColor: 'bg-purple-600' },
  { id: 8, name: 'Hendra Wijaya', university: 'Universitas Diponegoro', role: 'Senior UI/UX Designer', type: 'Full-time', match: 75, date: '02 Okt 2023', status: 'Pending', initial: 'HW', bgColor: 'bg-amber-600' },
  { id: 9, name: 'Nadia Utami', university: 'Universitas Airlangga', role: 'Content Strategist', type: 'Internship', match: 81, date: '01 Okt 2023', status: 'Diterima', initial: 'NU', bgColor: 'bg-teal-600' },
  { id: 10, name: 'Taufik Hidayat', university: 'Universitas Hasanuddin', role: 'Junior Full-Stack Engineer', type: 'Full-time', match: 87, date: '30 Sep 2023', status: 'Pending', initial: 'TH', bgColor: 'bg-cyan-600' },
  { id: 11, name: 'Clarissa Annisa', university: 'Universitas Sebelas Maret', role: 'Data Analyst', type: 'Full-time', match: 89, date: '29 Sep 2023', status: 'Diterima', initial: 'CA', bgColor: 'bg-rose-600' },
  { id: 12, name: 'Rizky Fauzi', university: 'Universitas Sumatera Utara', role: 'Senior UI/UX Designer', type: 'Internship', match: 70, date: '28 Sep 2023', status: 'Ditolak', initial: 'RF', bgColor: 'bg-zinc-600' }
];

// ==========================================
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
  applicantsCount: number | null;
  avgMatch: number | null;
}

export const initialLowongan: Lowongan[] = [
  { id: 1, role: 'Junior Full-Stack Engineer', department: 'Tech & Product', type: 'Full-time', location: 'Jakarta', date: 'DIBUAT 12 OKT 2023', status: 'Aktif', applicantsCount: 42, avgMatch: 88 },
  { id: 2, role: 'Senior UI/UX Designer', department: 'Creative', type: 'Contract', location: 'Remote', date: 'DIBUAT 10 OKT 2023', status: 'Draft', applicantsCount: null, avgMatch: null },
  { id: 3, role: 'Accounting Intern', department: 'Finance', type: 'Internship', location: 'Jakarta', date: 'DIBUAT 15 SEP 2023', status: 'Selesai', applicantsCount: 89, avgMatch: 91 },
  { id: 4, role: 'Data Analyst', department: 'Business Intelligence', type: 'Full-time', location: 'Jakarta', date: 'DIBUAT 01 OKT 2023', status: 'Aktif', applicantsCount: 58, avgMatch: 94 },
  { id: 5, role: 'Security Engineer', department: 'Engineering', type: 'Full-time', location: 'Jakarta', date: 'DIBUAT 15 SEP 2023', status: 'Aktif', applicantsCount: 27, avgMatch: 90 },
  { id: 6, role: 'Customer Success Lead', department: 'Ops', type: 'Full-time', location: 'Bali', date: 'DIBUAT 15 SEP 2023', status: 'Selesai', applicantsCount: 112, avgMatch: 88 },
  { id: 7, role: 'Content Strategist', department: 'Marketing', type: 'Contract', location: 'Jakarta', date: 'DIBUAT 05 SEP 2023', status: 'Draft', applicantsCount: null, avgMatch: null }
];

// ==========================================
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

// ==========================================
// 4. SERVICE TANPA LOCALSTORAGE
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
  }
};