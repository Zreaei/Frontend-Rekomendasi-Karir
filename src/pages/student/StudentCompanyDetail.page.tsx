import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SectionHeader from '../../components/common/SectionHeader'
import { Building2, Globe, MapPin, Users, ArrowRight, Briefcase } from 'lucide-react'
import { studentCompanyApi, type CompanyPublicProfile } from '../../services/student.service'

const CompanyDetail = () => {
  const { companyId = '' } = useParams()
  const [company, setCompany] = useState<CompanyPublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!companyId) return
    let aktif = true
    studentCompanyApi
      .getPublicProfile(companyId)
      .then((data) => { if (aktif) setCompany(data) })
      .catch(() => { if (aktif) setError('Gagal memuat profil perusahaan.') })
      .finally(() => { if (aktif) setLoading(false) })
    return () => { aktif = false }
  }, [companyId])

  if (loading) {
    return (
      <StudentLayout>
        <Card className="p-6 text-[14px] text-[#5c6577] shadow-sm">Memuat profil perusahaan...</Card>
      </StudentLayout>
    )
  }

  if (error || !company) {
    return (
      <StudentLayout>
        <Card className="p-6 text-[14px] text-[#d92d20] shadow-sm">{error ?? 'Perusahaan tidak ditemukan.'}</Card>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-5">
          <Card className="p-6 shadow-sm">
            <div className="flex flex-wrap items-start gap-4">
              <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-xl bg-[#0d6efd] text-white" aria-hidden="true">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 size={30} strokeWidth={2} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-[28px] font-bold leading-tight text-[#050505]">{company.name}</h1>
                <p className="mt-1 text-[15px] text-[#4f5a6d]">{company.industry ?? '-'}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-[#4f5a6d]">
                  {company.size ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5ff] px-2.5 py-1 font-semibold text-[#0d6efd]">
                      <Users size={14} strokeWidth={2} />
                      {company.size}
                    </span>
                  ) : null}
                  {company.address ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5ff] px-2.5 py-1 font-semibold text-[#0d6efd]">
                      <MapPin size={14} strokeWidth={2} />
                      {company.address}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <Card className="p-6 shadow-sm">
              <h2 className="text-[18px] font-bold text-[#1f2a44]">Tentang Kami</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-[#4f5a6d]">
                {company.description ?? 'Perusahaan ini belum menambahkan deskripsi.'}
              </p>
            </Card>

            <Card className="p-6 shadow-sm">
              <h2 className="text-[18px] font-bold text-[#1f2a44]">Tautan Cepat</h2>
              {company.website ? (
                <a
                  className="mt-5 flex items-center justify-between rounded-lg border border-[#d9dce2] px-4 py-3 text-[14px] font-semibold text-[#050505] transition-colors hover:bg-[#f7f8fc]"
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website Perusahaan
                  <ArrowRight size={16} strokeWidth={2} />
                </a>
              ) : (
                <p className="mt-5 text-[13px] text-[#5c6577]">Website belum tersedia.</p>
              )}
            </Card>
          </div>

          <SectionHeader title="Lowongan Aktif" />
          <div className="grid gap-4 xl:grid-cols-2">
            {company.jobs.length === 0 ? (
              <Card className="p-5 text-[13px] text-[#5c6577] shadow-sm xl:col-span-2">
                Tidak ada lowongan aktif saat ini.
              </Card>
            ) : (
              company.jobs.map((job) => (
                <Card key={job.id} className="p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#eef5ff] text-[#0d6efd]" aria-hidden="true">
                        <Briefcase size={18} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-[#050505]">{job.title}</h3>
                        <p className="mt-1 text-[13px] text-[#4f5a6d]">
                          {[job.department, job.type, job.location].filter(Boolean).join(' • ') || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link to={`/student/job-matching/${job.id}`} className="mt-5 ml-auto block w-fit">
                    <Button className="text-sm" type="button">
                      Lihat Detail
                    </Button>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>

        <Card className="p-6 shadow-sm">
          <h2 className="text-[18px] font-bold text-[#1f2a44]">Ringkasan</h2>
          <div className="mt-4 grid gap-3 text-[14px] text-[#4f5a6d]">
            <div className="flex items-center gap-2">
              <Globe size={16} strokeWidth={2} />
              {company.industry ?? '-'}
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} strokeWidth={2} />
              {company.size ?? '-'}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} strokeWidth={2} />
              {company.address ?? '-'}
            </div>
          </div>
        </Card>
      </div>
    </StudentLayout>
  )
}

export default CompanyDetail
