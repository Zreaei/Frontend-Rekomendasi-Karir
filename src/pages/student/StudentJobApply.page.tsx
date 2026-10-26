import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import Card from '../../components/common/Card'
import StatusPill from '../../components/common/StatusPill'
import Button from '../../components/common/Button'
import {
  CheckCircle2,
  Clock3,
  FileText,
  Send,
  XCircle,
} from 'lucide-react'
import { studentApplicationApi, type MyApplication } from '../../services/student.service'

const STATUS_VIEW: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  pending: { label: 'Menunggu', tone: 'warning' },
  processing: { label: 'Diproses', tone: 'warning' },
  accepted: { label: 'Diterima', tone: 'success' },
  rejected: { label: 'Ditolak', tone: 'danger' },
}

const formatDate = (value?: string | null) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const StudentJobApply = () => {
  const [applications, setApplications] = useState<MyApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let aktif = true
    studentApplicationApi
      .listMine()
      .then((data) => { if (aktif) setApplications(data) })
      .catch(() => { if (aktif) setError('Gagal memuat riwayat lamaran.') })
      .finally(() => { if (aktif) setLoading(false) })
    return () => { aktif = false }
  }, [])

  const total = applications.length
  const accepted = applications.filter((a) => a.status === 'accepted').length
  const waiting = applications.filter((a) => a.status === 'pending' || a.status === 'processing').length
  const rejected = applications.filter((a) => a.status === 'rejected').length

  const stats = [
    { title: 'Total Terkirim', value: String(total), icon: <Send size={18} strokeWidth={2} />, accent: 'bg-[#ecfff8] text-[#0f766e]' },
    { title: 'Diterima', value: String(accepted), icon: <CheckCircle2 size={18} strokeWidth={2} />, accent: 'bg-[#eef5ff] text-[#0d6efd]' },
    { title: 'Menunggu Tanggapan', value: String(waiting), icon: <Clock3 size={18} strokeWidth={2} />, accent: 'bg-[#fff4e8] text-[#b45a00]' },
    { title: 'Ditolak', value: String(rejected), icon: <XCircle size={18} strokeWidth={2} />, accent: 'bg-[#fff0f0] text-[#d92d20]' },
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
            <p className="mt-1 text-[28px] font-bold leading-none text-[#050505]">{loading ? '...' : stat.value}</p>
          </Card>
        ))}
      </div>

      <section>
        <Card className="p-6 shadow-sm">
          <SectionHeader title="Riwayat Pengajuan" />

          <div className="mt-5 overflow-hidden rounded-lg border border-[#d9dce2]">
            <div className="grid grid-cols-[1.3fr_0.7fr_0.8fr_0.6fr] gap-4 border-b border-[#d9dce2] bg-[#f7f9fc] px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#5c6577]">
              <span>Perusahaan & Posisi</span>
              <span>Tanggal Melamar</span>
              <span>Status</span>
              <span>Aksi</span>
            </div>

            <div className="grid gap-0">
              {loading ? (
                <div className="px-4 py-8 text-center text-[13px] text-[#5c6577]">Memuat riwayat lamaran...</div>
              ) : error ? (
                <div className="px-4 py-8 text-center text-[13px] text-[#d92d20]">{error}</div>
              ) : applications.length === 0 ? (
                <div className="px-4 py-8 text-center text-[13px] text-[#5c6577]">
                  Belum ada lamaran. <Link className="font-semibold text-[#0d6efd]" to="/student/job-matching">Cari lowongan sekarang</Link>.
                </div>
              ) : (
                applications.map((item) => {
                  const view = STATUS_VIEW[item.status] ?? { label: item.statusLabel ?? item.status, tone: 'warning' as const }
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1.3fr_0.7fr_0.8fr_0.6fr] items-center gap-4 border-b border-[#d9dce2] px-4 py-5 text-[13px] last:border-b-0 max-lg:grid-cols-1"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-md bg-[#eef5ff] text-[#0d6efd]" aria-hidden="true">
                          <FileText size={17} strokeWidth={2} />
                        </div>
                        <div>
                          <p className="font-semibold text-[#050505]">{item.job?.title ?? '-'}</p>
                          <p className="mt-1 text-[#4f5a6d]">
                            {item.job?.company?.name ?? '-'} • {item.job?.location ?? '-'}
                          </p>
                        </div>
                      </div>

                      <p className="text-[#4f5a6d]">{formatDate(item.appliedAt)}</p>
                      <StatusPill label={view.label} tone={view.tone} />

                      <div className="flex items-center gap-2">
                        {item.job ? (
                          <Link to={`/student/job-matching/${item.job.id}`}>
                            <Button variant="ghost" className="w-fit" type="button">
                              Detail
                            </Button>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
          {!loading && applications.length > 0 ? (
            <div className="pt-5 text-[13px] font-semibold">
              Menampilkan {applications.length} dari {applications.length} lamaran
            </div>
          ) : null}
        </Card>
      </section>
    </StudentLayout>
  )
}

export default StudentJobApply
