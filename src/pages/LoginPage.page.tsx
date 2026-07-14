import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

interface LoginForm {
  email: string
  password: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const loginAsCompany = useAuthStore((state) => state.loginAsCompany)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const updateField = (field: keyof LoginForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedEmail = form.email.trim()
    const trimmedPassword = form.password.trim()

    if (!trimmedEmail && !trimmedPassword) {
      setError('Email dan kata sandi wajib diisi.')
      return
    }

    if (!trimmedEmail) {
      setError('Email wajib diisi sebelum masuk.')
      return
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError('Format email tidak valid. Contoh: nama@Gmail.com')
      return
    }

    if (!trimmedPassword) {
      setError('Kata sandi wajib diisi.')
      return
    }

    if (trimmedPassword.length < 8) {
      setError('Kata sandi minimal 8 karakter.')
      return
    }

    setIsSubmitting(true)
    loginAsCompany('demo-company-session')
    navigate('/company', { replace: true })
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex min-h-screen items-center justify-center">
        <form
          className="w-full max-w-[440px] rounded-[12px] bg-white p-6 sm:p-8"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-[22px] font-medium text-[#666666] mb-4">Selamat Datang kembali!</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <img 
                src="/src/assets/login/logo.png" 
                alt="CareerSync Logo"
                className="h-8 w-8 object-contain"
              />
              <h1 className="text-[28px] font-bold text-[#1a1a1a]">Simaster</h1>
            </div>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              Silakan masuk untuk melanjutkan perjalanan karir Anda.
            </p>
          </div>

          {/* Error Message */}
          {error ? (
            <p className="mb-4 rounded-[6px] bg-red-50 px-3 py-2 text-[13px] font-medium text-[#c62828]">
              {error}
            </p>
          ) : null}

          {/* Email Field */}
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-[#1a1a1a] mb-3" htmlFor="email">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[16px]">
                <img 
                  src="/src/assets/login/email.png" 
                  alt="Email Icon"
                  className="h-4 w-4 object-contain"
                />
              </span>
              <input
                className="h-11 w-full rounded-[8px] border border-[#e0e0e0] pl-10 pr-3 text-[14px] placeholder-[#999999] outline-none transition focus:border-[#0d6efd] focus:ring-2 focus:ring-[#0d6efd]/15"
                id="email"
                name="email"
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="nama@Gmail.com"
                type="email"
                value={form.email}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[13px] font-semibold text-[#1a1a1a]" htmlFor="password">
                Kata Sandi
              </label>
              <Link className="text-[12px] font-semibold text-[#006fff] hover:underline" to="/forgot-password">
                Lupa Sandi?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[16px]">
                <img 
                  src="/src/assets/login/sandi.png" 
                  alt="Password Icon"
                  className="h-4 w-4 object-contain"
                />
              </span>
              <input
                className="h-11 w-full rounded-[8px] border border-[#e0e0e0] pl-10 pr-10 text-[14px] placeholder-[#999999] outline-none transition focus:border-[#0d6efd] focus:ring-2 focus:ring-[#0d6efd]/15"
                id="password"
                name="password"
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition flex items-center justify-center"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {}
                <img 
                  src={showPassword ? "/src/assets/login/eye-open.png" : "/src/assets/login/eye-close.png"} 
                  alt={showPassword ? "Sembunyikan Sandi" : "Tampilkan Sandi"}
                  className="h-6 w-6 object-contain" 
                />
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-3 flex items-center gap-2">
            <input
              checked={rememberMe}
              className="h-4 w-4 cursor-pointer accent-[#0058BE]"
              id="remember"
              onChange={(e) => setRememberMe(e.target.checked)}
              type="checkbox"
            />
            <label className="text-[12px] text-[#666666] cursor-pointer" htmlFor="remember">
              Ingat saya untuk login berikutnya
            </label>
          </div>

          {/* Submit Button */}
          <button
            className="mb-6 h-11 w-full rounded-[8px] bg-[#0f5ce0] text-[14px] font-semibold text-white transition hover:bg-[#0d4ebf] focus:outline-none focus:ring-2 focus:ring-[#0f5ce0]/30 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Memproses...' : 'Masuk Ke Akun'}
          </button>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex-1 border-t border-[#e0e0e0]"></div>
            <span className="text-[11px] font-semibold text-[#999999]">ATAU DAFTAR BARU</span>
            <div className="flex-1 border-t border-[#e0e0e0]"></div>
          </div>

          {/* Company Login Option */}
          <Link
            className="mb-6 block rounded-[8px] border border-[#e0e0e0] p-4 text-center transition hover:bg-[#f5f5f5]"
            to="/register"
          >
            {/* BAGIAN YANG DIUBAH: Ditambahkan flex dan justify-center untuk menengahkan gambar */}
            <div className="mb-2 flex justify-center">
              <img 
                src="/src/assets/login/perusahaan.png" 
                alt="Perusahaan Icon"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="text-[13px] font-semibold text-[#1a1a1a]">Perusahaan</div>
            <div className="text-[11px] text-[#999999]">Find Talent</div>
          </Link>

          {/* Footer Text */}
          <p className="text-center text-[11px] text-[#999999] leading-relaxed">
            Dengan masuk, Anda menyetujui Kebijakan Layanan dan Kebijakan Privasi kami.
          </p>
        </form>
      </section>
    </main>
  )
}

export default LoginPage