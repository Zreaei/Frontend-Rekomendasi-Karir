import { Link, useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { CircleAlert, Upload } from 'lucide-react'

const deniedData = {
	'cloud-architecture-foundations': {
		name: 'Cloud Architecture Foundations',
		issuer: 'AWS Certification',
		date: 'Oct 22, 2023, 02:45 PM',
		reason: 'GAMBAR_BURAM',
		fileName: 'cloud_arch_cert_v1.pdf',
		fileSize: '2.4 MB',
		note:
			'Dokumen yang diunggah buram dan ID kredensial tidak dapat diverifikasi. Silakan unggah ulang hasil pindai (scan) sertifikat asli dengan resolusi tinggi.',
		requirements: ['Resolusi pemindaian minimal 300 DPI', 'Keempat sudut sertifikat harus terlihat jelas', 'ID kredensial dan kode QR (jika ada) harus tajam dan terbaca'],
	},
} as const

const fallbackDenied = deniedData['cloud-architecture-foundations']

const StudentCertificationDenied = () => {
	const { certId = 'cloud-architecture-foundations' } = useParams()
	const certification = deniedData[certId as keyof typeof deniedData] ?? fallbackDenied

	return (
		<StudentLayout>
			<nav className="mb-2 flex items-center gap-1 text-[12px] text-[#5c6577]" aria-label="Breadcrumb">
				<Link className="transition-colors hover:text-[#0d6efd]" to="/student/certification">
					Sertifikat
				</Link>
				<span aria-hidden="true">&gt;</span>
				<span className="text-[#1f2a44]">{certification.name}</span>
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
									<p className="text-[13px]">{certification.name} — {certification.issuer}</p>
								</div>
							</div>
							<div className="rounded-md bg-white/60 px-3 py-1.5 text-[12px] font-semibold text-[#b42318]">Tanggal Ditolak: 24 Okt 2023</div>
						</div>

						<div className="grid gap-5 p-5">
							<Card className="p-0 shadow-none">
								<div className="border-b border-[#d9dce2] bg-[#eef5ff] px-4 py-3 text-[14px] font-bold text-[#1f2a44]">Catatan Verifikator</div>
								<div className="p-4">
									<div className="rounded-lg border-l-4 border-[#d92d20] bg-[#eef5ff] px-4 py-4 text-[14px] leading-relaxed text-[#2b3343] italic">
										{certification.note}
									</div>
								</div>
							</Card>

							<Card className="p-0 shadow-none">
								<div className="border-b border-[#d9dce2] bg-white px-4 py-3 text-[14px] font-bold text-[#1f2a44]">Syarat Pengajuan Ulang</div>
								<div className="p-4">
									<ul className="grid gap-2 text-[13px] text-[#4f5a6d]">
										{certification.requirements.map((item) => (
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
						<div className="text-[12px] text-[#5c6577]">{certification.fileName} ({certification.fileSize})</div>
						<div className="mt-4 h-56 rounded-lg border border-[#b9c3d3] bg-[radial-gradient(circle_at_center,#f6f6f6_0%,#dde5f0_100%)]" />
						<div className="mt-5 grid gap-3 text-[14px] text-[#4f5a6d]">
							<div className="flex items-center justify-between border-b border-[#d9dce2] pb-3">
								<span>Format Berkas</span>
								<strong className="text-[#1f2a44]">Dokumen PDF</strong>
							</div>
							<div className="flex items-center justify-between border-b border-[#d9dce2] pb-3">
								<span>Tanggal Unggah</span>
								<strong className="text-[#1f2a44]">{certification.date}</strong>
							</div>
							<div className="flex items-center justify-between">
								<span>Label Alasan</span>
								<strong className="rounded bg-[#ffe4e4] px-2 py-1 text-[11px] font-bold text-[#b42318]">{certification.reason}</strong>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</StudentLayout>
	)
}

export default StudentCertificationDenied