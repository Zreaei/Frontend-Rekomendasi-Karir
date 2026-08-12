import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Bookmark, Building2 } from 'lucide-react'
import {
  studentMatchingApi,
  studentApplicationApi,
  studentFavoriteApi,
  type JobMatch,
} from '../../services/student.service'

const StudentJobRecommendation = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applyingId, setApplyingId] = useState<string | null>(null)

  useEffect(() => {
    let aktif = true
    studentMatchingApi
      .listJobs()
      .then((data) => { if (aktif) setJobs(data) })
      .catch(() => { if (aktif) setError('Gagal memuat rekomendasi pekerjaan.') })
      .finally(() => { if (aktif) setLoading(false) })
    return () => { aktif = false }
  }, [])

  const toggleFavorite = async (job: JobMatch) => {
    // optimistis: ubah dulu di UI, kembalikan bila gagal
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, isFavorite: !j.isFavorite } : j)))
    try {
      if (job.isFavorite) await studentFavoriteApi.remove(job.id)
      else await studentFavoriteApi.add(job.id)
    } catch {
      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, isFavorite: job.isFavorite } : j)))
    }
  }

  const applyToJob = async (job: JobMatch) => {
    if (job.hasApplied) return
    setApplyingId(job.id)
    try {
      await studentApplicationApi.apply(job.id)
      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, hasApplied: true } : j)))
      navigate('/student/job-apply')
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Gagal mengirim lamaran.')
    } finally {
      setApplyingId(null)
    }
  }

  const [featuredJob, ...otherJobs] = jobs

  return (
    <StudentLayout>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold leading-tight">Rekomendasi Pekerjaan</h1>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed ">
            Cari Rekomendasi pekerjaan yang sesuai dengan profil kompetensi dan minat Anda
          </p>
        </div>
      </div>

      {loading ? (
        <Card className="p-6 text-[14px] text-[#5c6577] shadow-sm">Memuat rekomendasi pekerjaan...</Card>
      ) : error ? (
        <Card className="p-6 text-[14px] text-[#d92d20] shadow-sm">{error}</Card>
      ) : jobs.length === 0 ? (
        <Card className="p-6 text-[14px] text-[#5c6577] shadow-sm">
          Belum ada lowongan aktif yang cocok dengan profil Anda saat ini.
        </Card>
      ) : (
        <>
          {featuredJob ? (
            <Card className="overflow-hidden shadow-sm">
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[10px] border border-[#d7dbe3] bg-[#f7f9fc] text-[#0d6efd] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]" aria-hidden="true">
                      <Building2 size={20} strokeWidth={2} />
                    </div>

                    <div className="min-w-0">
                      <span className="inline-flex items-center rounded-full bg-[#8bf0c5] px-3 py-1 text-[12px] font-semibold text-[#0f766e]">
                        {Math.round(featuredJob.matchScore)}% Match
                      </span>
                      <h2 className="mt-3 text-[18px] font-semibold leading-tight text-[#111827] md:text-[20px]">
                        {featuredJob.title}
                      </h2>
                      <Link
                        className="mt-0.5 block text-left text-[13px] font-medium text-[#4b5563] hover:text-[#0d6efd]"
                        to={featuredJob.company ? `/student/company/${featuredJob.company.id}` : '#'}
                      >
                        {featuredJob.company?.name ?? '-'} • {featuredJob.location ?? '-'}
                      </Link>

                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {(featuredJob.requiredSkills ?? []).slice(0, 5).map((skill) => (
                          <span key={skill.id} className="inline-flex items-center rounded-[5px] bg-[#dbe4f0] px-2.5 py-1 text-[11px] font-medium text-[#586271]">
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    className={`rounded-md p-1.5 transition-colors hover:bg-[#f3f4f6] ${featuredJob.isFavorite ? 'text-[#0d5bd7]' : 'text-[#111827] hover:text-[#0d6efd]'}`}
                    type="button"
                    aria-label="Simpan lowongan"
                    onClick={() => toggleFavorite(featuredJob)}
                  >
                    <Bookmark size={16} strokeWidth={2} fill={featuredJob.isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 rounded-b-lg border-t border-[#dbe2ee] bg-[#edf3ff] px-4 py-3 md:px-5">
                  <Link
                    className="flex h-9 items-center justify-center rounded-md border border-[#0d5bd7] px-4 text-[13px] font-semibold text-[#0d5bd7] transition-colors hover:bg-[#e3edff]"
                    to={`/student/job-matching/${featuredJob.id}`}
                  >
                    Lihat Detail
                  </Link>
                  <Button
                    className="h-9 min-w-29.5 rounded-md px-4 text-[13px] font-semibold shadow-none"
                    type="button"
                    disabled={featuredJob.hasApplied || applyingId === featuredJob.id}
                    onClick={() => applyToJob(featuredJob)}
                  >
                    {featuredJob.hasApplied ? 'Sudah Dilamar' : applyingId === featuredJob.id ? 'Mengirim...' : 'Lamar Sekarang'}
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}

          {otherJobs.length > 0 ? <SectionHeader title="Rekomendasi Lainnya" /> : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {otherJobs.map((job) => (
              <Card key={job.id} className="p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="p-2.5 border rounded-md text-[#4d596b]">
                      <Building2 size={18} strokeWidth={2} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold leading-tight text-[#111827]">{job.title}</h3>
                      <p className="mt-1 text-[12px] text-[#5b6472]">
                        {job.company?.name ?? '-'} • {job.location ?? '-'}
                      </p>
                    </div>
                  </div>

                  <span className="whitespace-nowrap text-[11px] font-medium text-[#24856c]">
                    {Math.round(job.matchScore)}% Match
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(job.requiredSkills ?? []).slice(0, 4).map((skill) => (
                    <span key={skill.id} className="inline-flex items-center rounded-sm bg-[#eef1f6] px-2.5 py-1 text-[11px] font-medium">
                      {skill.name}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Link
                    className="flex h-10 flex-1 items-center justify-center rounded-[5px] bg-[#0d5bd7] px-4 text-[13px] text-white! font-semibold transition-colors hover:bg-[#0b4fbf]"
                    to={`/student/job-matching/${job.id}`}
                  >
                    Lihat Detail
                  </Link>

                  <button
                    className={`grid w-10 h-10 shrink-0 place-items-center rounded-[5px] border-2 border-[#0d5bd7] text-[#0d5bd7] transition-colors hover:bg-[#edf4ff]`}
                    type="button"
                    aria-label={`Simpan ${job.title}`}
                    onClick={() => toggleFavorite(job)}
                  >
                    <Bookmark size={20} strokeWidth={2} fill={job.isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </StudentLayout>
  )
}

export default StudentJobRecommendation
