import { Link, useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Tag from '../../components/common/Tag'
import SectionHeader from '../../components/common/SectionHeader'
import { Bookmark, Building2, MapPin, Shield, Sparkles } from 'lucide-react'

const jobDetails = {
  'junior-full-stack-engineer': {
    title: 'Junior Full-Stack Engineer',
    company: 'NovaStream Tech',
    companyId: 'novastream-tech',
    location: 'Jakarta, Indonesia (Remote)',
    type: 'Full-time',
    match: '98%',
    description:
      'Bergabunglah dengan tim teknik kami yang berkembang pesat untuk membangun masa depan data streaming. Anda akan berkolaborasi dengan pengembang senior untuk meluncurkan fitur-fitur berkualitas tinggi yang digunakan oleh jutaan orang.',
    skills: ['React', 'Node.js', 'AWS', '+2 keahlian lainnya'],
    about:
      'Sebagai Junior Full-Stack Engineer di NovaStream, Anda akan bertanggung jawab membangun layanan data streaming video generasi berikutnya. Kami mencari talenta yang memiliki fondasi kuat dalam arsitektur sistem dan antarmuka pengguna yang responsif.',
    requirements: ['PostgreSQL', 'AWS', 'Docker', 'TypeScript', 'React', 'Node.js'],
    icon: <Shield size={20} strokeWidth={2} />,
  },
} as const

const fallbackJob = {
  title: 'Junior Full-Stack Engineer',
  company: 'NovaStream Tech',
  companyId: 'novastream-tech',
  location: 'Jakarta, Indonesia (Remote)',
  type: 'Full-time',
  match: '98%',
  description:
    'Bergabunglah dengan tim teknik kami yang berkembang pesat untuk membangun masa depan data streaming. Anda akan berkolaborasi dengan pengembang senior untuk meluncurkan fitur-fitur berkualitas tinggi yang digunakan oleh jutaan orang.',
  skills: ['React', 'Node.js', 'AWS', '+2 keahlian lainnya'],
  about:
    'Sebagai Junior Full-Stack Engineer di NovaStream, Anda akan bertanggung jawab membangun layanan data streaming video generasi berikutnya. Kami mencari talenta yang memiliki fondasi kuat dalam arsitektur sistem dan antarmuka pengguna yang responsif.',
  requirements: ['PostgreSQL', 'AWS', 'Docker', 'TypeScript', 'React', 'Node.js'],
  icon: <Shield size={20} strokeWidth={2} />,
}

const StudentJobDetail = () => {
  const { jobId = 'junior-full-stack-engineer' } = useParams()
  const job = jobDetails[jobId as keyof typeof jobDetails] ?? fallbackJob

  return (
    <StudentLayout>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#101828] text-white" aria-hidden="true">
            {job.icon}
          </div>
          <div>
            <h1 className="text-[28px] font-bold leading-tight text-[#050505]">{job.title}</h1>
            <Link
              className="mt-1 inline-flex text-[15px] font-semibold hover:underline"
              to={`/student/company/${job.companyId}`}
            >
              <span className="text-[#0d6efd] hover:underline">{job.company}</span>
            </Link>
            <div className="mt-2 gap-1 flex flex-wrap text-[12px] text-[#4f5a6d]">
              <span className="p-0.5 px-2 inline-flex items-center rounded-full bg-[#63a2ff] font-semibold text-[#ffffff]">
                {job.location}
              </span>
              <span className="p-0.5 inline-flex items-center rounded-full bg-[#63a2ff] px-2.5 font-semibold text-[#ffffff]">
                {job.type}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="button">Lamar Sekarang</Button>
          <div className="grid h-16 w-16 place-items-center rounded-full border-[6px] border-[#0d6efd] bg-white text-center text-[#0d6efd]">
            <span className="text-[14px] font-semibold">{job.match}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-6 shadow-sm">
          <SectionHeader
            title="Analisis Kesesuaian Kompetensi"
            action={<span className="rounded-full bg-[#eef5ff] px-3 py-1 text-[12px] font-semibold text-[#0d6efd]">{job.match} Match Score</span>}
          />

          <div className="mt-6 grid gap-4">
            {[
              {
                title: '1. Analisis Basis Data',
                score: '90%',
                course: 'Basis Data Terdistribusi',
                grade: '95',
                clo:
                  'CLO 2 — Mampu merancang, mengimplementasikan, dan mengoptimalkan sistem basis data terdistribusi yang skalabel dan aman.',
              },
              {
                title: '2. Menguasai Algoritma & Struktur Data',
                score: '90%',
                course: 'Struktur Data',
                grade: '95',
                clo:
                  'CLO 1 — Mampu mengimplementasikan berbagai struktur data (array, stack, queue, tree, graph) dan algoritma pencarian serta pengurutan yang efisien untuk menyelesaikan masalah komputasi kompleks.',
              },
              {
                title: '3. Menguasai Javascript, JQuery',
                score: '66%',
              },
              {
                title: '4. Keamanan Jaringan',
                score: '64%',
              },
            ].map((section) => (
              <div key={section.title} className="rounded-xl border border-[#d9dce2]">
                <div className="flex items-center justify-between gap-4 border-b border-[#d9dce2] px-4 py-3">
                  <h2 className="text-[14px] font-bold text-[#1f2a44]">{section.title}</h2>
                  <span className="inline-flex items-center rounded-md bg-[#dbe5f8] px-2.5 py-1 text-[12px] font-semibold text-[#1f2a44]">
                    {section.score}
                  </span>
                </div>
                {'course' in section ? (
                  <div className="grid gap-6 px-4 py-5 md:grid-cols-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-[#5c6577]">Matkul</p>
                      <p className="mt-1 text-[14px] text-[#050505]">{section.course}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-[#5c6577]">Nilai</p>
                      <p className="mt-1 text-[24px] font-bold text-[#050505]">{section.grade}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-[#5c6577]">CLO</p>
                      <p className="mt-1 text-[13px] font-semibold leading-relaxed text-[#1f2a44]">{section.clo}</p>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-4 text-[13px] text-[#5c6577]">Bagian kompetensi ini belum terbuka penuh.</div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="p-6 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#050505]">Tentang Lowongan</h2>
            <p className="mt-4 text-[14px] leading-relaxed text-[#4f5a6d]">{job.about}</p>
            <div className="mt-6 border-t border-[#d9dce2] pt-4">
              <h3 className="text-[12px] font-semibold uppercase tracking-wide text-[#5c6577]">Kebutuhan Kompetensi</h3>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {job.requirements.map((item) => (
                  <Tag key={item} label={item} />
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#050505]">Ringkasan</h2>
            <div className="mt-4 grid gap-3 text-[14px] text-[#4f5a6d]">
              <div className="flex items-center gap-2">
                <MapPin size={16} strokeWidth={2} />
                {job.location}
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={16} strokeWidth={2} />
                {job.company}
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} strokeWidth={2} />
                {job.match} match
              </div>
            </div>
          </Card>
        </div>
      </div>
    </StudentLayout>
  )
}

export default StudentJobDetail