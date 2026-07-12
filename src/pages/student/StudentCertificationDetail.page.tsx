import { Link, useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatusPill from '../../components/common/StatusPill'
import Tag from '../../components/common/Tag'
import { FileCheck2 } from 'lucide-react'

const certificationData = {
	'advanced-machine-learning': {
		name: 'Advanced Machine Learning',
		issuer: 'Stanford Online',
		date: 'Oct 14, 2023',
		credentialId: 'STAN-ML-99210-XC',
		status: 'Terverifikasi' as const,
		tone: 'success' as const,
		fileName: 'advanced_ml_certificate.pdf',
		fileSize: '2.4 MB',
		labels: ['Neural Networks', 'Deep Learning', 'TensorFlow', 'Python Optimization'],
		previewClass: 'bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]',
	},
	'data-visualization-specialist': {
		name: 'Data Visualization Specialist',
		issuer: 'IBM Professional Data',
		date: 'Sept 24, 2023',
		credentialId: 'IBM-DV-44102-AB',
		status: 'Diproses' as const,
		tone: 'warning' as const,
		fileName: 'data_viz_certificate.pdf',
		fileSize: '1.8 MB',
		labels: ['Tableau', 'Data Storytelling', 'Dashboard Design'],
		previewClass: 'bg-[linear-gradient(180deg,#e4f4ff_0%,#1167a8_100%)]',
	},
} as const

const fallbackCertification = certificationData['advanced-machine-learning']

const StudentCertificationDetail = () => {
	const { certId = 'advanced-machine-learning' } = useParams()
	const certification = certificationData[certId as keyof typeof certificationData] ?? fallbackCertification

	return (
		<StudentLayout>
			<nav className="mb-2 flex items-center gap-1 text-[12px] text-[#5c6577]" aria-label="Breadcrumb">
				<Link className="transition-colors hover:text-[#0d6efd]" to="/student/certification">
					Sertifikat
				</Link>
				<span aria-hidden="true">&gt;</span>
				<span className="text-[#1f2a44]">{certification.name}</span>
			</nav>
			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
				<Card className="p-0 shadow-sm">
					<div className="h-105 border border-[#d9dce2] bg-white p-4">
						<div className={`flex h-full items-center justify-center rounded-lg border border-[#dbe5f8] ${certification.previewClass}`}>
							<div className="h-[88%] w-[88%] rounded-md border border-[#e6edf7] bg-white shadow-sm" />
						</div>
					</div>
				</Card>

				<div className="grid gap-5">
					<Card className="p-6 shadow-sm">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h1 className="text-[24px] font-bold leading-tight text-[#050505]">
                  Status Verifikasi
                </h1>
								<p className="mt-1 text-[14px] text-[#4f5a6d]">
                  {certification.name} • {certification.issuer}
                </p>
							</div>
							<StatusPill label={certification.status} tone={certification.tone} />
						</div>

						<div className="mt-5 grid gap-4 text-[14px] text-[#4f5a6d]">
							<div className="flex items-center justify-between border-b border-[#d9dce2] pb-3">
								<span>Lembaga Penerbit</span>
								<strong className="text-[#1f2a44]">{certification.issuer}</strong>
							</div>
							<div className="flex items-center justify-between border-b border-[#d9dce2] pb-3">
								<span>Tanggal Terbit</span>
								<strong className="text-[#1f2a44]">{certification.date}</strong>
							</div>
							<div className="flex items-center justify-between">
								<span>ID Kredensial</span>
								<strong className="text-[#1f2a44]">{certification.credentialId}</strong>
							</div>
						</div>
					</Card>

					<Card className="p-6 shadow-sm">
						<h2 className="text-[18px] font-bold text-black">Keahlian yang Terverifikasi</h2>
						<div className="mt-4 flex flex-wrap gap-2.5">
							{certification.labels.map((label) => (
								<span key={label} className="bg-[#63a2ff] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
									{label}
								</span>
							))}
						</div>
					</Card>
				</div>
			</div>
			<div className="flex gap-3">
				{certification.status === 'Terverifikasi' ? (
					<Button className="inline-flex items-center gap-2 text-sm" type="button">
						<FileCheck2 size={16} strokeWidth={2} aria-hidden="true" />
						Unduh Dokumen
					</Button>
				) : (
					<Link to="/student/certification/upload" className="inline-flex">
						<Button className="inline-flex items-center gap-2" type="button">
							<FileCheck2 size={16} strokeWidth={2} aria-hidden="true" />
							Lihat Dokumen
						</Button>
					</Link>
				)}
			</div>
		</StudentLayout>
	)
}

export default StudentCertificationDetail