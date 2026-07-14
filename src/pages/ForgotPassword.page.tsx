import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Mail, Lock, RotateCcw } from 'lucide-react'

interface PasswordForm {
  email: string
  passwordNew: string
  passwordConfirm: string
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<PasswordForm>({
    email: '',
    passwordNew: '',
    passwordConfirm: '',
  })
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPasswordNew, setShowPasswordNew] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const updateField = (field: keyof PasswordForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const handleRequestReset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedEmail = form.email.trim()

    if (!trimmedEmail) {
      setError('Email wajib diisi.')
      return
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError('Format email tidak valid.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep(2)
      setError('')
    }, 1000)
  }

  const handleUpdatePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedPass = form.passwordNew.trim()
    const trimmedConfirm = form.passwordConfirm.trim()

    if (!trimmedPass || !trimmedConfirm) {
      setError('Semua kolom kata sandi wajib diisi.')
      return
    }

    if (trimmedPass.length < 8) {
      setError('Kata sandi minimal harus 8 karakter.')
      return
    }

    if (trimmedPass !== trimmedConfirm) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess('Kata sandi Anda berhasil diperbarui!')
      setError('')
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1500)
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-[440px] rounded-[24px] bg-white p-8 border border-[#e4e9f4]/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#eef4ff] flex items-center justify-center text-[#0f5ce0]">
            <RotateCcw size={24} className="stroke-[2.5]" />
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestReset} noValidate>
            <div className="text-center mb-8">
              <h1 className="text-[22px] font-bold text-[#111827] mb-2">Lupa Kata Sandi?</h1>
              <p className="text-[13px] text-[#7b8191] leading-relaxed px-2">
                Masukkan alamat email Anda yang terdaftar untuk menerima tautan pemulihan kata sandi.
              </p>
            </div>

            {error && (
              <p className="mb-4 rounded-[8px] bg-red-50 px-3 py-2 text-[12px] font-medium text-[#c62828] text-center">
                {error}
              </p>
            )}

            <div className="mb-6">
              <label className="block text-[13px] font-bold text-[#111827] mb-2.5" htmlFor="email">
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7b8191]">
                  <Mail size={18} />
                </span>
                <input
                  className="h-11 w-full rounded-[10px] border border-[#e4e9f4] pl-11 pr-4 text-[14px] placeholder-[#b5bbca] outline-none transition focus:border-[#0f5ce0] focus:ring-4 focus:ring-[#0f5ce0]/5"
                  id="email"
                  name="email"
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="nama@Gmail.com"
                  type="email"
                  value={form.email}
                />
              </div>
            </div>

            <button
              className="mb-6 h-11 w-full rounded-[10px] bg-[#0f5ce0] text-[14px] font-semibold text-white transition hover:bg-[#0d4ebf] flex items-center justify-center gap-2 disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Tautan Pemulihan'}
            </button>

            <div className="text-center">
              <Link className="text-[13px] font-semibold text-[#0f5ce0] hover:underline flex items-center justify-center gap-1.5" to="/login">
                 Kembali ke Login
              </Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleUpdatePassword} noValidate>
            <div className="text-center mb-8">
              <h1 className="text-[22px] font-bold text-[#111827] mb-2">Atur Kata Sandi Baru</h1>
              <p className="text-[13px] text-[#7b8191] leading-relaxed px-4">
                Silakan masukkan kata sandi baru Anda untuk mengamankan akun.
              </p>
            </div>

            {error && (
              <p className="mb-4 rounded-[8px] bg-red-50 px-3 py-2 text-[12px] font-medium text-[#c62828] text-center">
                {error}
              </p>
            )}
            {success && (
              <p className="mb-4 rounded-[8px] bg-emerald-50 px-3 py-2 text-[12px] font-medium text-[#10b981] text-center">
                {success}
              </p>
            )}

            {/* Input Sandi Baru */}
            <div className="mb-5">
              <label className="block text-[13px] font-bold text-[#111827] mb-2.5" htmlFor="passwordNew">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7b8191]">
                  <Lock size={18} />
                </span>
                <input
                  className="h-11 w-full rounded-[10px] border border-[#e4e9f4] pl-11 pr-11 text-[14px] placeholder-[#b5bbca] outline-none transition focus:border-[#0f5ce0] focus:ring-4 focus:ring-[#0f5ce0]/5"
                  id="passwordNew"
                  placeholder="Masukkan kata sandi baru"
                  type={showPasswordNew ? 'text' : 'password'}
                  value={form.passwordNew}
                  onChange={(e) => updateField('passwordNew', e.target.value)}
                  disabled={!!success}
                />
                <button
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] hover:text-[#111827] transition"
                  onClick={() => setShowPasswordNew(!showPasswordNew)}
                  type="button"
                >
                  {showPasswordNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Input Konfirmasi Sandi */}
            <div className="mb-6">
              <label className="block text-[13px] font-bold text-[#111827] mb-2.5" htmlFor="passwordConfirm">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7b8191]">
                  <Lock size={18} />
                </span>
                <input
                  className="h-11 w-full rounded-[10px] border border-[#e4e9f4] pl-11 pr-11 text-[14px] placeholder-[#b5bbca] outline-none transition focus:border-[#0f5ce0] focus:ring-4 focus:ring-[#0f5ce0]/5"
                  id="passwordConfirm"
                  placeholder="Ulangi kata sandi baru"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  value={form.passwordConfirm}
                  onChange={(e) => updateField('passwordConfirm', e.target.value)}
                  disabled={!!success}
                />
                <button
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] hover:text-[#111827] transition"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  type="button"
                >
                  {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              className="mb-6 h-11 w-full rounded-[10px] bg-[#0f5ce0] text-[14px] font-semibold text-white transition hover:bg-[#0d4ebf] flex items-center justify-center disabled:opacity-70"
              disabled={isSubmitting || !!success}
              type="submit"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Kata Sandi'}
            </button>

            <div className="text-center">
              <Link className="text-[13px] font-semibold text-[#0f5ce0] hover:underline flex items-center justify-center gap-1.5" to="/login">
                Kembali ke Login
              </Link>
            </div>
          </form>
        )}

      </div>
    </main>
  )
}

export default ForgotPasswordPage