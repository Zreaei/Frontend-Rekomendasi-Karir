import { useEffect, useMemo, useState } from 'react'
import StudentLayout from '../../layouts/StudentLayout'
import StatCard from '../../components/common/StatCard'
import { FileText, GraduationCap, Star, User } from 'lucide-react'
import SectionHeader from '../../components/common/SectionHeader'
import {
  studentProfileApi,
  type StudentProfile,
  type StudentCompetency,
} from '../../services/student.service'

const StudentCompetencyProfile = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [competency, setCompetency] = useState<StudentCompetency | null>(null)
  const [loading, setLoading] = useState(true)
  const [semesterFilter, setSemesterFilter] = useState<number | 'all'>('all')

  useEffect(() => {
    let aktif = true
    Promise.allSettled([studentProfileApi.getProfile(), studentProfileApi.getCompetency()]).then(
      ([p, c]) => {
        if (!aktif) return
        if (p.status === 'fulfilled') setProfile(p.value)
        if (c.status === 'fulfilled') setCompetency(c.value)
        setLoading(false)
      },
    )
    return () => { aktif = false }
  }, [])

  const subjects = profile?.subjectsTaken ?? []

  const semesters = useMemo(() => {
    const unik = Array.from(new Set(subjects.map((s) => s.semester).filter((s): s is number => s != null)))
    return unik.sort((a, b) => a - b)
  }, [subjects])

  const visibleSubjects =
    semesterFilter === 'all' ? subjects : subjects.filter((s) => s.semester === semesterFilter)

  const totalSks = subjects.reduce((sum, s) => sum + (s.subject?.sks ?? 0), 0)
  const avgScore = subjects.length
    ? Math.round(subjects.reduce((sum, s) => sum + (Number(s.score) || 0), 0) / subjects.length)
    : 0

  const profileFields = [
    { label: 'NAMA LENGKAP', value: profile?.user?.name ?? '-' },
    { label: 'NIM', value: profile?.nim ?? '-' },
    { label: 'IPK', value: profile?.gpa != null ? Number(profile.gpa).toFixed(2) : '-' },
    { label: 'FAKULTAS', value: profile?.faculty ?? profile?.university?.name ?? '-' },
    { label: 'EMAIL', value: profile?.user?.email ?? '-' },
    { label: 'SEMESTER', value: profile?.semester != null ? String(profile.semester) : '-' },
    { label: 'PROGRAM STUDI', value: profile?.major ?? '-' },
    { label: 'ANGKATAN', value: profile?.entryYear != null ? String(profile.entryYear) : '-' },
  ]

  const stats = [
    { title: 'Mata Kuliah', value: String(subjects.length), icon: <Star size={18} strokeWidth={2} /> },
    { title: 'Total Keahlian', value: String(competency?.totalSkills ?? 0), icon: <GraduationCap size={18} strokeWidth={2} /> },
    { title: 'Rata-rata Nilai', value: String(avgScore), icon: <FileText size={18} strokeWidth={2} /> },
    { title: 'Total SKS', value: String(totalSks), icon: <FileText size={18} strokeWidth={2} /> },
  ]

  return (
    <StudentLayout>
      <SectionHeader
        title="Profil Kompetensi Pengguna"
        description="Informasi pengguna, data akademik, dan capaian pembelajaran mata kuliah"
      />
      <div className="space-y-10">
        <section className="grid bg-white p-6 rounded-xl shadow-sm grid-cols-[170px_minmax(0,1fr)] items-start gap-8 max-[960px]:grid-cols-1">
          <div className="flex h-42.5 w-42.5 items-center justify-center rounded-sm bg-[#0d6efd] text-white">
            <User size={50} strokeWidth={2} />
          </div>

          <div className="grid grid-cols-3 gap-x-10 gap-y-8 max-[960px]:grid-cols-2 max-sm:grid-cols-1">
            {profileFields.map((field) => (
              <div key={field.label} className="space-y-1.5">
                <p className="text-[13px] font-medium uppercase text-[#1f1f1f]">{field.label}</p>
                <p className="text-[16px] font-semibold leading-tight text-[#050505]">
                  {loading ? '...' : field.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-4 gap-4 max-[960px]:grid-cols-2">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={loading ? '...' : stat.value} icon={stat.icon} />
          ))}
        </div>

        {competency && competency.skills.length > 0 ? (
          <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-[18px] font-bold text-[#050505]">Keahlian ({competency.totalSkills})</h2>
            <div className="flex flex-wrap gap-2.5">
              {competency.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5ff] px-3 py-1.5 text-[12px] font-semibold text-[#0d6efd]"
                  title={`Sumber: ${skill.source}`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-8 overflow-x-auto border-b border-[#0d6efd] pb-4 text-[15px] text-[#050505]">
            <button
              className={`whitespace-nowrap border-none bg-transparent px-0 py-0 ${semesterFilter === 'all' ? 'font-semibold text-[#0d6efd]' : 'font-normal'}`}
              type="button"
              onClick={() => setSemesterFilter('all')}
            >
              Semua
            </button>
            {semesters.map((semester) => (
              <button
                key={semester}
                className={`whitespace-nowrap border-none bg-transparent px-0 py-0 ${semesterFilter === semester ? 'font-semibold text-[#0d6efd]' : 'font-normal'}`}
                type="button"
                onClick={() => setSemesterFilter(semester)}
              >
                Semester {semester}
              </button>
            ))}
          </div>

          <div className="grid gap-5">
            <div className="grid grid-cols-[100px_minmax(0,1.8fr)_0.8fr_0.55fr_1fr] gap-6 text-[14px] font-bold uppercase text-[#050505] max-lg:grid-cols-2 max-sm:grid-cols-1">
              <span>Kode</span>
              <span>Mata Kuliah</span>
              <span>Semester</span>
              <span>SKS</span>
              <span>Nilai</span>
            </div>

            {loading ? (
              <p className="text-[13px] text-[#5c6577]">Memuat data akademik...</p>
            ) : visibleSubjects.length === 0 ? (
              <p className="text-[13px] text-[#5c6577]">Belum ada data mata kuliah.</p>
            ) : (
              visibleSubjects.map((course, index) => (
                <div
                  key={`${course.subject?.id ?? index}`}
                  className="grid grid-cols-[100px_minmax(0,1.8fr)_0.8fr_0.55fr_1fr] items-start gap-6 text-[13px] text-[#050505] max-lg:grid-cols-2 max-sm:grid-cols-1"
                >
                  <span className="font-semibold">{course.subject?.code ?? '-'}</span>
                  <span>{course.subject?.name ?? '-'}</span>
                  <span>{course.semester ?? '-'}</span>
                  <span>{course.subject?.sks ?? '-'}</span>
                  <span className="font-semibold">
                    {course.grade ?? (course.score != null ? String(course.score) : '-')}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </StudentLayout>
  )
}

export default StudentCompetencyProfile
