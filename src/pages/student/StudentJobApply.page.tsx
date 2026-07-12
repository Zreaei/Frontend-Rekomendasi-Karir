import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import Card from '../../components/common/Card'
import FilterPill from '../../components/common/FilterPill'
import StatusPill from '../../components/common/StatusPill'
import Button from '../../components/common/Button'
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Send,
  XCircle,
} from 'lucide-react'

const StudentJobApply = () => {
  const stats = [
    {
      title: 'Total Terkirim',
      value: '24',
      icon: <Send size={18} strokeWidth={2} />,
      accent: 'bg-[#ecfff8] text-[#0f766e]',
    },
    {
      title: 'Diterima',
      value: '2',
      icon: <CheckCircle2 size={18} strokeWidth={2} />,
      accent: 'bg-[#eef5ff] text-[#0d6efd]',
    },
    {
      title: 'Menunggu Tanggapan',
      value: '14',
      icon: <Clock3 size={18} strokeWidth={2} />,
      accent: 'bg-[#fff4e8] text-[#b45a00]',
    },
    {
      title: 'Ditolak',
      value: '8',
      icon: <XCircle size={18} strokeWidth={2} />,
      accent: 'bg-[#fff0f0] text-[#d92d20]',
    },
  ]

  const applications = [
    {
      role: 'Senior Product Designer',
      company: 'TechFlow Systems',
      location: 'San Francisco (Remote)',
      date: 'Oct 12, 2023',
      status: 'Pending',
      tone: 'warning' as const,
    },
    {
      role: 'Junior UI/UX Designer',
      company: 'Creative Labs',
      location: 'New York City (On-site)',
      date: 'Oct 15, 2023',
      status: 'Diterima',
      tone: 'success' as const,
    },
    {
      role: 'Lead Graphic Designer',
      company: 'Visionary Arts',
      location: 'Los Angeles (Hybrid)',
      date: 'Oct 20, 2023',
      status: 'Ditolak',
      tone: 'danger' as const,
    },
    {
      role: 'Product Design Intern',
      company: 'NextGen Innovations',
      location: 'Austin (Remote)',
      date: 'Oct 22, 2023',
      status: 'Ditolak',
      tone: 'danger' as const,
    },
  ]

  return (
    <StudentLayout>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold leading-tight text-[#050505]">Lamaran Pekerjaan</h1>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-[#232342]">
            Lihat ringkasan pengajuan, status terbaru, dan detail riwayat lamaran Anda.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-5 shadow-sm">
            <div className={`grid h-10 w-10 place-items-center rounded-[8px] ${stat.accent}`} aria-hidden="true">
              {stat.icon}
            </div>
            <p className="mt-5 text-[13px] font-medium text-[#232342]">{stat.title}</p>
            <p className="mt-1 text-[28px] font-bold leading-none text-[#050505]">{stat.value}</p>
          </Card>
        ))}
      </div>

      <section>
        <Card className="p-6 shadow-sm">
          <SectionHeader
            title="Riwayat Pengajuan"
            
          />

          <div className="mt-5 overflow-hidden rounded-lg border border-[#d9dce2]">
            <div className="grid grid-cols-[1.3fr_0.7fr_0.8fr_0.6fr] gap-4 border-b border-[#d9dce2] bg-[#f7f9fc] px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#5c6577]">
              <span>Perusahaan & Posisi</span>
              <span>Tanggal Melamar</span>
              <span>Status</span>
              <span>Aksi</span>
            </div>

            <div className="grid gap-0">
              {applications.map((item) => (
                <div
                  key={item.role}
                  className="grid grid-cols-[1.3fr_0.7fr_0.8fr_0.6fr] items-center gap-4 border-b border-[#d9dce2] px-4 py-5 text-[13px] last:border-b-0 max-lg:grid-cols-1"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-md bg-[#eef5ff] text-[#0d6efd]" aria-hidden="true">
                      <FileText size={17} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#050505]">{item.role}</p>
                      <p className="mt-1 text-[#4f5a6d]">
                        {item.company} • {item.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-[#4f5a6d]">{item.date}</p>
                  <StatusPill label={item.status} tone={item.tone} />

                  <Button variant="ghost" className="w-fit" type="button">
                    Detail
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-5 text-[13px] font-semibold">
            Menampilkan 1 sampai 4 dari 24 lamaran
          </div>
        </Card>
      </section>
    </StudentLayout>
  )
}

export default StudentJobApply
