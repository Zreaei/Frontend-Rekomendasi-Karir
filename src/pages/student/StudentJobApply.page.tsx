import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import StatCard from '../../components/common/StatCard'
import FilterPill from '../../components/common/FilterPill'
import StatusPill from '../../components/common/StatusPill'
import {
  Briefcase,
  FileText,
  GraduationCap,
  Star,
} from 'lucide-react'

const StudentJobApply = () => {
  const stats = [
    { title: 'Total Lamaran', value: '3', icon: <Star size={18} strokeWidth={2} /> },
    { title: 'Dalam Review', value: '1', icon: <GraduationCap size={18} strokeWidth={2} /> },
    { title: 'Interview', value: '1', icon: <Briefcase size={18} strokeWidth={2} /> },
    { title: 'Diterima', value: '1', icon: <FileText size={18} strokeWidth={2} /> },
  ]

  const filters = ['Semua', 'Baru', 'Dalam Review', 'Interview', 'Diterima', 'Ditolak']

  const applications = [
    {
      role: 'Fullstack Developer',
      date: '1 Maret 2026',
      match: '83%',
      status: 'Dalam Review',
      tone: 'warning' as const,
    },
    {
      role: 'DevOps',
      date: '19 Februari 2026',
      match: '79%',
      status: 'Ditolak',
      tone: 'danger' as const,
    },
    {
      role: 'Backend Developer',
      date: '1 Januari 2026',
      match: '90%',
      status: 'Diterima',
      tone: 'success' as const,
    },
  ]

  return (
    <StudentLayout>
      <SectionHeader
        title="Job Apply"
        description="Pantau status lowongan pekerjaan yang Anda lamar"
      />

      <div className="grid grid-cols-4 gap-3.5 max-[960px]:grid-cols-2">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {filters.map((filter, index) => (
          <FilterPill key={filter} label={filter} active={index === 0} />
        ))}
      </div>

      <section>
        <div className="grid min-w-0 gap-3.5 bg-white p-6 rounded-xl shadow-md">
          <div className="grid grid-cols-5 items-center gap-3 text-[14px] font-bold text-[#050505] max-sm:grid-cols-1">
            <span>Posisi</span>
            <span>Tanggal</span>
            <span>Match</span>
            <span>Status</span>
            <span>Aksi</span>
          </div>
          {applications.map((item) => (
            <div className="grid grid-cols-5 items-center gap-3 text-[13px] max-sm:grid-cols-1" key={item.role}>
              <span>{item.role}</span>
              <span>{item.date}</span>
              <span className={`font-semibold ${Number.parseInt(item.match) < 80 ? 'text-[#c46d00]' : 'text-[#007f65]'}`}>
                {item.match}
              </span>
              <StatusPill label={item.status} tone={item.tone} />
              <button className="w-fit rounded-[5px] bg-[#0d6efd] px-3 py-1.5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-px" type="button">
                Detail
              </button>
            </div>
          ))}
        </div>
      </section>
    </StudentLayout>
  )
}

export default StudentJobApply
