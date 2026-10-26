import { useEffect, useMemo, useState } from 'react'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import { ChevronDown, ChevronUp, GraduationCap, Mail, BarChart3 } from 'lucide-react'
import { studentProfileApi, type AcademicTranscript } from '../../services/student.service'

type SortKey = 'newest' | 'oldest'

const initialFromName = (name: string) =>
  name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'

const StudentCompetencyProfile = () => {
  const [data, setData] = useState<AcademicTranscript | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [semesterFilter, setSemesterFilter] = useState<number | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('newest')
  const [openIds, setOpenIds] = useState<string[]>([])

  useEffect(() => {
    let aktif = true
    studentProfileApi
      .getAcademic()
      .then((res) => {
        if (!aktif) return
        setData(res)
        // Dua mata kuliah teratas terbuka, seperti pada desain.
        setOpenIds(res.courses.slice(0, 2).map((c) => c.id))
      })
      .catch(() => { if (aktif) setError('Gagal memuat data akademik.') })
      .finally(() => { if (aktif) setLoading(false) })
    return () => { aktif = false }
  }, [])

  const courses = data?.courses ?? []

  const semesters = useMemo(() => {
    const unik = Array.from(new Set(courses.map((c) => c.semester).filter((s): s is number => s != null)))
    return unik.sort((a, b) => b - a)
  }, [courses])

  const visibleCourses = useMemo(() => {
    const filtered =
      semesterFilter === 'all' ? courses : courses.filter((c) => c.semester === semesterFilter)
    return [...filtered].sort((a, b) =>
      sortKey === 'newest'
        ? (b.semester ?? 0) - (a.semester ?? 0)
        : (a.semester ?? 0) - (b.semester ?? 0),
    )
  }, [courses, semesterFilter, sortKey])

  const toggleCourse = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  if (loading) {
    return (
      <StudentLayout>
        <Card className="p-6 text-[14px] text-[#5c6577] shadow-sm">Memuat profil mahasiswa...</Card>
      </StudentLayout>
    )
  }

  if (error || !data) {
    return (
      <StudentLayout>
        <Card className="p-6 text-[14px] text-[#d92d20] shadow-sm">{error ?? 'Data tidak tersedia.'}</Card>
      </StudentLayout>
    )
  }

  const { student, stats } = data
  const nama = student.user?.name ?? 'Mahasiswa'
  const jurusan = [student.faculty, student.major].filter(Boolean).join(' / ') || '-'

  const tiles = [
    { label: 'IPK', value: stats.gpa != null ? Number(stats.gpa).toFixed(2) : '-', accent: true },
    { label: 'Total SKS', value: String(stats.totalSks) },
    { label: 'Total CLO', value: String(stats.totalClo) },
    { label: 'Mata Kuliah', value: String(stats.totalCourses) },
  ]

  return (
    <StudentLayout>
      {/* ===== Kartu identitas + ringkasan angka ===== */}
      <Card className="p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 items-start gap-5">
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-[#d4f542] text-[34px] font-bold text-[#1f2a44]">
              {initialFromName(nama)}
            </div>

            <div className="min-w-0">
              <h1 className="text-[26px] font-bold leading-tight text-[#111827]">{nama}</h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[#4f5a6d]">
                <span className="rounded-md bg-[#f0f3f9] px-2 py-1 font-semibold">
                  NIM: {student.nim ?? '-'}
                </span>
                <span aria-hidden="true">•</span>
                <span>Angkatan {student.entryYear ?? '-'}</span>
              </div>

              <div className="mt-3 grid gap-2 text-[13px] text-[#4f5a6d]">
                <div className="flex items-center gap-2">
                  <Mail size={15} strokeWidth={2} className="text-[#0d6efd]" aria-hidden="true" />
                  {student.user?.email ?? '-'}
                </div>
                <div className="flex items-start gap-2">
                  <GraduationCap size={15} strokeWidth={2} className="mt-0.5 text-[#0d6efd]" aria-hidden="true" />
                  {jurusan}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tiles.map((tile) => (
              <div key={tile.label} className="min-w-[104px] rounded-xl bg-[#eef4ff] px-4 py-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#5c6577]">{tile.label}</p>
                <p className={`mt-2 text-[24px] font-bold leading-none ${tile.accent ? 'text-[#0d6efd]' : 'text-[#111827]'}`}>
                  {tile.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ===== Filter semester & urutan ===== */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="h-10 rounded-lg border border-[#d9dce2] bg-white px-3 text-[13px] font-semibold text-[#1f2a44] outline-none focus:border-[#0d6efd]"
          value={semesterFilter === 'all' ? 'all' : String(semesterFilter)}
          onChange={(e) => setSemesterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        >
          <option value="all">Semua Semester</option>
          {semesters.map((s) => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>

        <select
          className="h-10 rounded-lg border border-[#d9dce2] bg-white px-3 text-[13px] font-semibold text-[#1f2a44] outline-none focus:border-[#0d6efd]"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="newest">Terbaru (semester tertinggi)</option>
          <option value="oldest">Terlama (semester terendah)</option>
        </select>
      </div>

      {/* ===== Daftar mata kuliah + CLO ===== */}
      <div className="grid gap-4">
        {visibleCourses.length === 0 ? (
          <Card className="p-6 text-[14px] text-[#5c6577] shadow-sm">
            Belum ada data mata kuliah untuk filter ini.
          </Card>
        ) : (
          visibleCourses.map((course) => {
            const isOpen = openIds.includes(course.id)
            const nilai = course.score != null ? Math.round(Number(course.score)) : null
            return (
              <Card key={course.id} className="p-0 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-[#f0f3f9] px-2 py-1 text-[11px] font-semibold text-[#4f5a6d]">
                        Semester {course.semester ?? '-'}
                      </span>
                      <span className="rounded-md bg-[#eef4ff] px-2 py-1 text-[11px] font-semibold text-[#0d6efd]">
                        {course.sks ?? '-'} SKS
                      </span>
                    </div>
                    <h2 className="mt-2 text-[20px] font-bold leading-tight text-[#111827]">
                      {course.code ? `${course.code} - ` : ''}{course.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    {course.clos.length > 0 ? (
                      <button
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#0d6efd] px-3 py-1.5 text-[12px] font-semibold text-[#0d6efd] transition-colors hover:bg-[#eef4ff]"
                        type="button"
                        onClick={() => toggleCourse(course.id)}
                      >
                        {isOpen ? (
                          <>
                            <ChevronUp size={14} strokeWidth={2.2} aria-hidden="true" />
                            Tutup Detail CLO
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} strokeWidth={2.2} aria-hidden="true" />
                            Lihat Detail CLO
                          </>
                        )}
                      </button>
                    ) : null}

                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-[#4f5a6d]">Nilai</span>
                      <span className="rounded-md bg-[#f0f3f9] px-3 py-1.5 text-[20px] font-bold leading-none text-[#111827]">
                        {nilai ?? course.grade ?? '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {isOpen && course.clos.length > 0 ? (
                  <div className="border-t border-[#e6eaf2] px-6 py-5">
                    <p className="flex items-center gap-2 text-[13px] font-bold text-[#1f2a44]">
                      <BarChart3 size={15} strokeWidth={2.2} className="text-[#0d6efd]" aria-hidden="true" />
                      Course Learning Outcomes (CLO) &amp; Skills
                    </p>

                    <div className="mt-3 grid gap-3">
                      {course.clos.map((clo) => (
                        <div key={clo.id} className="flex items-start justify-between gap-4 rounded-lg bg-[#f5f8ff] px-4 py-4">
                          <div className="min-w-0">
                            <p className="text-[13px] leading-relaxed text-[#23324a]">
                              {clo.code}: {clo.description}
                            </p>
                            {clo.skills.length > 0 ? (
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-semibold text-[#5c6577]">Skills:</span>
                                {clo.skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="rounded bg-[#dbe7ff] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0d5bd7]"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>

                          <span className="shrink-0 text-[20px] font-bold leading-none text-[#0d6efd]">
                            {clo.score != null ? Math.round(Number(clo.score)) : '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Card>
            )
          })
        )}
      </div>
    </StudentLayout>
  )
}

export default StudentCompetencyProfile
