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

// ==========================================
// DUMMY DATA
// ==========================================

export const dummyOverviewMetrics: OverviewMetrics = {
  totalUniversitas: 158,
  totalMahasiswa: 42891,
  perusahaanTerverifikasi: 2410,
  totalLowongan: 108622,
};

export const dummyActivityTrends: Record<'3' | '7' | '30', ActivityTrend[]> = {
  '3': [
    { date: '03 Ags', userLogin: 8200, jobViews: 5800 },
    { date: '04 Ags', userLogin: 7900, jobViews: 6100 },
    { date: '05 Ags', userLogin: 8500, jobViews: 6400 },
  ],
  '7': [
    { date: '30 Jul', userLogin: 6200, jobViews: 4100 },
    { date: '31 Jul', userLogin: 6800, jobViews: 4600 },
    { date: '01 Ags', userLogin: 7100, jobViews: 5100 },
    { date: '02 Ags', userLogin: 6500, jobViews: 4800 },
    { date: '03 Ags', userLogin: 8200, jobViews: 5800 },
    { date: '04 Ags', userLogin: 7900, jobViews: 6100 },
    { date: '05 Ags', userLogin: 8500, jobViews: 6400 },
  ],
  '30': [
    { date: '12 Jul', userLogin: 5000, jobViews: 3500 },
    { date: '17 Jul', userLogin: 5500, jobViews: 3800 },
    { date: '22 Jul', userLogin: 6100, jobViews: 4200 },
    { date: '27 Jul', userLogin: 5800, jobViews: 4000 },
    { date: '01 Ags', userLogin: 7100, jobViews: 5100 },
    { date: '05 Ags', userLogin: 8500, jobViews: 6400 },
  ],
};

export const dummyVerificationQueue: VerificationQueue[] = [
  { id: '1', name: 'Tech Armada', industry: 'IT Services', initials: 'TA' },
  { id: '2', name: 'Global Logistik', industry: 'Transportation', initials: 'GL' },
  { id: '3', name: 'Bank Utama', industry: 'Finance', initials: 'BU' },
  { id: '4', name: 'Innovate ID', industry: 'Creative', initials: 'ID' },
];

export const dummyMasterDataStats: MasterDataStats = {
  programStudi: 1420,
  mataKuliah: 8590,
  clo: 24311,
};

export const dummyActivityLogs: ActivityLog[] = [
  { id: '1', action: 'Admin Bli tolak verifikasi Univ. Siber Indonesia', time: '3 menit yang lalu', type: 'info' },
  { id: '2', action: 'Sinkronisasi data master Prodi dari API PDDIKTI', time: '15 menit yang lalu', type: 'warning' },
  { id: '3', action: 'Super Admin login melalui IP 192.168.1.182', time: '45 menit yang lalu', type: 'success' },
];

export const dummyCompanyMetrics: CompanyMetrics = {
  total: 84,
  pending: 12,
  verified: 72,
};

export const dummyCompanyList: CompanyVerificationData[] = [
  {
    id: '1',
    name: 'Skyline Tech Solutions',
    industry: 'Software Development',
    email: 'hr@skylinetech.id',
    phone: '+62 21 5550 1234',
    location: 'Jakarta Selatan, Indonesia',
    documents: ['NIB / SIUP', 'Company Profile'],
    date: '24 Okt 2023',
    status: 'pending',
  },
  {
    id: '2',
    name: 'EcoGreen Energy',
    industry: 'Renewable Resources',
    email: 'admin@ecogreen.org',
    phone: '+62 31 9992 4455',
    location: 'Surabaya, Jawa Timur',
    documents: ['NIB / SIUP', 'Company Profile'],
    date: '20 Okt 2023',
    status: 'terverifikasi',
  },
  {
    id: '3',
    name: 'Global Logistics Co.',
    industry: 'Transport & Cargo',
    email: 'contact@globallogistics.com',
    phone: '+62 21 4433 9900',
    location: 'Bekasi, Jawa Barat',
    documents: ['NIB / SIUP', 'Company Profile'],
    date: '18 Okt 2023',
    status: 'ditolak',
  },
  {
    id: '4',
    name: 'MedCare Pharma',
    industry: 'Healthcare & Medical',
    email: 'support@medcare.co.id',
    phone: '+62 21 3333 1122',
    location: 'Tangerang Selatan, Banten',
    documents: ['NIB / SIUP', 'Company Profile'],
    date: '15 Okt 2023',
    status: 'pending',
  },
];

// DATA DINAMIS DETAIL PERUSAHAAN
export const dummyCompanyDetails: Record<string, CompanyDetail> = {
  '1': {
    id: '1',
    companyName: 'Skyline Tech Solutions',
    adminName: 'Sigit Kurnia',
    adminEmail: 'hr@skylinetech.id',
    industry: 'Software Development',
    companySize: '100 - 500 Karyawan',
    website: 'https://skylinetech.id',
    headquarters: 'Jakarta Selatan, Indonesia',
    description: 'Skyline Tech Solutions adalah perusahaan yang berfokus pada pengembangan perangkat lunak berbasis cloud dan solusi transformasi digital untuk berbagai sektor industri.',
    status: 'pending',
    submissionDate: '24 Okt 2023 • 14:32 WIB',
    documents: [
      { type: 'Nomor NIB', name: '9120000000458', status: 'pending' },
      { type: 'Izin Usaha', name: 'Skyline_Izin_Usaha.pdf' },
      { type: 'Company Profile', name: 'Profile_Skyline.pdf' },
    ]
  },
  '2': {
    id: '2',
    companyName: 'EcoGreen Energy',
    adminName: 'Aulia Fitria',
    adminEmail: 'admin@ecogreen.org',
    industry: 'Renewable Resources',
    companySize: '50 - 100 Karyawan',
    website: 'https://ecogreen.org',
    headquarters: 'Surabaya, Jawa Timur',
    description: 'EcoGreen berfokus pada energi terbarukan dan pengelolaan sumber daya ramah lingkungan untuk masa depan yang lebih baik.',
    status: 'terverifikasi',
    submissionDate: '20 Okt 2023 • 09:15 WIB',
    documents: [
      { type: 'Nomor NIB', name: '8820000000123', status: 'verified' },
      { type: 'Company Profile', name: 'EcoGreen_Profile.pdf' },
    ]
  },
  '3': {
    id: '3',
    companyName: 'Global Logistics Co.',
    adminName: 'Budi Santoso',
    adminEmail: 'contact@globallogistics.com',
    industry: 'Transport & Cargo',
    companySize: '1.000 - 5.000 Karyawan',
    website: 'https://globallogistics.com',
    headquarters: 'Bekasi, Jawa Barat',
    description: 'Global Logistics Co. adalah penyedia layanan transportasi dan kargo terkemuka di Asia Tenggara, melayani pengiriman domestik dan internasional.',
    status: 'ditolak',
    submissionDate: '18 Okt 2023 • 16:45 WIB',
    rejectionReason: 'Dokumen SIUP tidak terbaca jelas dan masa berlaku hampir habis. Mohon unggah kembali dokumen yang valid dan terbaca dengan jelas untuk melanjutkan proses verifikasi.',
    documents: [
      { type: 'Nomor NIB', name: '7720000000999', status: 'rejected' },
      { type: 'Company Profile', name: 'GlobalLogistics_Profile.pdf' },
    ]
  },
  '4': {
    id: '4',
    companyName: 'MedCare Pharma',
    adminName: 'Dr. Sarah Widi',
    adminEmail: 'support@medcare.co.id',
    industry: 'Healthcare & Medical',
    companySize: '500 - 1.000 Karyawan',
    website: 'https://medcare.co.id',
    headquarters: 'Tangerang Selatan, Banten',
    description: 'MedCare Pharma bergerak di bidang riset dan distribusi alat kesehatan serta obat-obatan farmasi berkualitas tinggi.',
    status: 'pending',
    submissionDate: '15 Okt 2023 • 11:20 WIB',
    documents: [
      { type: 'Nomor NIB', name: '5520000000444', status: 'pending' },
      { type: 'Izin Usaha', name: 'MedCare_Izin_BPOM.pdf' },
      { type: 'Company Profile', name: 'MedCare_Profile.pdf' },
    ]
  },
  'default': {
    id: 'default',
    companyName: 'Perusahaan Belum Lengkap',
    adminName: 'Admin Default',
    adminEmail: 'admin@default.com',
    industry: 'Umum',
    companySize: '1 - 50 Karyawan',
    website: '-',
    headquarters: '-',
    description: 'Data detail perusahaan belum tersedia sepenuhnya di database mockup.',
    status: 'pending',
    documents: []
  }
};

// ==========================================
// MOCK API LOGIC (State memori sementara)
// ==========================================
export const updateCompanyData = (id: string, updatedDetail: CompanyDetail, newStatus?: 'pending' | 'terverifikasi' | 'ditolak', rejectReason?: string) => {
  // Update Detail in-memory
  if (dummyCompanyDetails[id]) {
    dummyCompanyDetails[id] = { ...updatedDetail };
    
    if (newStatus) {
      dummyCompanyDetails[id].status = newStatus;
    }
    if (rejectReason !== undefined) {
      dummyCompanyDetails[id].rejectionReason = rejectReason;
    }
  }

  // Update List in-memory agar nyambung ke halaman utama
  const listIndex = dummyCompanyList.findIndex(c => c.id === id);
  if (listIndex !== -1) {
    dummyCompanyList[listIndex].name = updatedDetail.companyName;
    dummyCompanyList[listIndex].industry = updatedDetail.industry;
    if (newStatus) {
      dummyCompanyList[listIndex].status = newStatus;
    }
  }
};