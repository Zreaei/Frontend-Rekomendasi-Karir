import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Briefcase,
  Calendar,
  BookOpen,
  Target,
  ChevronDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  adminAnalyticsApi,
  adminCompanyApi,
  getInitialsOf,
} from '../../services/admin.service';
import type {
  SystemOverview,
  ActivityTrendPoint,
  AdminCompany,
  MasterDataStats,
  RecentSystemLog,
} from '../../services/admin.service';

interface ChartTooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
}
interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: ChartTooltipPayloadItem[];
}
const ActivityTooltip = ({ active, label, payload }: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-[8px] bg-white px-3.5 py-3 shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1)] border border-[#eef1f6] min-w-[150px]">
      <p className="text-[12px] font-bold text-[#111827] mb-2">{label}</p>
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
              <span className="text-[11px] text-[#5b6170]">{item.name}</span>
            </div>
            <span className="text-[12px] font-semibold text-[#111827]">
              {item.value?.toLocaleString('id-ID')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// "2026-08-12" -> "12 Ags"
const formatShortDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

// waktu relatif sederhana untuk log ("3 menit yang lalu")
const formatRelativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diffMs)) return '-';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} menit yang lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari yang lalu`;
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [timeFilter, setTimeFilter] = useState<'3' | '7' | '30'>('30');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [trends, setTrends] = useState<ActivityTrendPoint[]>([]);
  const [queue, setQueue] = useState<AdminCompany[]>([]);
  const [masterStats, setMasterStats] = useState<MasterDataStats | null>(null);
  const [logs, setLogs] = useState<RecentSystemLog[]>([]);
  const [loadError, setLoadError] = useState('');

  const [visibleSeries, setVisibleSeries] = useState({
    jobViews: true,
    applications: true,
  });

  const [chartReady, setChartReady] = useState(false);

  const queueColors = [
    { bg: 'bg-blue-50/60', border: 'border-blue-100', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    { bg: 'bg-emerald-50/60', border: 'border-emerald-100', text: 'text-emerald-700', iconBg: 'bg-emerald-100' },
    { bg: 'bg-amber-50/60', border: 'border-amber-100', text: 'text-amber-700', iconBg: 'bg-amber-100' },
    { bg: 'bg-purple-50/60', border: 'border-purple-100', text: 'text-purple-700', iconBg: 'bg-purple-100' },
  ];

  // Muat data utama dashboard sekali di awal.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ov, pending, stats, recent] = await Promise.all([
          adminAnalyticsApi.overview(),
          adminCompanyApi.list({ status: 'pending', limit: 8 }),
          adminAnalyticsApi.masterStats(),
          adminAnalyticsApi.recentLogs(5),
        ]);
        if (cancelled) return;
        setOverview(ov);
        setQueue(pending.companies);
        setMasterStats(stats);
        setLogs(recent);
      } catch {
        if (!cancelled) setLoadError('Gagal memuat data dashboard. Pastikan server backend berjalan.');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Tren aktivitas mengikuti filter rentang hari.
  useEffect(() => {
    let cancelled = false;
    adminAnalyticsApi
      .activityTrends(parseInt(timeFilter, 10))
      .then((data) => { if (!cancelled) setTrends(data); })
      .catch(() => { /* kartu lain tetap tampil walau tren gagal */ });
    return () => { cancelled = true; };
  }, [timeFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setChartReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const formatNumber = (num: number) => num.toLocaleString('id-ID');

  const getLogDotColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-[#0f5ce0]';
      case 'warning': return 'bg-[#f59e0b]';
      case 'success': return 'bg-[#10b981]';
      default: return 'bg-[#a0a6b5]';
    }
  };

  const toggleSeries = (dataKey: 'jobViews' | 'applications') => {
    setVisibleSeries(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const currentTrendsData = trends.map((t) => ({ ...t, date: formatShortDate(t.date) }));

  if (loadError) {
    return (
      <div className="w-full max-w-[1280px] mx-auto py-16 text-center">
        <p className="text-[15px] font-bold text-[#ef4444]">{loadError}</p>
      </div>
    );
  }

  if (!overview || !masterStats) return <div className="p-8 text-[#5b6170]">Memuat data dashboard...</div>;

  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="w-full max-w-[1280px] mx-auto pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[25px] font-bold text-[#052960]">Selamat Datang, Super Admin</h1>
          <p className="text-[15px] text-[#5b6170] mt-1">
            Berikut adalah ringkasan sistem Talentry hari ini, {today}.
          </p>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-[#d7dde9] rounded-[8px] bg-white text-[13px] font-medium text-[#111827] hover:bg-[#f7faff] transition shadow-sm"
          >
            <Calendar size={16} className="text-[#5b6170]" />
            {timeFilter === '30' ? 'Last 30 Days' : timeFilter === '7' ? 'Last 7 Days' : 'Last 3 Days'}
            <ChevronDown size={14} className={`text-[#5b6170] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-[#e4e9f4] rounded-[8px] shadow-lg z-10 overflow-hidden">
              <button
                onClick={() => { setTimeFilter('3'); setIsDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#f7faff] transition ${timeFilter === '3' ? 'font-semibold text-[#0f5ce0]' : 'text-[#5b6170]'}`}
              >
                Last 3 Days
              </button>
              <button
                onClick={() => { setTimeFilter('7'); setIsDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#f7faff] transition ${timeFilter === '7' ? 'font-semibold text-[#0f5ce0]' : 'text-[#5b6170]'}`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => { setTimeFilter('30'); setIsDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#f7faff] transition ${timeFilter === '30' ? 'font-semibold text-[#0f5ce0]' : 'text-[#5b6170]'}`}
              >
                Last 30 Days
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white p-5 rounded-[16px] border border-[#e4e9f4] shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-[#f0f5ff] flex items-center justify-center text-[#0f5ce0] mb-4">
            <GraduationCap size={20} strokeWidth={2} />
          </div>
          <p className="text-[10px] font-bold text-[#7b8191] uppercase tracking-wider mb-1">Total Universitas</p>
          <p className="text-[24px] font-bold text-[#111827]">{formatNumber(overview.universities)}</p>
        </div>

        <div className="bg-white p-5 rounded-[16px] border border-[#e4e9f4] shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-[#f0f5ff] flex items-center justify-center text-[#0f5ce0] mb-4">
            <Users size={20} strokeWidth={2} />
          </div>
          <p className="text-[10px] font-bold text-[#7b8191] uppercase tracking-wider mb-1">Total Mahasiswa</p>
          <p className="text-[24px] font-bold text-[#111827]">{formatNumber(overview.students)}</p>
        </div>

        <div className="bg-white p-5 rounded-[16px] border border-[#e4e9f4] shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-[#f0f5ff] flex items-center justify-center text-[#0f5ce0] mb-4">
            <ShieldCheck size={20} strokeWidth={2} />
          </div>
          <p className="text-[10px] font-bold text-[#7b8191] uppercase tracking-wider mb-1">Perusahaan Terverifikasi</p>
          <p className="text-[24px] font-bold text-[#111827]">{formatNumber(overview.companies.verified)}</p>
        </div>

        <div className="bg-white p-5 rounded-[16px] border border-[#e4e9f4] shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-[#f0f5ff] flex items-center justify-center text-[#0f5ce0] mb-4">
            <Briefcase size={20} strokeWidth={2} />
          </div>
          <p className="text-[10px] font-bold text-[#7b8191] uppercase tracking-wider mb-1">Total Lowongan</p>
          <p className="text-[24px] font-bold text-[#111827]">{formatNumber(overview.jobs.total)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mb-6">

        {/* Tren Aktivitas Chart */}
        <div className="bg-white p-6 rounded-[16px] border border-[#e4e9f4] shadow-sm min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-[16px] font-bold text-[#111827]">Tren Aktivitas Pengguna</h2>
              <p className="text-[12px] text-[#7b8191] mt-0.5">Statistik peninjauan lowongan dan lamaran masuk</p>
            </div>

            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button
                onClick={() => toggleSeries('jobViews')}
                title={visibleSeries.jobViews ? 'Sembunyikan Job Views' : 'Tampilkan Job Views'}
                className={`flex items-center gap-2 text-[12px] px-2.5 py-1.5 rounded-full border transition-all cursor-pointer hover:bg-[#f7faff] hover:border-[#d7dde9] ${visibleSeries.jobViews ? 'opacity-100 border-transparent' : 'opacity-40 border-transparent'}`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#052960]"></span>
                <span className="font-medium text-[#111827]">Job Views</span>
              </button>
              <button
                onClick={() => toggleSeries('applications')}
                title={visibleSeries.applications ? 'Sembunyikan Lamaran Masuk' : 'Tampilkan Lamaran Masuk'}
                className={`flex items-center gap-2 text-[12px] px-2.5 py-1.5 rounded-full border transition-all cursor-pointer hover:bg-[#f7faff] hover:border-[#d7dde9] ${visibleSeries.applications ? 'opacity-100 border-transparent' : 'opacity-40 border-transparent'}`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#cce0ff]"></span>
                <span className="font-medium text-[#111827]">Lamaran Masuk</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-[#a3a9b7] -mt-5 mb-2">
            Klik salah satu label di atas untuk menampilkan/menyembunyikan data
          </p>

          <div className="w-full min-w-0" style={{ height: 260 }}>
            {chartReady && (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart key={timeFilter} data={currentTrendsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f4f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#7b8191' }} dy={10} />
                  <YAxis
                    width={40}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#7b8191' }}
                    tickFormatter={(value: number) => (value >= 1000 ? `${value / 1000}k` : String(value))}
                  />
                  <Tooltip cursor={{ fill: '#f7faff' }} content={<ActivityTooltip />} />

                  {visibleSeries.jobViews && (
                    <Bar
                      dataKey="jobViews"
                      name="Job Views"
                      fill="#052960"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                      isAnimationActive={true}
                      animationDuration={500}
                      animationEasing="ease-out"
                    />
                  )}
                  {visibleSeries.applications && (
                    <Bar
                      dataKey="applications"
                      name="Lamaran Masuk"
                      fill="#cce0ff"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                      isAnimationActive={true}
                      animationDuration={500}
                      animationEasing="ease-out"
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Antrean Verifikasi */}
        <div className="bg-[#fcfdff] p-6 rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col">
          <h2 className="text-[16px] font-bold text-[#111827]">Antrean Verifikasi</h2>
          <p className="text-[12px] text-[#7b8191] mt-0.5 pb-4 border-b border-[#e4e9f4]">
            Perusahaan menunggu persetujuan ({queue.length} total)
          </p>

          <div className="flex-1 overflow-y-auto space-y-3 mt-4 mb-4">
            {queue.length === 0 && (
              <p className="text-[12px] text-[#7b8191] text-center py-6">Tidak ada antrean verifikasi.</p>
            )}
            {queue.map((item, index) => {
              const theme = queueColors[index % queueColors.length];
              return (
                <div key={item.id} className={`flex items-center gap-3 p-3 rounded-[10px] border ${theme.bg} ${theme.border} transition-colors`}>
                  <div className={`w-9 h-9 rounded-[8px] ${theme.iconBg} ${theme.text} flex items-center justify-center font-bold text-[13px]`}>
                    {getInitialsOf(item.name)}
                  </div>
                  <div>
                    <h4 className={`text-[13px] font-bold ${theme.text}`}>{item.name}</h4>
                    <p className="text-[11px] text-[#5b6170] mt-0.5">{item.industry ?? '-'}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/admin/kelola-perusahaan', { state: { presetFilter: 'pending' } })}
            className="w-full mt-auto py-2.5 text-[12px] font-bold text-[#0f5ce0] hover:bg-[#eef4ff] rounded-[8px] transition"
          >
            LIHAT SEMUA ANTREAN
          </button>
        </div>
      </div>

      {/* Statistik Master Data */}
      <div className="mb-6">
        <h2 className="text-[15px] font-bold text-[#111827] mb-4">Statistik Master Data</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#f7faff] p-5 rounded-[16px] border border-[#e4e9f4] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0f5ce0] shadow-sm border border-[#e4e9f4]">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7b8191] uppercase tracking-wider">Program Studi</p>
              <p className="text-[20px] font-bold text-[#111827]">{formatNumber(masterStats.programStudi)}</p>
            </div>
          </div>
          <div className="bg-[#f7faff] p-5 rounded-[16px] border border-[#e4e9f4] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0f5ce0] shadow-sm border border-[#e4e9f4]">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7b8191] uppercase tracking-wider">Mata Kuliah</p>
              <p className="text-[20px] font-bold text-[#111827]">{formatNumber(masterStats.mataKuliah)}</p>
            </div>
          </div>
          <div className="bg-[#f7faff] p-5 rounded-[16px] border border-[#e4e9f4] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0f5ce0] shadow-sm border border-[#e4e9f4]">
              <Target size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7b8191] uppercase tracking-wider">CLO / Learning Out.</p>
              <p className="text-[20px] font-bold text-[#111827]">{formatNumber(masterStats.clo)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Log Aktivitas Terbaru */}
      <div className="bg-white p-6 rounded-[16px] border border-[#e4e9f4] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-bold text-[#111827]">Log Aktivitas Terbaru</h2>
          <button
            onClick={() => navigate('/admin/log-aktivitas')}
            className="text-[12px] font-bold text-[#0f5ce0] hover:underline"
          >
            LIHAT DETAIL
          </button>
        </div>

        <div className="space-y-5">
          {logs.length === 0 && (
            <p className="text-[12px] text-[#7b8191]">Belum ada aktivitas tercatat.</p>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-4">
              <div className="mt-1.5 flex flex-col items-center">
                <span className={`w-2.5 h-2.5 rounded-full ${getLogDotColor(log.type)}`}></span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#111827]">{log.action}</p>
                <p className="text-[11px] text-[#7b8191] mt-0.5">{formatRelativeTime(log.time)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
