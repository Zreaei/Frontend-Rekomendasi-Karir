import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatusPill from '../../components/common/StatusPill'
import { FileCheck2 } from 'lucide-react'
import { studentCertificateApi, type MyCertificate } from '../../services/student.service'

const STATUS_VIEW: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
	approved: { label: 'Terverifikasi', tone: 'success' },
	pending: { label: 'Diproses', tone: 'warning' },
	rejected: { label: 'Ditolak', tone: 'danger' },
}

const formatDate = (value?: string | null) => {
	if (!value) return '-'
	return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const StudentCertificationDetail = () => {
	const { certId = '' } = useParams()
	const [certification, setCertification] = useState<MyCertificate | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let aktif = true
		studentCertificateApi
			.listMine()
			.then((data) => {
				if (aktif) setCertification(data.find((c) => c.id === certId) ?? null)
			})
			.catch(() => { if (aktif) setCertification(null) })
			.finally(() => { if (aktif) setLoading(false) })
		return () => { aktif = false }
	}, [certId])

	if (loading) {
		return (
			<StudentLayout>
				<Card className="p-6 text-[14px] text-[#5c6577] shadow-sm">Memuat detail sertifikat...</Card>
			</StudentLayout>
		)
	}

	if (!certification) {
		return (
			<StudentLayout>
				<Card className="p-6 text-[14px] text-[#d92d20] shadow-sm">
					Sertifikat tidak ditemukan.{' '}
					<Link className="font-semibold text-[#0d6efd]" to="/student/certification">Kembali ke daftar</Link>
				</Card>
			</StudentLayout>
		)
	}

	const view = STATUS_VIEW[certification.status] ?? { label: certification.status, tone: 'warning' as const }
	const skills = (certification.skills ?? []).map((s) => s.skill.name)
	const isImage = certification.fileType?.startsWith('image') || /\.(png|jpe?g)$/i.test(certification.fileUrl ?? '')

	return (
		<StudentLayout>
			<nav className="mb-2 flex items-center gap-1 text-[12px] text-[#5c6577]" aria-label="Breadcrumb">
				<Link className="transition-colors hover:text-[#0d6efd]" to="/student/certification">
					Sertifikat
				</Link>
				<span aria-hidden="true">&gt;</span>
				<span className="text-[#1f2a44]">{certification.title}</span>
			</nav>
			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
				<Card className="p-0 shadow-sm">
					<div className="h-105 border border-[#d9dce2] bg-white p-4">
						{certification.fileUrl ? (
							isImage ? (
								<img
									src={certification.fileUrl}
									alt={certification.title}
									className="h-full w-full rounded-lg border border-[#dbe5f8] object-contain"
								/>
							) : (
								<iframe
									src={certification.fileUrl}
									title={certification.title}
									className="h-full w-full rounded-lg border border-[#dbe5f8]"
								/>
							)
						) : (
							<div className="flex h-full items-center justify-center rounded-lg border border-[#dbe5f8] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] text-[13px] text-[#8b93a5]">
								Dokumen tidak tersedia.
							</div>
						)}
					</div>
				</Card>

				<div className="grid gap-5">
					<Card className="p-6 shadow-sm">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h1 className="text-[24px] font-bold leading-tight text-[#050505]">Status Verifikasi</h1>
								<p className="mt-1 text-[14px] text-[#4f5a6d]">
									{certification.title} • {certification.issuer ?? '-'}
								</p>
							</div>
							<StatusPill label={view.label} tone={view.tone} />
						</div>

						<div className="mt-5 grid gap-4 text-[14px] text-[#4f5a6d]">
							<div className="flex items-center justify-between border-b border-[#d9dce2] pb-3">
								<span>Lembaga Penerbit</span>
								<strong className="text-[#1f2a44]">{certification.issuer ?? '-'}</strong>
							</div>
							<div className="flex items-center justify-between border-b border-[#d9dce2] pb-3">
								<span>Tanggal Unggah</span>
								<strong className="text-[#1f2a44]">{formatDate(certification.created_at)}</strong>
							</div>
							<div className="flex items-center justify-between">
								<span>Tanggal Ditinjau</span>
								<strong className="text-[#1f2a44]">{formatDate(certification.reviewedAt)}</strong>
							</div>
						</div>
					</Card>

					<Card className="p-6 shadow-sm">
						<h2 className="text-[18px] font-bold text-black">Keahlian yang Terverifikasi</h2>
						<div className="mt-4 flex flex-wrap gap-2.5">
							{skills.length === 0 ? (
								<p className="text-[13px] text-[#5c6577]">
									{certification.status === 'approved'
										? 'Belum ada keahlian yang ditautkan ke sertifikat ini.'
										: 'Keahlian akan ditautkan setelah sertifikat diverifikasi kampus.'}
								</p>
							) : (
								skills.map((label) => (
									<span key={label} className="bg-[#63a2ff] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
										{label}
									</span>
								))
							)}
						</div>
					</Card>
				</div>
			</div>
			<div className="flex gap-3">
				{certification.fileUrl ? (
					<a href={certification.fileUrl} target="_blank" rel="noreferrer" className="inline-flex">
						<Button className="inline-flex items-center gap-2 text-sm" type="button">
							<FileCheck2 size={16} strokeWidth={2} aria-hidden="true" />
							Unduh Dokumen
						</Button>
					</a>
				) : null}
			</div>
		</StudentLayout>
	)
}

export default StudentCertificationDetail
