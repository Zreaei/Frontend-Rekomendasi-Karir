import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { login } from '../services/auth.service'

const LoginPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { loginAsAdmin, loginAsUniversity, loginAsCompany, loginAsUniversityStaff, loginAsCompanyStaff, loginAsStudent, } = useAuthStore()

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
      const data = await login({ email, password });

      // Get the exact role from the server response
      const role = data.user?.role; 

      // Extract the token
      const token = data.accessToken 
        || data.token 
        || (data as any).jwt
        || (data as any)?.data?.token
        || (data as any)?.data?.accessToken
        || null;

      if (!token) {
        throw new Error('Token tidak ditemukan dalam respons');
      }

      // Check based on the role, call the appropriate login function and navigate to the corresponding dashboard
      if (role === 'admin') {
        loginAsAdmin(token);
        navigate('/admin/dashboard');
      } else if (role === 'university') {
        loginAsUniversity(token);
        navigate('/university/dashboard');
      } else if (role === 'company') {
        loginAsCompany(token);
        navigate('/company/dashboard');
      } else if (role === 'university_staff') {
        loginAsUniversityStaff(token);
        navigate('/university-staff/dashboard');
      } else if (role === 'company_staff') {
        loginAsCompanyStaff(token);
        navigate('/company-staff/dashboard');
      } else if (role === 'student') {
        loginAsStudent(token);
        navigate('/student/dashboard');
      } else {
        throw new Error(`Role tidak valid atau tidak dikenali: ${role}`);
      }
		} catch (err: any) {
			const message = err?.message || err?.data?.message || 'Gagal masuk. Coba lagi.'
			setError(message)
		} finally {
			setLoading(false)
		}
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
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              type="email"
              value={email}
              required
            />

            <label className="block text-[14px] font-semibold leading-none" htmlFor="password">
              Password
            </label>
            <input
              className="h-10 w-full rounded-[5px] border border-[#d8dce2] px-3 text-[14px] outline-none transition focus:border-[#0d6efd] focus:ring-2 focus:ring-[#0d6efd]/15"
              id="password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              type="password"
              value={password}
              required
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
            disabled={loading}
            type="submit"
          >
            {loading ? 'Continuing...' : 'Continue'}
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
