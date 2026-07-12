import { Link } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Tag from '../../components/common/Tag'
import { ArrowLeft, CheckCircle2, UploadCloud } from 'lucide-react'

const skills = ['Python', 'Data Analysis', 'Machine Learning']

const StudentCertificationUpload = () => {
	return (
		<StudentLayout>
			<div className="flex items-start gap-3">
				<Link to="/student/certification" className="mt-1 grid h-8 w-8 place-items-center rounded-full border border-[#d9dce2] bg-white text-[#232342]">
					<ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
				</Link>
				<div>
					<h1 className="text-[30px] font-bold leading-tight text-[#050505]">Unggah Sertifikat Baru</h1>
					<p className="mt-1 text-[14px] text-[#5c6577]">Tambahkan pencapaian atau sertifikasi baru ke profil Anda.</p>
				</div>
			</div>

			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
				<div className="grid gap-5">
					<Card className="border border-dashed border-[#cfd7e6] bg-white p-6 shadow-sm">
						<div className="grid min-h-[180px] place-items-center rounded-lg bg-[#f8fbff] text-center">
							<div>
								<div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e7f0ff] text-[#0d6efd]" aria-hidden="true">
									<UploadCloud size={28} strokeWidth={2} />
								</div>
								<p className="mt-5 text-[18px] font-semibold text-[#1f2a44]">Tarik & lepas sertifikat Anda di sini</p>
								<p className="mt-2 text-[13px] text-[#5c6577]">Format yang didukung: PDF, JPG, PNG (Maks. 5MB)</p>
								<Button className="mt-5" type="button">Pilih File</Button>
							</div>
						</div>
					</Card>

					<Card className="p-0 shadow-sm">
						<div className="border-b border-[#d9dce2] bg-[#eef5ff] px-5 py-4 text-[14px] font-bold text-[#1f2a44]">Informasi Sertifikat</div>
						<div className="grid gap-4 p-5 md:grid-cols-2">
							<div>
								<p className="text-[12px] font-medium text-[#5c6577]">Nama Sertifikat</p>
								<div className="mt-2 h-10 rounded-md border border-[#d9dce2] bg-white px-3 py-2 text-[13px] text-[#8b93a5]">contoh: Python Tingkat Lanjut...</div>
							</div>
							<div>
								<p className="text-[12px] font-medium text-[#5c6577]">Organisasi/Lembaga Penerbit</p>
								<div className="mt-2 h-10 rounded-md border border-[#d9dce2] bg-white px-3 py-2 text-[13px] text-[#8b93a5]">contoh: Coursera / Google</div>
							</div>
							<div>
								<p className="text-[12px] font-medium text-[#5c6577]">Tanggal Terbit</p>
								<div className="mt-2 h-10 rounded-md border border-[#d9dce2] bg-white px-3 py-2 text-[13px] text-[#8b93a5]">hh/bb/tttt</div>
							</div>
							<div>
								<p className="text-[12px] font-medium text-[#5c6577]">ID Kredensial / Tautan Sertifikat</p>
								<div className="mt-2 h-10 rounded-md border border-[#d9dce2] bg-white px-3 py-2 text-[13px] text-[#8b93a5]">https://...</div>
							</div>
						</div>
					</Card>

					<Card className="p-0 shadow-sm">
						<div className="border-b border-[#d9dce2] bg-[#eef5ff] px-5 py-4 text-[14px] font-bold text-[#1f2a44]">Keahlian Terkait</div>
						<div className="p-5">
							<p className="text-[13px] text-[#5c6577]">Pilih atau tandai kompetensi utama yang divalidasi oleh sertifikat ini.</p>
							<div className="mt-4 flex flex-wrap gap-2.5">
								{skills.map((skill) => (
									<span key={skill} className="inline-flex h-6 items-center rounded-full border border-[#0d6efd] px-2.5 text-[12px] font-semibold text-[#0d6efd]">
										{skill} ×
									</span>
								))}
								<button className="inline-flex h-6 items-center rounded-full border border-[#0d6efd] px-2.5 text-[12px] font-semibold text-[#0d6efd]" type="button">
									+ Add Skill
								</button>
							</div>
						</div>
					</Card>
				</div>

				<Card className="p-0 shadow-sm">
					<div className="border-b border-[#d9dce2] bg-[#eef5ff] px-5 py-4 text-[14px] font-bold text-[#1f2a44]">Pratinjau Sertifikat</div>
					<div className="p-5">
						<div className="h-64 rounded-lg border border-[#d9dce2] bg-[linear-gradient(180deg,#f2f7ff_0%,#ffffff_100%)]" />
						<div className="mt-5 flex items-center justify-between gap-3 rounded-lg bg-[#eef5ff] p-4">
							<div>
								<p className="text-[13px] font-semibold text-[#1f2a44]">Status</p>
								<p className="mt-1 text-[12px] text-[#5c6577]">DRAFT</p>
							</div>
							<CheckCircle2 className="text-[#0d6efd]" size={18} strokeWidth={2} aria-hidden="true" />
						</div>
						<Button className="mt-5 w-full inline-flex items-center justify-center gap-2" type="button">
							<CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
							Ajukan untuk Verifikasi
						</Button>
						<Button variant="ghost" className="mt-3 w-full" type="button">Batal</Button>
					</div>
				</Card>
			</div>
		</StudentLayout>
	)
}

export default StudentCertificationUpload