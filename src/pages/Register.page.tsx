import { type FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface RegistrationData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  companyName: string
  industry: string
  customIndustry: string
  companySize: string
  website: string
  address: string
  description: string
  nib: string
  izinUsahaFile: File | null
  suratResmiFile: File | null
  finalConsent: boolean
}

const initialData: RegistrationData = {
  fullName: '', email: '', password: '', confirmPassword: '',
  companyName: '', industry: '', customIndustry: '', companySize: '', website: '',
  address: '', description: '', nib: '',
  izinUsahaFile: null, suratResmiFile: null,
  finalConsent: false,
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<RegistrationData>(initialData)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [error])

  const updateField = (field: keyof RegistrationData, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const prevStep = () => { setError(''); setStep((p) => p - 1) }

  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.fullName.trim()) return setError('Nama lengkap wajib diisi.')
    if (!formData.email.trim()) return setError('Email wajib diisi.')
    if (formData.password.length < 8) return setError('Kata sandi minimal 8 karakter.')
    if (formData.password !== formData.confirmPassword) return setError('Konfirmasi kata sandi tidak cocok.')
    setError('')
    setStep(2)
  }

  const handleStep2Submit = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.companyName.trim()) return setError('Nama perusahaan wajib diisi.')
    if (!formData.industry) return setError('Pilih kategori industri.')
    if (formData.industry === 'Lainnya' && !formData.customIndustry.trim()) return setError('Harap ketik kategori industri Anda.')
    if (!formData.companySize) return setError('Pilih ukuran perusahaan.')
    if (!formData.website.trim()) return setError('Website URL wajib diisi.')
    if (!formData.address.trim()) return setError('Alamat kantor wajib diisi.')
    if (!formData.description.trim()) return setError('Deskripsi perusahaan wajib diisi.')
    setError('')
    setStep(3)
  }

  const handleStep3Submit = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.nib.trim()) return setError('Nomor NIB wajib diisi.')
    if (!/^\d+$/.test(formData.nib)) return setError('NIB hanya boleh berisi angka. Huruf tidak valid.')
    if (formData.nib.length !== 13) return setError(`NIB harus terdiri dari tepat 13 digit angka. Saat ini baru ${formData.nib.length} digit.`)
    if (!formData.izinUsahaFile) return setError('Izin Usaha wajib diunggah.')
    // Checkboxes untuk syarat & privasi sudah dihapus, jadi tidak perlu validasi
    setError('')
    setStep(4)
  }

  const handleFinalSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.finalConsent) {
      setError('Anda harus menyetujui pernyataan keakuratan data sebelum mengirimkan.')
      return
    }
    setError('')
    setIsSubmitting(true)
    setTimeout(() => navigate('/company', { replace: true }), 1500)
  }

  const finalIndustryDisplay = formData.industry === 'Lainnya' ? formData.customIndustry : formData.industry

  return (
    <main className="min-h-screen bg-[#f2f6fb] py-10 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-[700px] mb-6">
        <Stepper currentStep={step} />
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="w-full max-w-[960px] grid md:grid-cols-[280px_1fr] gap-5 items-stretch">
          <div className="flex flex-col gap-5">
            {/* Card 1 */}
            <div className="bg-white rounded-[24px] border border-[#e4e9f4] shadow-sm p-6">
              <span className="inline-flex w-fit rounded-full bg-[#eef4ff] px-3 py-1.5 text-[16px] font-semibold text-[#0f5ce0]">
                Gabung Bersama Kami
              </span>
              <p className="mt-4 text-[12px] leading-relaxed text-[#5b6170]">
                Terhubunglah dengan lulusan unggulan dan profesional berpengalaman. Proses verifikasi kami
                menjamin lingkungan rekrutmen yang aman dan berkualitas tinggi.
              </p>
              <div className="mt-5 space-y-4">
                <SidebarFeature
                  icon={
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                  title="Platform Terverifikasi"
                  desc="Penanganan dokumen perusahaan dan data bisnis Anda secara aman."
                />
                <SidebarFeature
                  icon={
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  title="Wawasan Talenta"
                  desc="Akses profil mahasiswa dan data kinerja akademik yang terperinci."
                />
              </div>
            </div>

            {/* Card 2 - Komitmen Privasi (dikembalikan) */}
            <div className="bg-white rounded-[22px] border border-[#e4e9f4] shadow-sm p-6">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#0f5ce0] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="text-[15px] font-bold text-[#111827] mb-1">Komitmen Privasi</p>
                  <p className="text-[13px] text-[#5b6170] leading-relaxed">
                    Simaster mematuhi standar perlindungan data internasional. Dokumen Anda hanya digunakan untuk tujuan verifikasi oleh tim Superadmin kami.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-[#e4e9f4] shadow-sm p-7 md:p-8 relative flex flex-col">
            <form onSubmit={handleStep1Submit} className="flex flex-col flex-1">
              <h2 className="text-[24px] font-bold text-[#111827] leading-tight">Buat akun Anda</h2>
              <p className="mt-1.5 text-[13px] text-[#5b6170]">Mulailah perjalanan Anda sebagai mitra perusahaan di Simaster.</p>

              {error && <div className="mt-4"><ErrorBox ref={errorRef} message={error} /></div>}

              <div className="mt-6 space-y-4">
                <FormField id="fullName" label="Nama Lengkap" placeholder="Sigit Kurnia Hartawan" value={formData.fullName} onChange={(v: string) => updateField('fullName', v)} required />
                <FormField id="email" label="Email Kantor" placeholder="Nama Perusahaan Anda @gmail.com" type="email" value={formData.email} onChange={(v: string) => updateField('email', v)} required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField id="password" label="Kata sandi" placeholder="Minimal 8 karakter" type="password" value={formData.password} onChange={(v: string) => updateField('password', v)} required />
                  <FormField id="confirmPassword" label="Konfirmasi Kata Sandi" placeholder="Ulangi kata sandi Anda" type="password" value={formData.confirmPassword} onChange={(v: string) => updateField('confirmPassword', v)} required />
                </div>
              </div>

              <div className="mt-auto pt-6 flex justify-end">
                <button type="submit" className="px-6 py-2.5 rounded-[10px] bg-[#0f5ce0] text-[14px] font-semibold text-white hover:bg-[#0c48b0] transition shadow-md shadow-blue-200 flex items-center gap-2">
                  Rincian Perusahaan
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="w-full max-w-[860px] bg-white rounded-[24px] shadow-sm border border-[#e4e9f4] p-8 md:p-10 relative">
          <form onSubmit={handleStep2Submit}>
            <Step2Header
              title="Rincian Perusahaan"
              subtitle="Ceritakan lebih lanjut mengenai perusahaan Anda agar kami dapat menyesuaikan pengalaman perekrut."
              step="Langkah 2 dari 4"
            />
            {error && <ErrorBox ref={errorRef} message={error} />}
            <div className="space-y-5 mt-8">
              <FormField id="companyName" label="Nama Perusahaan" placeholder="Masukkan nama perusahaan Anda yang terdaftar" value={formData.companyName} onChange={(v: string) => updateField('companyName', v)} required />

              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  id="industry"
                  label="Kategori Industri"
                  options={['Teknologi Informasi', 'Keuangan', 'Manufaktur', 'Pendidikan', 'Kesehatan', 'Retail', 'Lainnya']}
                  value={formData.industry}
                  onChange={(v: string) => updateField('industry', v)}
                  required
                />
                <SelectField
                  id="size"
                  label="Ukuran Perusahaan"
                  options={['1–50 Karyawan', '51–200 Karyawan', '201–500 Karyawan', '500+ Karyawan']}
                  value={formData.companySize}
                  onChange={(v: string) => updateField('companySize', v)}
                  required
                />
              </div>

              {formData.industry === 'Lainnya' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <FormField
                    id="customIndustry"
                    label="Ketik Kategori Industri Anda"
                    placeholder="Contoh: Agrikultur, Energi Berkelanjutan..."
                    value={formData.customIndustry}
                    onChange={(v: string) => updateField('customIndustry', v)}
                    required
                  />
                </div>
              )}

              <FormField id="website" label="Website URL" placeholder="https://www.contoh.com" value={formData.website} onChange={(v: string) => updateField('website', v)} required />
              <FormField id="address" label="Alamat Kantor Pusat" placeholder="Jalan, Kota, Negara Bagian, Negara" value={formData.address} onChange={(v: string) => updateField('address', v)} required />

              <label className="grid gap-1.5 text-[14px] font-semibold text-[#111827]">
                <div className="flex justify-between">
                  <span>Deskripsi Perusahaan / Profil<span className="text-red-500 ml-0.5">*</span></span>
                  <span className="font-normal text-[#7b8191]">{formData.description.length} / 500</span>
                </div>
                <textarea
                  className="w-full rounded-[10px] border border-[#d7dde9] bg-[#fafbff] p-4 text-[14px] font-normal text-[#1f2937] outline-none focus:border-[#0f5ce0] focus:ring-2 focus:ring-[#0f5ce0]/15 min-h-[110px] resize-none transition"
                  placeholder="Jelaskan secara singkat misi dan nilai-nilai inti perusahaan Anda..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  maxLength={500}
                />
              </label>
            </div>
            <div className="mt-10 pt-6 border-t border-[#f1f4f9] flex justify-between items-center gap-4">
              <BackButton onClick={prevStep} label="Kembali ke Akun" />
              <button type="submit" className="bg-[#0f5ce0] text-white px-7 py-2.5 rounded-[10px] text-[14px] font-semibold hover:bg-[#0c48b0] transition shadow-md shadow-blue-200">
                Unggah Dokumen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="w-full max-w-[860px] bg-white rounded-[24px] shadow-sm border border-[#e4e9f4] p-8 md:p-10 relative">
          <form onSubmit={handleStep3Submit}>
            <SectionHeader
              title="Verifikasi & Dokumen"
              subtitle="Harap lampirkan dokumen hukum resmi Anda untuk menyelesaikan pendaftaran organisasi Anda di Simaster."
              step="Langkah 3 dari 4"
              center
            />
            {error && <ErrorBox ref={errorRef} message={error} />}
            <div className="grid gap-8 md:grid-cols-2 mt-8">
              <div className="space-y-5">
                <NibField
                  value={formData.nib}
                  onChange={(v: string) => updateField('nib', v)}
                  onError={(msg: string) => setError(msg)}
                />
                <p className="text-[12px] text-[#7b8191] -mt-3">NIB harus terdiri dari tepat 13 digit angka.</p>

                <div className="bg-[#f5f8ff] rounded-[14px] p-4 flex gap-3 border border-[#e5ecff]">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-[#0f5ce0] text-white flex items-center justify-center text-xs font-bold shrink-0">i</div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#111827]">Superadmin Review</h4>
                    <p className="text-[12px] text-[#5b6170] mt-1 leading-relaxed">Permohonan Anda akan ditinjau oleh Superadmin. Proses ini biasanya memakan waktu 1–2 hari kerja.</p>
                  </div>
                </div>

                {/* Checkboxes untuk Syarat & Ketentuan dan Kebijakan Privasi telah dihapus */}
              </div>

              <div className="space-y-5">
                <FileUploadField
                  label="Izin Usaha (PDF NIB)"
                  hint="Hanya format PDF (Maks. 10 MB)"
                  accept=".pdf"
                  required
                  file={formData.izinUsahaFile}
                  onChange={(f) => updateField('izinUsahaFile', f)}
                  icon={<svg className="w-8 h-8 text-[#a3b1c6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>}
                />
                <FileUploadField
                  label="Surat Resmi Perusahaan (opsional)"
                  hint="JPG, PNG, atau PDF (Maks. 5 MB)"
                  accept=".jpg,.jpeg,.png,.pdf"
                  file={formData.suratResmiFile}
                  onChange={(f) => updateField('suratResmiFile', f)}
                  icon={<svg className="w-8 h-8 text-[#a3b1c6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                />
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-[#f1f4f9] flex justify-between items-center gap-4">
              <BackButton onClick={prevStep} label="Kembali ke Detail" />
              <button type="submit" className="bg-[#0f5ce0] text-white px-7 py-2.5 rounded-[10px] text-[14px] font-semibold hover:bg-[#0c48b0] transition shadow-md shadow-blue-200">
                Kirim untuk Verifikasi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="w-full max-w-[860px] bg-white rounded-[24px] shadow-sm border border-[#e4e9f4] p-8 md:p-10 relative">
          <form onSubmit={handleFinalSubmit}>
            <SectionHeader
              title="Tinjauan Akhir"
              subtitle="Harap verifikasi semua informasi sebelum mengirimkan pendaftaran Anda."
              step="Langkah 4 dari 4"
            />
            {error && <ErrorBox ref={errorRef} message={error} />}

            <div className="bg-[#f5f8ff] rounded-[14px] p-4 flex gap-3 mb-6 border border-[#e5ecff] mt-6">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-[#0f5ce0] text-white flex items-center justify-center text-xs font-bold shrink-0">
                <img src="/src/assets/register/icon-schedule.svg" alt="" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerText = 'i' }} />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#111827]">Jadwal Pengajuan</h4>
                <p className="text-[12px] text-[#5b6170] mt-1 leading-relaxed">Setelah dikirimkan, tim Superadmin kami akan meninjau permohonan Anda dalam 1–2 hari kerja. Anda akan menerima notifikasi melalui email setelah akun diverifikasi.</p>
              </div>
            </div>

            <div className="space-y-4">
              <SummaryCard
                title="Informasi Akun"
                iconSrc="/src/assets/register/akun.png"
                onEdit={() => setStep(1)}
              >
                <div className="grid grid-cols-2 gap-4">
                  <SummaryItem label="Nama Lengkap" value={formData.fullName} />
                  <div>
                    <span className="block text-[11px] text-[#7b8191] mb-0.5">Email Kantor</span>
                    <a href={`mailto:${formData.email}`} className="text-[13px] font-medium text-[#0f5ce0] hover:underline">
                      {formData.email}
                    </a>
                  </div>
                </div>
              </SummaryCard>

              <SummaryCard
                title="Detail Perusahaan"
                iconSrc="/src/assets/register/perusahaan.png"
                onEdit={() => setStep(2)}
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <SummaryItem label="Nama Perusahaan" value={formData.companyName} />
                  <SummaryItem label="Industri" value={finalIndustryDisplay} />
                  <SummaryItem label="Ukuran Perusahaan" value={formData.companySize} />
                  <div>
                    <span className="block text-[11px] text-[#7b8191] mb-0.5">Website</span>
                    <a
                      href={formData.website.startsWith('http') ? formData.website : `https://${formData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-medium text-[#0f5ce0] hover:underline"
                    >
                      {formData.website}
                    </a>
                  </div>
                  <div className="col-span-2"><SummaryItem label="Kantor Pusat" value={formData.address} /></div>
                </div>
                <SummaryItem label="Deskripsi Perusahaan" value={formData.description} />
              </SummaryCard>

              <SummaryCard
                title="Dokumen yang Diunggah"
                iconSrc="/src/assets/register/dokumen.png"
                onEdit={() => setStep(3)}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3 border border-[#e4e9f4] p-3 rounded-[10px] bg-[#fafbff]">
                    <div className="w-8 h-8 bg-[#f5f8ff] rounded-[8px] flex items-center justify-center font-bold text-[#0f5ce0] text-sm">
                      <img src="/src/assets/register/nib.png" alt="" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      <span className="text-sm font-bold text-[#0f5ce0]"></span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-[#7b8191]">Nomor NIB</span>
                      <span className="text-[13px] font-medium">{formData.nib || '-'}</span>
                    </div>
                  </div>

                  <FilePreviewItem
                    label="Izin Usaha"
                    file={formData.izinUsahaFile}
                    iconSrc="/src/assets/register/usaha.png"
                    accentColor="#fff1f0"
                    iconColor="text-red-400"
                    fallbackIcon={
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                    }
                  />

                  {formData.suratResmiFile && (
                    <FilePreviewItem
                      label="Surat Resmi"
                      file={formData.suratResmiFile}
                      iconSrc="/src/assets/register/otoritas.png"
                      accentColor="#f0f9ff"
                      iconColor="text-blue-400"
                      fallbackIcon={
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      }
                    />
                  )}
                </div>
              </SummaryCard>
            </div>

            <div className="mt-5 bg-[#f7faff] border border-[#e5ecff] p-4 rounded-[14px]">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#0f5ce0] focus:ring-[#0f5ce0] cursor-pointer"
                  checked={formData.finalConsent}
                  onChange={(e) => updateField('finalConsent', e.target.checked)}
                />
                <span className={`text-[13px] leading-relaxed transition ${formData.finalConsent ? 'text-[#111827]' : 'text-[#5b6170]'}`}>
                  Saya menyatakan bahwa seluruh informasi yang diberikan adalah akurat dan benar. Saya memahami bahwa pemberian informasi yang tidak benar dapat mengakibatkan penolakan atau penghentian akun perusahaan kami di Simaster.
                </span>
              </label>
            </div>

            <div className="mt-8 pt-6 border-t border-[#f1f4f9] flex justify-between items-center gap-4">
              <BackButton onClick={prevStep} label="Kembali ke Dokumen" />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0f5ce0] text-white px-8 py-2.5 rounded-[10px] text-[14px] font-semibold hover:bg-[#0c48b0] transition shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Memproses...' : 'Ajukan untuk Persetujuan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

// Components
const SidebarFeature = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="flex items-start gap-3">
    <div className="w-7 h-7 rounded-[8px] bg-[#eef4ff] flex items-center justify-center shrink-0 text-[#0f5ce0]">
      {icon}
    </div>
    <div>
      <p className="text-[12px] font-bold text-[#111827]">{title}</p>
      <p className="text-[11px] text-[#5b6170] mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
)

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ['Akun', 'Detail Perusahaan', 'Dokumen', 'Tinjauan']
  return (
    <div className="flex items-center w-full justify-between">
      {steps.map((label, index) => {
        const n = index + 1
        const isActive = currentStep === n
        const isDone = currentStep > n
        const isLast = index === steps.length - 1

        return (
          <div key={label} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
            <div className="flex flex-col items-center shrink-0 w-16">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all
                ${isActive
                  ? 'bg-[#0f5ce0] text-white ring-4 ring-[#0f5ce0]/20'
                  : isDone
                  ? 'bg-[#0f5ce0] text-white'
                  : 'bg-white border-2 border-[#d7dde9] text-[#a3b1c6]'
                }`}>
                {isDone
                  ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  : n
                }
              </div>
              <span className={`mt-2 text-[11px] font-semibold whitespace-nowrap text-center
                ${isActive ? 'text-[#0f5ce0]' : isDone ? 'text-[#0f5ce0]' : 'text-[#a3b1c6]'}`}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 px-2 mb-6">
                <div className={`w-full h-[2px] rounded-full transition-all ${isDone ? 'bg-[#0f5ce0]' : 'bg-[#e4e9f4]'}`} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const SectionHeader = ({ title, subtitle, step, center }: { title: string; subtitle: string; step: string; center?: boolean }) => (
  <div className={`pb-5 border-b border-[#f1f4f9] mb-6 flex ${center ? 'flex-col items-center text-center' : 'justify-between items-start'} relative`}>
    <div className={`w-full pr-32 ${center ? 'flex flex-col items-center text-center pr-0' : ''}`}>
      <h2 className="text-[22px] font-bold text-[#111827]">{title}</h2>
      <p className="text-[13px] text-[#5b6170] mt-1.5 max-w-lg">{subtitle}</p>
    </div>
    <div className="absolute top-0 right-0 shrink-0 rounded-[12px] border border-[#e5ecff] bg-[#f7faff] px-3 py-1.5 text-[11px] font-semibold text-[#0f5ce0]">
      {step}
    </div>
  </div>
)

const Step2Header = ({ title, subtitle, step }: { title: string; subtitle: string; step: string }) => (
  <div className="pb-5 border-b border-[#f1f4f9] mb-6 relative">
    <div className="pr-32">
      <h2 className="text-[22px] font-bold text-[#111827]">{title}</h2>
      <div className="mt-1.5 max-h-[3.5rem] overflow-y-auto pr-1">
        <p className="text-[13px] text-[#5b6170] leading-relaxed">{subtitle}</p>
      </div>
    </div>
    <div className="absolute top-0 right-0 shrink-0 rounded-[12px] border border-[#e5ecff] bg-[#f7faff] px-3 py-1.5 text-[11px] font-semibold text-[#0f5ce0]">
      {step}
    </div>
  </div>
)

const ErrorBox = ({ message, ref }: { message: string; ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    className="mb-4 rounded-[10px] bg-[#fff1f0] border border-red-100 px-4 py-3 text-[13px] text-[#b91c1c] flex items-center gap-2"
  >
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    {message}
  </div>
)

const NibField = ({ value, onChange, onError }: { value: string; onChange: (v: string) => void; onError: (msg: string) => void }) => {
  const [localError, setLocalError] = useState('')

  const handleChange = (raw: string) => {
    const hasInvalidChar = /[^0-9]/.test(raw)
    const digitsOnly = raw.replace(/[^0-9]/g, '').slice(0, 13)

    if (hasInvalidChar) {
      const msg = 'NIB hanya boleh berisi angka. Huruf dan karakter lain tidak valid.'
      setLocalError(msg)
      onError(msg)
    } else {
      setLocalError('')
      onError('')
    }
    onChange(digitsOnly)
  }

  const remaining = 13 - value.length

  return (
    <label className="grid gap-1.5 text-[14px] font-semibold text-[#111827]">
      <span>Nomor Induk Berusaha (NIB)<span className="text-red-500 ml-0.5">*</span></span>
      <div className="relative">
        <input
          className={`h-11 w-full rounded-[10px] border bg-[#fafbff] px-4 pr-16 font-normal text-[14px] text-[#1f2937] outline-none transition tracking-wider
            ${localError
              ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/15'
              : value.length === 13
              ? 'border-green-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/15'
              : 'border-[#d7dde9] focus:border-[#0f5ce0] focus:ring-2 focus:ring-[#0f5ce0]/15'
            }`}
          placeholder="912000XXXXXXX"
          value={value}
          inputMode="numeric"
          onChange={(e) => handleChange(e.target.value)}
        />
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold ${value.length === 13 ? 'text-green-600' : 'text-[#a3b1c6]'}`}>
          {value.length}/13
        </span>
      </div>
      {localError ? (
        <div className="flex items-center gap-1.5 text-[12px] text-red-600 bg-[#fff1f0] border border-red-100 rounded-[8px] px-3 py-2">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {localError}
        </div>
      ) : value.length > 0 && value.length < 13 ? (
        <div className="flex items-center gap-1.5 text-[12px] text-amber-600 bg-amber-50 border border-amber-100 rounded-[8px] px-3 py-2">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Kurang {remaining} digit lagi untuk mencapai 13 digit.
        </div>
      ) : null}
    </label>
  )
}

const FormField = ({ id, label, onChange, placeholder, type = 'text', value, required }: any) => {
  const [showPwd, setShowPwd] = useState(false)
  const isPassword = type === 'password'
  const finalType = isPassword ? (showPwd ? 'text' : 'password') : type

  return (
    <label className="grid gap-1.5 text-[14px] font-semibold text-[#111827] relative" htmlFor={id}>
      <span>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</span>
      <div className="relative">
        <input
          className={`h-11 w-full rounded-[10px] border border-[#d7dde9] bg-[#fafbff] px-4 font-normal text-[14px] text-[#1f2937] outline-none transition focus:border-[#0f5ce0] focus:ring-2 focus:ring-[#0f5ce0]/15 ${isPassword ? 'pr-12' : ''}`}
          id={id}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={finalType}
          value={value}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7b8191] hover:text-[#111827] transition"
            title={showPwd ? 'Sembunyikan sandi' : 'Lihat sandi'}
          >
            {showPwd ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            )}
          </button>
        )}
      </div>
    </label>
  )
}

const SelectField = ({ id, label, onChange, options, value, required }: any) => (
  <label className="grid gap-1.5 text-[14px] font-semibold text-[#111827]" htmlFor={id}>
    <span>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</span>
    <div className="relative">
      <select
        className="h-11 w-full rounded-[10px] border border-[#d7dde9] bg-[#fafbff] px-4 pr-10 font-normal text-[14px] text-[#1f2937] outline-none transition focus:border-[#0f5ce0] focus:ring-2 focus:ring-[#0f5ce0]/15 appearance-none cursor-pointer"
        id={id} onChange={(e) => onChange(e.target.value)} value={value}
      >
        <option value="" disabled>Pilih opsi</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7b8191]">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </label>
)

const FileUploadField = ({ label, hint, accept, required, file, onChange, icon }: {
  label: string; hint: string; accept: string; required?: boolean
  file: File | null; onChange: (f: File | null) => void; icon: React.ReactNode
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <span className="text-[14px] font-semibold text-[#111827] mb-2 block">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />

      {file ? (
        <div className="border-2 border-solid border-[#0f5ce0] bg-[#f0f5ff] rounded-[14px] p-5 flex items-center justify-between transition-all">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#0f5ce0]/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#0f5ce0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <span className="block text-[13px] font-semibold text-[#0f5ce0] truncate max-w-[150px] sm:max-w-[180px]">{file.name}</span>
              <span className="block text-[11px] text-[#7b8191] mt-0.5">Berhasil diunggah</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#7b8191] hover:bg-white hover:text-red-500 transition shadow-sm border border-transparent hover:border-red-100 shrink-0"
            title="Hapus file"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-[#d7dde9] bg-[#fafbff] hover:border-[#0f5ce0] hover:bg-[#f5f8ff] rounded-[14px] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
        >
          <div className="mb-2">{icon}</div>
          <span className="text-[13px] font-semibold text-[#111827]">Klik untuk mengunggah</span>
          <span className="text-[11px] text-[#7b8191] mt-1">{hint}</span>
        </div>
      )}
    </div>
  )
}

const FilePreviewItem = ({ label, file, iconSrc, accentColor, iconColor, fallbackIcon }: {
  label: string
  file: File | null
  iconSrc: string
  accentColor: string
  iconColor: string
  fallbackIcon: React.ReactNode
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const isImage = file && file.type.startsWith('image/')
  const isPdf = file && file.type === 'application/pdf'

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return }
    if (isImage || isPdf) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [file])

  if (!file) {
    return (
      <div className="flex items-center gap-3 border border-[#e4e9f4] p-3 rounded-[10px] bg-[#fafbff]">
        <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${iconColor}`} style={{ backgroundColor: accentColor }}>
          {fallbackIcon}
        </div>
        <div>
          <span className="block text-[11px] text-[#7b8191]">{label}</span>
          <span className="text-[13px] font-medium text-[#7b8191]">Belum diunggah</span>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-[#e4e9f4] rounded-[10px] bg-[#fafbff] overflow-hidden">
      {isImage && previewUrl ? (
        <div className="w-full h-[140px] bg-[#f1f4f9] overflow-hidden flex items-center justify-center">
          <img src={previewUrl} alt={label} className="max-w-full max-h-full object-contain" />
        </div>
      ) : isPdf && previewUrl ? (
        <div className="w-full h-[220px] bg-[#f1f4f9] overflow-hidden relative">
          <iframe
            src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            title={`Pratinjau ${label}`}
            className="w-full h-full border-0"
          />
        </div>
      ) : (
        <div className="w-full h-[90px] flex items-center justify-center gap-3" style={{ backgroundColor: accentColor }}>
          <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center bg-white shadow-sm ${iconColor}`}>
            {fallbackIcon}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#111827]">Dokumen</p>
            <p className="text-[10px] text-[#7b8191] mt-0.5">Pratinjau tidak tersedia</p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3 p-3">
        <div className={`w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 ${iconColor}`} style={{ backgroundColor: accentColor }}>
          <img src={iconSrc} alt="" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <span className="hidden">{fallbackIcon}</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <span className="block text-[11px] text-[#7b8191]">{label}</span>
          <span className="block text-[12px] font-semibold text-[#111827] truncate">{file.name}</span>
        </div>
        {previewUrl && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[10px] font-semibold text-[#0f5ce0] hover:underline px-2"
          >
            Buka
          </a>
        )}
        <span className="shrink-0 text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
          ✓ Terunggah
        </span>
      </div>
    </div>
  )
}

const BackButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    type="button" onClick={onClick}
    className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] border border-[#d7dde9] bg-white text-[14px] font-semibold text-[#5b6170] hover:bg-[#f7faff] hover:border-[#0f5ce0] hover:text-[#0f5ce0] transition shadow-sm"
  >
    {label}
  </button>
)

const SummaryCard = ({ title, iconSrc, children, onEdit }: {
  title: string
  iconSrc: string
  children: React.ReactNode
  onEdit: () => void
}) => (
  <div className="border border-[#e4e9f4] rounded-[16px] overflow-hidden">
    <div className="bg-[#f7faff] border-b border-[#e4e9f4] px-5 py-3 flex justify-between items-center">
      <h3 className="text-[13px] font-bold text-[#111827] flex items-center gap-2">
        <span className="w-5 h-5 flex items-center justify-center">
          <img
            src={iconSrc}
            alt=""
            className="w-5 h-5"
            onError={(e) => {
              const el = e.target as HTMLImageElement
              el.style.display = 'none'
              const dot = document.createElement('span')
              dot.className = 'w-2 h-2 rounded-full bg-[#0f5ce0] inline-block'
              el.parentElement?.appendChild(dot)
            }}
          />
        </span>
        {title}
      </h3>
      <button type="button" onClick={onEdit}
        className="text-[12px] font-semibold text-[#0f5ce0] px-3 py-1 rounded-[6px] hover:bg-[#eef4ff] transition">
        ✎ Edit
      </button>
    </div>
    <div className="p-5 bg-white">{children}</div>
  </div>
)

const SummaryItem = ({ label, value, colored }: { label: string; value: string; colored?: boolean }) => (
  <div>
    <span className="block text-[11px] text-[#7b8191] mb-0.5">{label}</span>
    <span className={`text-[13px] font-medium ${colored ? 'text-[#0f5ce0]' : 'text-[#111827]'}`}>{value || '-'}</span>
  </div>
)