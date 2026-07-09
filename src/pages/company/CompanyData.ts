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
  { id: 1, name: 'Aditya Rizky', university: 'Universitas Indonesia', role: 'Software Engineer', type: 'Full-time', match: 92, date: '12 Okt 2023', status: 'Pending', initial: 'AR', bgColor: 'bg-slate-800' },
  { id: 2, name: 'Siti Hajar', university: 'Institut Teknologi Bandung', role: 'Data Analyst', type: 'Internship', match: 85, date: '10 Okt 2023', status: 'Diterima', initial: 'SH', bgColor: 'bg-emerald-600' },
  { id: 3, name: 'Budi Kusuma', university: 'Universitas Gadjah Mada', role: 'Product Designer', type: 'Full-time', match: 64, date: '09 Okt 2023', status: 'Ditolak', initial: 'BK', bgColor: 'bg-slate-700' },
  { id: 4, name: 'Farhan Putra', university: 'Universitas Brawijaya', role: 'Software Engineer', type: 'Full-time', match: 88, date: '08 Okt 2023', status: 'Pending', initial: 'FP', bgColor: 'bg-blue-600' },
  { id: 5, name: 'Maya Lestari', university: 'Binus University', role: 'Marketing Associate', type: 'Full-time', match: 79, date: '05 Okt 2023', status: 'Pending', initial: 'ML', bgColor: 'bg-slate-900' },
  { id: 6, name: 'Rian Hidayat', university: 'Telkom University', role: 'Software Engineer', type: 'Full-time', match: 90, date: '04 Okt 2023', status: 'Diterima', initial: 'RH', bgColor: 'bg-indigo-600' },
  { id: 7, name: 'Dian Permata', university: 'Universitas Padjadjaran', role: 'Data Analyst', type: 'Full-time', match: 82, date: '03 Okt 2023', status: 'Pending', initial: 'DP', bgColor: 'bg-purple-600' },
  { id: 8, name: 'Hendra Wijaya', university: 'Universitas Diponegoro', role: 'Product Designer', type: 'Full-time', match: 75, date: '02 Okt 2023', status: 'Pending', initial: 'HW', bgColor: 'bg-amber-600' },
  { id: 9, name: 'Nadia Utami', university: 'Universitas Airlangga', role: 'Marketing Associate', type: 'Internship', match: 81, date: '01 Okt 2023', status: 'Diterima', initial: 'NU', bgColor: 'bg-teal-600' },
  { id: 10, name: 'Taufik Hidayat', university: 'Universitas Hasanuddin', role: 'Software Engineer', type: 'Full-time', match: 87, date: '30 Sep 2023', status: 'Pending', initial: 'TH', bgColor: 'bg-cyan-600' },
  { id: 11, name: 'Clarissa Annisa', university: 'Universitas Sebelas Maret', role: 'Data Analyst', type: 'Full-time', match: 89, date: '29 Sep 2023', status: 'Diterima', initial: 'CA', bgColor: 'bg-rose-600' },
  { id: 12, name: 'Rizky Fauzi', university: 'Universitas Sumatera Utara', role: 'Product Designer', type: 'Internship', match: 70, date: '28 Sep 2023', status: 'Ditolak', initial: 'RF', bgColor: 'bg-zinc-600' }
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