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
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof LoginForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.email.trim() || !form.password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    setIsSubmitting(true)
    loginAsCompany('demo-company-session')
    navigate('/company', { replace: true })
  }

  return (
    <main className="min-h-screen bg-gray-200 px-5 py-10 text-[#111318]">
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <form
          className="w-full max-w-100 rounded-[7px] bg-white px-6 py-6 shadow-xl sm:px-8"
          onSubmit={handleSubmit}
        >
          <div className="mb-7">
            <h1 className="text-[26px] font-semibold leading-tight tracking-normal">Welcome back!</h1>
            <p className="mt-2 text-[15px] leading-none text-[#202329]">Login into your account</p>
          </div>

          <div className="space-y-3">
            <label className="block text-[14px] font-semibold leading-none" htmlFor="email">
              Email
            </label>
            <input
              className="h-10 w-full rounded-[5px] border border-[#d8dce2] px-3 text-[14px] outline-none transition focus:border-[#0d6efd] focus:ring-2 focus:ring-[#0d6efd]/15"
              id="email"
              name="email"
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="email@example.com"
              type="email"
              value={form.email}
            />

            <label className="block text-[14px] font-semibold leading-none" htmlFor="password">
              Password
            </label>
            <input
              className="h-10 w-full rounded-[5px] border border-[#d8dce2] px-3 text-[14px] outline-none transition focus:border-[#0d6efd] focus:ring-2 focus:ring-[#0d6efd]/15"
              id="password"
              name="password"
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Password"
              type="password"
              value={form.password}
            />
          </div>

          <div className="mt-6">
            <button className="text-[13px] font-semibold text-[#006fff]" type="button">
              Forgot password?
            </button>
          </div>

          {error ? <p className="mt-4 text-[13px] font-medium text-[#c62828]">{error}</p> : null}

          <button
            className="mt-6 h-10 w-full rounded-[7px] bg-[#0d6efd] text-[14px] font-medium text-white transition hover:bg-[#075bd8] focus:outline-none focus:ring-2 focus:ring-[#0d6efd]/30 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Continuing...' : 'Continue'}
          </button>

          <p className="mt-6 text-center text-[12px] text-[#17191d]">
            Don&apos;t have an account?{' '}
            <Link className="font-semibold text-[#006fff]" to="/register">
              Sign up
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
