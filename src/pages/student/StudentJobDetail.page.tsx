import { Link, useParams } from 'react-router-dom'
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
  Shield,
  Sparkles,
} from 'lucide-react'

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

  const competencySections = [
    {
      title: '1. Analisis Basis Data',
      score: '90%',
      course: 'Basis Data Terdistribusi',
      grade: '95',
      contribution: 'Kemiripan 95% × nilai 95 = 90% kontribusi',
      clo:
        'CLO 2 — Mampu merancang, mengimplementasikan, dan mengoptimalkan sistem basis data terdistribusi yang skalabel dan aman.',
      expanded: true,
    },
    {
      title: '2. Menguasai Algoritma & Struktur Data',
      score: '90%',
      course: 'Struktur Data',
      grade: '95',
      contribution: 'Kemiripan 95% × nilai 95 = 90% kontribusi',
      clo:
        'CLO 1 — Mampu mengimplementasikan berbagai struktur data (array, stack, queue, tree, graph) dan algoritma pencarian serta pengurutan yang efisien untuk menyelesaikan masalah komputasi kompleks.',
      expanded: true,
    },
    {
      title: '3. Menguasai Javascript, JQuery',
      score: '66%',
      expanded: false,
    },
    {
      title: '4. Keamanan Jaringan',
      score: '64%',
      expanded: false,
    },
  ]

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
              <Link className="mt-1 inline-flex text-[14px] font-medium text-[#0d5bd7] hover:underline md:text-[15px]" to={`/student/company/${job.companyId}`}>
                {job.company}
              </Link>

              <div className="mt-2 flex flex-wrap gap-2 text-[12px] font-semibold text-[#3f4a5c]">
                <span className="inline-flex items-center rounded-full bg-[#dce6f7] px-2.5 py-0.5">{job.location}</span>
                <span className="inline-flex items-center rounded-full bg-[#dce6f7] px-2.5 py-0.5">{job.type}</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button className="h-10 min-w-50 rounded-sm px-4 text-[14px] shadow-none" type="button">
                  Lamar Sekarang
                </Button>
                <button
                  className="grid h-10 w-10 place-items-center rounded-md border border-[#0d5bd7] text-[#0d5bd7] transition-colors hover:bg-[#edf4ff]"
                  type="button"
                  aria-label="Simpan lowongan"
                >
                  <Bookmark size={18} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="shadow-sm">
          <div className="flex items-center justify-between border-b border-[#d9dce2] px-5 py-4">
            <SectionHeader
              title="Analisis Kesesuaian Kompetensi"
            />
            <div>
              <span className="inline-flex items-center rounded-full bg-[#dbe7ff] px-3 py-1 text-[12px] font-semibold text-[#0d5bd7]">
                {job.match} Match Score
              </span>
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#5c6577]">Capaian Pembelajaran (CLO)</p>

            <div className="mt-3 grid gap-4">
              {competencySections.map((section) => (
                <div key={section.title} className="overflow-hidden rounded-[14px] border border-[#d9dce2] bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-[#d9dce2] px-4 py-3">
                    <h2 className="text-[13px] font-semibold text-[#23324a] md:text-[14px]">{section.title}</h2>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-[#dbe5f8] px-2.5 py-1 text-[12px] font-semibold text-[#0d5bd7]">
                        {section.score}
                      </span>
                      {section.expanded ? (
                        <ChevronUp size={16} strokeWidth={2} className="text-[#6a7280]" aria-hidden="true" />
                      ) : (
                        <ChevronDown size={16} strokeWidth={2} className="text-[#6a7280]" aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  {section.expanded ? (
                    <div className="grid gap-5 px-4 py-5 md:grid-cols-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5c6577]">Matkul</p>
                        <p className="mt-1 text-[13px] text-[#111827] md:text-[14px]">{section.course}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5c6577]">Nilai</p>
                        <p className="mt-1 text-[22px] font-bold leading-none text-[#111827] md:text-[24px]">{section.grade}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5c6577]">CLO</p>
                        <p className="mt-1 text-[12px] font-semibold leading-relaxed text-[#23324a] md:text-[13px]">{section.clo}</p>
                      </div>
                      <div className="md:col-span-3 border-t border-[#edf0f5] pt-3 text-[11px] text-[#5c6577]">
                        {section.contribution}
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-4 text-[13px] text-[#5c6577]">Bagian kompetensi ini belum terbuka penuh.</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-0 shadow-sm">
          <div className="px-4 pt-4">
            <div className="grid place-items-center rounded-xl bg-[#dbe7ff] py-6 text-[#0d5bd7]">
              <span className="text-[42px] font-bold leading-none">{job.match}</span>
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide">Match Score</span>
            </div>
          </div>

          <div className="px-4 py-4 text-[13px] leading-relaxed text-[#5a6270]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6c7481]">Tentang Lowongan</p>
            <p className="mt-2">{job.about}</p>
          </div>

          <div className="border-t border-[#d9dce2] px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6c7481]">Kebutuhan Kompetensi</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.requirements.map((item) => (
                <Tag key={item} label={item} />
              ))}
            </div>
          </div>

          <div className="border-t border-[#d9dce2] px-4 py-4">
            <h2 className="text-[14px] font-bold text-[#111827]">Ringkasan</h2>
            <div className="mt-3 grid gap-3 text-[13px] text-[#5a6270]">
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
          </div>
        </Card>
      </div>
    </StudentLayout>
  )
}

export default StudentJobDetail