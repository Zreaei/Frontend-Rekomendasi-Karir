import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { ArrowLeft, CheckCircle2, FileText, UploadCloud } from 'lucide-react'
import { studentCertificateApi } from '../../services/student.service'

const MAX_SIZE = 5 * 1024 * 1024

const StudentCertificationUpload = () => {
	const navigate = useNavigate()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [title, setTitle] = useState('')
	const [issuer, setIssuer] = useState('')
	const [file, setFile] = useState<File | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const pickFile = (picked: File | null) => {
		if (!picked) return
		if (picked.size > MAX_SIZE) {
			setError('Ukuran file melebihi 5MB.')
			return
		}
		setError(null)
		setFile(picked)
	}

	const submit = async () => {
		if (!title.trim()) {
			setError('Nama sertifikat wajib diisi.')
			return
		}
		setSubmitting(true)
		setError(null)
		try {
			await studentCertificateApi.upload({
				title: title.trim(),
				issuer: issuer.trim() || undefined,
				file: file ?? undefined,
			})
			navigate('/student/certification')
		} catch (err: any) {
			setError(err?.response?.data?.message ?? 'Gagal mengunggah sertifikat.')
		} finally {
			setSubmitting(false)
		}
	}

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
						<div
							className="grid min-h-[180px] place-items-center rounded-lg bg-[#f8fbff] text-center"
							onDragOver={(e) => e.preventDefault()}
							onDrop={(e) => {
								e.preventDefault()
								pickFile(e.dataTransfer.files?.[0] ?? null)
							}}
						>
							<div>
								<div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e7f0ff] text-[#0d6efd]" aria-hidden="true">
									{file ? <FileText size={28} strokeWidth={2} /> : <UploadCloud size={28} strokeWidth={2} />}
								</div>
								<p className="mt-5 text-[18px] font-semibold text-[#1f2a44]">
									{file ? file.name : 'Tarik & lepas sertifikat Anda di sini'}
								</p>
								<p className="mt-2 text-[13px] text-[#5c6577]">Format yang didukung: PDF, JPG, PNG (Maks. 5MB)</p>
								<input
									ref={fileInputRef}
									type="file"
									accept=".pdf,.jpg,.jpeg,.png"
									className="hidden"
									onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
								/>
								<Button className="mt-5" type="button" onClick={() => fileInputRef.current?.click()}>
									{file ? 'Ganti File' : 'Pilih File'}
								</Button>
							</div>
						</div>
					</Card>

					<Card className="p-0 shadow-sm">
						<div className="border-b border-[#d9dce2] bg-[#eef5ff] px-5 py-4 text-[14px] font-bold text-[#1f2a44]">Informasi Sertifikat</div>
						<div className="grid gap-4 p-5 md:grid-cols-2">
							<div>
								<label className="text-[12px] font-medium text-[#5c6577]" htmlFor="cert-title">Nama Sertifikat</label>
								<input
									id="cert-title"
									className="mt-2 h-10 w-full rounded-md border border-[#d9dce2] bg-white px-3 py-2 text-[13px] text-[#1f2a44] outline-none focus:border-[#0d6efd]"
									placeholder="contoh: Python Tingkat Lanjut..."
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
							<div>
								<label className="text-[12px] font-medium text-[#5c6577]" htmlFor="cert-issuer">Organisasi/Lembaga Penerbit</label>
								<input
									id="cert-issuer"
									className="mt-2 h-10 w-full rounded-md border border-[#d9dce2] bg-white px-3 py-2 text-[13px] text-[#1f2a44] outline-none focus:border-[#0d6efd]"
									placeholder="contoh: Coursera / Google"
									value={issuer}
									onChange={(e) => setIssuer(e.target.value)}
								/>
							</div>
						</div>
					</Card>
				</div>

				<Card className="p-0 shadow-sm">
					<div className="border-b border-[#d9dce2] bg-[#eef5ff] px-5 py-4 text-[14px] font-bold text-[#1f2a44]">Pratinjau Sertifikat</div>
					<div className="p-5">
						<div className="grid h-64 place-items-center rounded-lg border border-[#d9dce2] bg-[linear-gradient(180deg,#f2f7ff_0%,#ffffff_100%)] px-4 text-center">
							{file ? (
								<div>
									<FileText className="mx-auto text-[#0d6efd]" size={32} strokeWidth={2} aria-hidden="true" />
									<p className="mt-3 break-all text-[13px] font-semibold text-[#1f2a44]">{file.name}</p>
									<p className="mt-1 text-[12px] text-[#5c6577]">{(file.size / 1024).toFixed(0)} KB</p>
								</div>
							) : (
								<p className="text-[13px] text-[#8b93a5]">Belum ada file dipilih.</p>
							)}
						</div>
						<div className="mt-5 flex items-center justify-between gap-3 rounded-lg bg-[#eef5ff] p-4">
							<div>
								<p className="text-[13px] font-semibold text-[#1f2a44]">Status</p>
								<p className="mt-1 text-[12px] text-[#5c6577]">DRAFT</p>
							</div>
							<CheckCircle2 className="text-[#0d6efd]" size={18} strokeWidth={2} aria-hidden="true" />
						</div>

						{error ? <p className="mt-4 text-[13px] font-semibold text-[#d92d20]">{error}</p> : null}

						<Button
							className="mt-5 w-full inline-flex items-center justify-center gap-2"
							type="button"
							disabled={submitting}
							onClick={submit}
						>
							<CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
							{submitting ? 'Mengunggah...' : 'Ajukan untuk Verifikasi'}
						</Button>
						<Link to="/student/certification" className="block">
							<Button variant="ghost" className="mt-3 w-full" type="button">Batal</Button>
						</Link>
					</div>
				</Card>
			</div>
		</StudentLayout>
	)
}

export default StudentCertificationUpload
