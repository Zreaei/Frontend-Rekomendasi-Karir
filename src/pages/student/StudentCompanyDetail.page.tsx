import { Link, useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SectionHeader from '../../components/common/SectionHeader'
import { Building2, Globe, MapPin, Users, ArrowRight, Code2, Bug, Smartphone } from 'lucide-react'

const companyDetails = {
  'novastream-tech': {
    name: 'NovaStream Tech',
    industry: 'Information Technology',
    employees: '501-1000 Members',
    headquarters: 'Jakarta, Indonesia',
    about:
      'NovaStream Tech adalah pemimpin inovasi dalam solusi streaming data dan analitik real-time. Misi kami adalah membangun ekosistem teknologi yang andal, cepat, dan skalabel untuk mendukung generasi produk digital berikutnya.',
    tags: ['#BigData', '#CloudComputing', '#AI', '#DigitalInnovation'],
    jobs: [
      {
        title: 'Full-Stack Engineer',
        meta: 'Engineering • Full-time • Jakarta (Hybrid)',
        match: '92%',
        icon: <Code2 size={18} strokeWidth={2} />,
      },
      {
        title: 'QA Intern',
        meta: 'Quality Assurance • Part-time • On-site',
        match: '89%',
        icon: <Bug size={18} strokeWidth={2} />,
      },
      {
        title: 'Data Analyst',
        meta: 'Data Science • Full-time • New York (Remote)',
        match: '90%',
        icon: <Smartphone size={18} strokeWidth={2} />,
      },
      {
        title: 'Product Manager',
        meta: 'Product Development • Full-time • San Francisco (On-site)',
        match: '93%',
        icon: <Users size={18} strokeWidth={2} />,
      },
      {
        title: 'Marketing Specialist',
        meta: 'Marketing • Full-time • London (Hybrid)',
        match: '88%',
        icon: <Globe size={18} strokeWidth={2} />,
      },
      {
        title: 'Frontend Developer',
        meta: 'Engineering • Full-time • Berlin (Remote)',
        match: '91%',
        icon: <Code2 size={18} strokeWidth={2} />,
      },
    ],
  },
} as const

const fallbackCompany = companyDetails['novastream-tech']

const CompanyDetail = () => {
  const { companyId = 'novastream-tech' } = useParams()
  const company = companyDetails[companyId as keyof typeof companyDetails] ?? fallbackCompany

  return (
    <StudentLayout>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-5">
          <Card className="p-6 shadow-sm">
            <div className="flex flex-wrap items-start gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-xl bg-[#0d6efd] text-white" aria-hidden="true">
                <Building2 size={30} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-[28px] font-bold leading-tight text-[#050505]">{company.name}</h1>
                <p className="mt-1 text-[15px] text-[#4f5a6d]">{company.industry}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-[#4f5a6d]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5ff] px-2.5 py-1 font-semibold text-[#0d6efd]">
                    <Users size={14} strokeWidth={2} />
                    {company.employees}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5ff] px-2.5 py-1 font-semibold text-[#0d6efd]">
                    <MapPin size={14} strokeWidth={2} />
                    {company.headquarters}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <Card className="p-6 shadow-sm">
              <h2 className="text-[18px] font-bold text-[#1f2a44]">Tentang Kami</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-[#4f5a6d]">{company.about}</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {company.tags.map((tag) => (
                  <span key={tag} className="bg-[#63a2ff] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <h2 className="text-[18px] font-bold text-[#1f2a44]">Tautan Cepat</h2>
              <Link
                className="mt-5 flex items-center justify-between rounded-lg border border-[#d9dce2] px-4 py-3 text-[14px] font-semibold text-[#050505] transition-colors hover:bg-[#f7f8fc]"
                to="/student/job-matching"
              >
                Website Perusahaan
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </Card>
          </div>

          <SectionHeader title="Lowongan Aktif" />
          <div className="grid gap-4 xl:grid-cols-2">
            {company.jobs.map((job) => (
              <Card key={job.title} className="p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#eef5ff] text-[#0d6efd]" aria-hidden="true">
                      {job.icon}
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-[#050505]">{job.title}</h3>
                      <p className="mt-1 text-[13px] text-[#4f5a6d]">{job.meta}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-[#e7f7f4] px-2.5 py-1 text-[11px] font-semibold text-[#0f766e]">
                    {job.match} Match
                  </span>
                </div>

                <Button className="mt-5 ml-auto block text-sm" type="button">
                  Lamar Sekarang
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-6 shadow-sm">
          <h2 className="text-[18px] font-bold text-[#1f2a44]">Ringkasan</h2>
          <div className="mt-4 grid gap-3 text-[14px] text-[#4f5a6d]">
            <div className="flex items-center gap-2">
              <Globe size={16} strokeWidth={2} />
              {company.industry}
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} strokeWidth={2} />
              {company.employees}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} strokeWidth={2} />
              {company.headquarters}
            </div>
          </div>
        </Card>
      </div>
    </StudentLayout>
  )
}

export default CompanyDetail