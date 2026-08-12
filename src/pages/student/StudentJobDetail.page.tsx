import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Tag from '../../components/common/Tag'
import SectionHeader from '../../components/common/SectionHeader'
import {
  Bookmark,
  Box,
  Building2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
} from 'lucide-react'
import {
  studentMatchingApi,
  studentJobApi,
  studentApplicationApi,
  studentFavoriteApi,
  type JobMatchDetail,
} from '../../services/student.service'

const StudentJobDetail = () => {
  const { jobId = '' } = useParams()
  const navigate = useNavigate()

  const [detail, setDetail] = useState<JobMatchDetail | null>(null)
  const [jobInfo, setJobInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true })
  const [isFavorite, setIsFavorite] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applying, setApplying] = useState(false)

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
      if (d.status === 'fulfilled') setDetail(d.value)
      else setError('Gagal memuat detail lowongan.')
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

  const applyToJob = async () => {
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
  const description = job.description ?? jobInfo?.description ?? ''
  const breakdown = detail.requirementBreakdown ?? []

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
                <Link className="mt-1 inline-flex text-[14px] font-medium text-[#0d5bd7] hover:underline md:text-[15px]" to={`/student/company/${job.company.id}`}>
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
                  onClick={applyToJob}
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
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#5c6577]">
              {breakdown.length > 0 ? 'Capaian Pembelajaran (CLO)' : 'Kesesuaian Keahlian'}
            </p>

            <div className="mt-3 grid gap-4">
              {breakdown.length > 0 ? (
                breakdown.map((section: any, index) => {
                  const isOpen = !!expanded[index]
                  const score = section.score ?? section.similarity
                  return (
                    <div key={index} className="overflow-hidden rounded-[14px] border border-[#d9dce2] bg-white">
                      <button
                        className="flex w-full items-center justify-between gap-3 border-b border-[#d9dce2] px-4 py-3 text-left"
                        type="button"
                        onClick={() => setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))}
                      >
                        <h2 className="text-[13px] font-semibold text-[#23324a] md:text-[14px]">
                          {index + 1}. {section.requirement ?? 'Persyaratan'}
                        </h2>
                        <div className="flex items-center gap-2">
                          {score != null ? (
                            <span className="inline-flex items-center rounded-md bg-[#dbe5f8] px-2.5 py-1 text-[12px] font-semibold text-[#0d5bd7]">
                              {Math.round(Number(score))}%
                            </span>
                          ) : null}
                          {isOpen ? (
                            <ChevronUp size={16} strokeWidth={2} className="text-[#6a7280]" aria-hidden="true" />
                          ) : (
                            <ChevronDown size={16} strokeWidth={2} className="text-[#6a7280]" aria-hidden="true" />
                          )}
                        </div>
                      </button>

                      {isOpen ? (
                        <div className="grid gap-5 px-4 py-5 md:grid-cols-3">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5c6577]">Matkul</p>
                            <p className="mt-1 text-[13px] text-[#111827] md:text-[14px]">{section.bestSubject ?? section.subject ?? '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5c6577]">Nilai</p>
                            <p className="mt-1 text-[22px] font-bold leading-none text-[#111827] md:text-[24px]">{section.grade ?? '-'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5c6577]">CLO</p>
                            <p className="mt-1 text-[12px] font-semibold leading-relaxed text-[#23324a] md:text-[13px]">
                              {section.bestClo ?? section.clo ?? '-'}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )
                })
              ) : (
                <div className="grid gap-3">
                  <div>
                    <p className="text-[12px] font-semibold text-[#0f766e]">Keahlian yang cocok</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(detail.matchedSkills ?? []).length === 0 ? (
                        <span className="text-[13px] text-[#5c6577]">Belum ada keahlian yang cocok.</span>
                      ) : (
                        (detail.matchedSkills ?? []).map((skill: any, i) => <Tag key={i} label={skill.name} />)
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#d92d20]">Keahlian yang belum dimiliki</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(detail.gapSkills ?? []).length === 0 ? (
                        <span className="text-[13px] text-[#5c6577]">Semua keahlian yang dibutuhkan sudah dimiliki.</span>
                      ) : (
                        (detail.gapSkills ?? []).map((skill: any, i) => <Tag key={i} label={skill.name} />)
                      )}
                    </div>
                  </div>
                </div>
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

          <div className="px-4 py-4 text-[13px] leading-relaxed text-[#5a6270]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6c7481]">Tentang Lowongan</p>
            <p className="mt-2">{description || 'Deskripsi lowongan belum tersedia.'}</p>
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
    </StudentLayout>
  )
}

export default StudentJobDetail
