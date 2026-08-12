import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { CircleAlert, Upload } from 'lucide-react'
import { studentCertificateApi, type MyCertificate } from '../../services/student.service'

const REQUIREMENTS = [
	'Resolusi pemindaian minimal 300 DPI',
	'Keempat sudut sertifikat harus terlihat jelas',
	'ID kredensial dan kode QR (jika ada) harus tajam dan terbaca',
]

const formatDate = (value?: string | null) => {
	if (!value) return '-'
	return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const StudentCertificationDenied = () => {
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

	return (
		<StudentLayout>
			<nav className="mb-2 flex items-center gap-1 text-[12px] text-[#5c6577]" aria-label="Breadcrumb">
				<Link className="transition-colors hover:text-[#0d6efd]" to="/student/certification">
					Sertifikat
				</Link>
				<span aria-hidden="true">&gt;</span>
				<span className="text-[#1f2a44]">{certification.title}</span>
			</nav>
			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]">
				<div className="grid gap-5">
					<Card className="overflow-hidden shadow-sm">
						<div className="flex items-center justify-between gap-3 border-b border-[#f3c8c8] bg-[#ffe4e4] px-5 py-4">
							<div className="flex items-center gap-3 text-[#b42318]">
								<div className="grid h-8 w-8 place-items-center rounded-full bg-[#cc1f1f] text-white" aria-hidden="true">
									<CircleAlert size={18} strokeWidth={2} />
								</div>
								<div>
									<h1 className="text-[18px] font-bold">Sertifikat Ditolak</h1>
									<p className="text-[13px]">{certification.title} — {certification.issuer ?? '-'}</p>
								</div>
							</div>
							<div className="rounded-md bg-white/60 px-3 py-1.5 text-[12px] font-semibold text-[#b42318]">
								Tanggal Ditolak: {formatDate(certification.reviewedAt)}
							</div>
						</div>

						<div className="grid gap-5 p-5">
							<Card className="p-0 shadow-none">
								<div className="border-b border-[#d9dce2] bg-[#eef5ff] px-4 py-3 text-[14px] font-bold text-[#1f2a44]">Catatan Verifikator</div>
								<div className="p-4">
									<div className="rounded-lg border-l-4 border-[#d92d20] bg-[#eef5ff] px-4 py-4 text-[14px] leading-relaxed text-[#2b3343] italic">
										{certification.note ?? 'Tidak ada catatan dari verifikator.'}
									</div>
								</div>
							</Card>

							<Card className="p-0 shadow-none">
								<div className="border-b border-[#d9dce2] bg-white px-4 py-3 text-[14px] font-bold text-[#1f2a44]">Syarat Pengajuan Ulang</div>
								<div className="p-4">
									<ul className="grid gap-2 text-[13px] text-[#4f5a6d]">
										{REQUIREMENTS.map((item) => (
											<li key={item} className="flex items-start gap-2">
												<span className="mt-1 h-2 w-2 rounded-full bg-[#0f766e]" aria-hidden="true" />
												<span>{item}</span>
											</li>
										))}
									</ul>
								</div>
							</Card>

							<Link to="/student/certification/upload" className="inline-flex">
								<Button className="inline-flex w-full items-center justify-center gap-2" type="button">
									<Upload size={16} strokeWidth={2} aria-hidden="true" />
									Unggah Ulang Dokumen
								</Button>
							</Link>
						</div>
					</Card>
				</div>

				<Card className="overflow-hidden p-0 shadow-sm">
					<div className="border-b border-[#d9dce2] bg-[#eef5ff] px-5 py-4 text-[14px] font-bold text-[#1f2a44]">Pratinjau Berkas yang Ditolak</div>
					<div className="p-5">
						{certification.fileUrl ? (
							<iframe
								src={certification.fileUrl}
								title={certification.title}
								className="mt-1 h-56 w-full rounded-lg border border-[#b9c3d3]"
							/>
						) : (
							<div className="mt-1 grid h-56 place-items-center rounded-lg border border-[#b9c3d3] bg-[radial-gradient(circle_at_center,#f6f6f6_0%,#dde5f0_100%)] text-[13px] text-[#8b93a5]">
								Berkas tidak tersedia.
							</div>
						)}
						<div className="mt-5 grid gap-3 text-[14px] text-[#4f5a6d]">
							<div className="flex items-center justify-between border-b border-[#d9dce2] pb-3">
								<span>Format Berkas</span>
								<strong className="text-[#1f2a44]">{certification.fileType ?? '-'}</strong>
							</div>
							<div className="flex items-center justify-between border-b border-[#d9dce2] pb-3">
								<span>Tanggal Unggah</span>
								<strong className="text-[#1f2a44]">{formatDate(certification.created_at)}</strong>
							</div>
							<div className="flex items-center justify-between">
								<span>Status</span>
								<strong className="rounded bg-[#ffe4e4] px-2 py-1 text-[11px] font-bold text-[#b42318]">DITOLAK</strong>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</StudentLayout>
	)
}

export default StudentCertificationDenied
