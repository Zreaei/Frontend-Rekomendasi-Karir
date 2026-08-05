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