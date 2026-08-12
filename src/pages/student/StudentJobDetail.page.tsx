import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Tag from '../../components/common/Tag'
import SectionHeader from '../../components/common/SectionHeader'
import ConfirmModal from '../../components/common/ConfirmModal'
import {
  Bookmark,
  Box,
  Building2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react'
import {
  studentMatchingApi,
  studentJobApi,
  studentApplicationApi,
  studentFavoriteApi,
  studentViewApi,
  type JobMatchDetail,
} from '../../services/student.service'

// Durasi dibatasi 1 jam, sama dengan batas yang diterima backend.
const MAKS_DURASI_MS = 3_600_000

const StudentJobDetail = () => {
  const { jobId = '' } = useParams()
  const navigate = useNavigate()

  const [detail, setDetail] = useState<JobMatchDetail | null>(null)
  const [jobInfo, setJobInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openIds, setOpenIds] = useState<string[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const [konfirmasiLamar, setKonfirmasiLamar] = useState(false)

  const viewIdRef = useRef<string | null>(null)
  const viewMulaiRef = useRef(0)
  const jobTercatatRef = useRef<string | null>(null)

  // Catat kunjungan lowongan, lalu lengkapi durasinya saat halaman
  // ditinggalkan. Menjadi sinyal perilaku sekaligus sumber tren aktivitas
  // pada dashboard Super Admin.
  useEffect(() => {
    if (!jobId) return
    viewMulaiRef.current = Date.now()

    // StrictMode menjalankan efek dua kali saat pengembangan; penjaga ini
    // memastikan satu kunjungan hanya menghasilkan satu catatan.
    if (jobTercatatRef.current !== jobId) {
      jobTercatatRef.current = jobId
      studentViewApi
        .record(jobId, 'detail')
        .then((id) => { viewIdRef.current = id })
        .catch(() => { /* pencatatan gagal tidak boleh mengganggu halaman */ })
    }

    const kirimDurasi = () => {
      const id = viewIdRef.current
      if (!id) return
      viewIdRef.current = null // cegah pengiriman ganda
      const durasi = Math.min(Date.now() - viewMulaiRef.current, MAKS_DURASI_MS)
      studentViewApi.updateDuration(id, durasi).catch(() => { /* diabaikan */ })
    }

    window.addEventListener('pagehide', kirimDurasi)
    return () => {
      window.removeEventListener('pagehide', kirimDurasi)
      kirimDurasi()
    }
  }, [jobId])

  useEffect(() => {
    if (!jobId) return
    let aktif = true
    setLoading(true)
    Promise.allSettled([
      studentMatchingApi.jobDetail(jobId),
      studentJobApi.getById(jobId),
      studentMatchingApi.listJobs(),
    ]).then(([d, j, list]) => {
      if (!aktif) return
      if (d.status === 'fulfilled') {
        setDetail(d.value)
        // buka persyaratan pertama secara default, seperti desain awal
        const first = d.value.requirementAnalysis?.[0]
        if (first) setOpenIds([first.id])
      } else {
        setError('Gagal memuat detail lowongan.')
      }
      if (j.status === 'fulfilled') setJobInfo(j.value)
      if (list.status === 'fulfilled') {
        const match = list.value.find((item) => item.id === jobId)
        if (match) {
          setIsFavorite(!!match.isFavorite)
          setHasApplied(!!match.hasApplied)
        }
      }
      setLoading(false)
    })
    return () => { aktif = false }
  }, [jobId])

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleFavorite = async () => {
    const next = !isFavorite
    setIsFavorite(next)
    try {
      if (next) await studentFavoriteApi.add(jobId)
      else await studentFavoriteApi.remove(jobId)
    } catch {
      setIsFavorite(!next)
    }
  }

  // Lamaran tidak bisa ditarik kembali, jadi klik tombol hanya membuka
  // konfirmasi lebih dulu agar tidak terkirim karena salah tekan.
  const applyToJob = async () => {
    setKonfirmasiLamar(false)
    if (hasApplied) return
    setApplying(true)
    try {
      await studentApplicationApi.apply(jobId)
      setHasApplied(true)
      navigate('/student/job-apply')
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Gagal mengirim lamaran.')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <StudentLayout>
        <Card className="p-6 text-[14px] text-[#5c6577] shadow-sm">Memuat detail lowongan...</Card>
      </StudentLayout>
    )
  }

  if (error || !detail) {
    return (
      <StudentLayout>
        <Card className="p-6 text-[14px] text-[#d92d20] shadow-sm">{error ?? 'Lowongan tidak ditemukan.'}</Card>
      </StudentLayout>
    )
  }

  const job = detail.job
  const matchLabel = `${Math.round(detail.matchScore)}%`
  const location = jobInfo?.location ?? '-'
  const jobType = jobInfo?.type ?? '-'
  const analysis = detail.requirementAnalysis ?? []

  return (
    <StudentLayout>
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-4 md:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="grid h-38 w-38 shrink-0 place-items-center rounded-[10px] bg-[#101828] text-white" aria-hidden="true">
              <Box size={50} strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <h1 className="text-[24px] font-bold leading-tight text-[#111827] md:text-[29px]">{job.title}</h1>
              {job.company ? (
                <Link className="mt-1 inline-flex text-[14px] font-medium text-[#0d5bd7]! hover:underline md:text-[15px]" to={`/student/company/${job.company.id}`}>
                  {job.company.name}
                </Link>
              ) : null}

              <div className="mt-2 flex flex-wrap gap-2 text-[12px] font-semibold text-[#3f4a5c]">
                <span className="inline-flex items-center rounded-full bg-[#dce6f7] px-2.5 py-0.5">{location}</span>
                <span className="inline-flex items-center rounded-full bg-[#dce6f7] px-2.5 py-0.5">{jobType}</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button
                  className="h-10 min-w-50 rounded-sm px-4 text-[14px] shadow-none"
                  type="button"
                  disabled={hasApplied || applying}
                  onClick={() => setKonfirmasiLamar(true)}
                >
                  {hasApplied ? 'Sudah Dilamar' : applying ? 'Mengirim...' : 'Lamar Sekarang'}
                </Button>
                <button
                  className="grid h-10 w-10 place-items-center rounded-md border border-[#0d5bd7] text-[#0d5bd7] transition-colors hover:bg-[#edf4ff]"
                  type="button"
                  aria-label="Simpan lowongan"
                  onClick={toggleFavorite}
                >
                  <Bookmark size={18} strokeWidth={2} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="shadow-sm">
          <div className="flex items-center justify-between border-b border-[#d9dce2] px-5 py-4">
            <SectionHeader title="Analisis Kesesuaian Kompetensi" />
            <div>
              <span className="inline-flex items-center rounded-full bg-[#dbe7ff] px-3 py-1 text-[12px] font-semibold text-[#0d5bd7]">
                {matchLabel} Match Score
              </span>
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#5c6577]">Capaian Pembelajaran (CLO)</p>

            <div className="mt-3 grid gap-4">
              {analysis.length === 0 ? (
                <div className="rounded-[14px] border border-[#d9dce2] bg-white px-4 py-5 text-[13px] text-[#5c6577]">
                  Analisis kompetensi belum tersedia untuk lowongan ini. Pastikan nilai dan CLO
                  Anda sudah diinput oleh kampus.
                </div>
              ) : (
                analysis.map((section, index) => {
                  const isOpen = openIds.includes(section.id)
                  return (
                    <div key={section.id} className="overflow-hidden rounded-[14px] border border-[#d9dce2] bg-white">
                      <button
                        className="flex w-full items-center justify-between gap-3 border-b border-[#d9dce2] px-4 py-3 text-left"
                        type="button"
                        onClick={() => toggleOpen(section.id)}
                      >
                        <h2 className="text-[13px] font-semibold text-[#23324a] md:text-[14px]">
                          {index + 1}. {section.deskripsi}
                        </h2>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-[#dbe5f8] px-2.5 py-1 text-[12px] font-semibold text-[#0d5bd7]">
                            {section.matchScore}%
                          </span>
                          {isOpen ? (
                            <ChevronUp size={16} strokeWidth={2} className="text-[#6a7280]" aria-hidden="true" />
                          ) : (
                            <ChevronDown size={16} strokeWidth={2} className="text-[#6a7280]" aria-hidden="true" />
                          )}
                        </div>
                      </button>

                      {isOpen ? (
                        section.cloItems.length === 0 ? (
                          <div className="px-4 py-4 text-[13px] text-[#5c6577]">
                            Belum ada capaian pembelajaran Anda yang cocok dengan persyaratan ini.
                          </div>
                        ) : (
                          <div className="grid gap-0 divide-y divide-[#edf0f5]">
                            {section.cloItems.map((item) => (
                              <div key={item.id} className="grid gap-5 px-4 py-5 md:grid-cols-3">
                                <div>
                                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5c6577]">Matkul</p>
                                  <p className="mt-1 text-[13px] text-[#111827] md:text-[14px]">{item.matkul}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5c6577]">Nilai</p>
                                  <p className="mt-1 text-[22px] font-bold leading-none text-[#111827] md:text-[24px]">{item.nilai}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5c6577]">CLO</p>
                                  <p className="mt-1 text-[12px] font-semibold leading-relaxed text-[#23324a] md:text-[13px]">
                                    {item.kode} — {item.deskripsi}
                                  </p>
                                </div>
                                <div className="md:col-span-3 border-t border-[#edf0f5] pt-3 text-[11px] text-[#5c6577]">
                                  Kemiripan {item.skorKemiripan}% × bobot nilai {item.bobotNilai.toFixed(2)} = {item.kontribusi}% kontribusi
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      ) : null}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </Card>

        <Card className="p-0 shadow-sm">
          <div className="px-4 pt-4">
            <div className="grid place-items-center rounded-xl bg-[#dbe7ff] py-6 text-[#0d5bd7]">
              <span className="text-[42px] font-bold leading-none">{matchLabel}</span>
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide">Match Score</span>
            </div>
          </div>

          <div className="border-t border-[#d9dce2] px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6c7481]">Kebutuhan Kompetensi</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(job.requiredSkills ?? []).map((skill) => (
                <Tag key={skill.id} label={skill.name} />
              ))}
            </div>
          </div>

          <div className="border-t border-[#d9dce2] px-4 py-4">
            <h2 className="text-[14px] font-bold text-[#111827]">Ringkasan</h2>
            <div className="mt-3 grid gap-3 text-[13px] text-[#5a6270]">
              <div className="flex items-center gap-2">
                <MapPin size={16} strokeWidth={2} />
                {location}
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={16} strokeWidth={2} />
                {job.company?.name ?? '-'}
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} strokeWidth={2} />
                {matchLabel} match
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ConfirmModal
        isOpen={konfirmasiLamar}
        icon={Send}
        tone="primary"
        title="Kirim Lamaran?"
        message={
          <>
            Anda akan melamar posisi <strong>{job.title}</strong>
            {job.company ? <> di <strong>{job.company.name}</strong></> : null}. Lamaran yang
            sudah terkirim tidak dapat dibatalkan.
          </>
        }
        confirmLabel="Ya, Lamar Sekarang"
        cancelLabel="Batal"
        onConfirm={applyToJob}
        onCancel={() => setKonfirmasiLamar(false)}
      />
    </StudentLayout>
  )
}

export default StudentJobDetail
