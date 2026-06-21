import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

interface RegisterForm {
  companyName: string
  industry: string
  website: string
  location: string
  staffSize: string
  founded: string
  description: string
  email: string
  password: string
  adminName: string
}

const initialForm: RegisterForm = {
  companyName: '',
  industry: '',
  website: '',
  location: '',
  staffSize: '',
  founded: '',
  description: '',
  email: '',
  password: '',
  adminName: '',
}

const RegisterPage = () => {
  const navigate = useNavigate()
  const loginAsCompany = useAuthStore((state) => state.loginAsCompany)
  const [form, setForm] = useState<RegisterForm>(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const requiredFields: Array<keyof RegisterForm> = ['companyName', 'email', 'password', 'adminName']
    const isMissingRequiredField = requiredFields.some((field) => !form[field].trim())

    if (isMissingRequiredField) {
      setError('Please complete all required fields.')
      return
    }

    setIsSubmitting(true)
    loginAsCompany('demo-company-session')
    navigate('/company', { replace: true })
  }

  return (
    <main className="min-h-screen bg-gray-200 px-5 py-8 text-[#111318]">
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <form
          className="w-full max-w-125 rounded-[7px] bg-white px-6 py-6 shadow-xl sm:px-8"
          onSubmit={handleSubmit}
        >
          <div className="mb-7">
            <h1 className="text-[26px] font-semibold leading-tight tracking-normal">Create your account!</h1>
            <p className="mt-2 text-[15px] leading-none text-[#202329]">Create your account to enter</p>
          </div>

          <div className="space-y-3">
            <FormField
              id="company-name"
              label="Company Name*"
              onChange={(value) => updateField('companyName', value)}
              placeholder="Great Company"
              value={form.companyName}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                id="industry"
                label="Industry"
                onChange={(value) => updateField('industry', value)}
                placeholder="Technology"
                value={form.industry}
              />
              <FormField
                id="website"
                label="Company Website"
                onChange={(value) => updateField('website', value)}
                placeholder="www.greatcompany.com"
                type="url"
                value={form.website}
              />
            </div>

            <FormField
              id="location"
              label="Location"
              onChange={(value) => updateField('location', value)}
              placeholder="Jl. Permata Biru, Bandung"
              value={form.location}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                id="staff-size"
                label="Staff Size"
                onChange={(value) => updateField('staffSize', value)}
                placeholder="20-100"
                value={form.staffSize}
              />
              <FormField
                id="founded"
                label="Founded"
                onChange={(value) => updateField('founded', value)}
                placeholder="May 12, 2018"
                value={form.founded}
              />
            </div>

            <FormField
              id="description"
              label="Company Description"
              onChange={(value) => updateField('description', value)}
              placeholder="A great company that runs in technological sector"
              value={form.description}
            />
            <FormField
              id="register-email"
              label="Email*"
              onChange={(value) => updateField('email', value)}
              placeholder="email@example.com"
              type="email"
              value={form.email}
            />
            <FormField
              id="register-password"
              label="Password*"
              onChange={(value) => updateField('password', value)}
              placeholder="*********"
              type="password"
              value={form.password}
            />
            <FormField
              id="admin-name"
              label="Company Admin's Name*"
              onChange={(value) => updateField('adminName', value)}
              placeholder="Adrian Johnson"
              value={form.adminName}
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
            {isSubmitting ? 'Creating...' : 'Create account'}
          </button>

          <p className="mt-6 text-center text-[12px] text-[#17191d]">
            Already have an account?{' '}
            <Link className="font-semibold text-[#006fff]" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

interface FormFieldProps {
  id: string
  label: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  value: string
}

const FormField = ({ id, label, onChange, placeholder, type = 'text', value }: FormFieldProps) => (
  <label className="block text-[14px] font-semibold leading-none" htmlFor={id}>
    {label}
    <input
      className="mt-2 h-10 w-full rounded-[5px] border border-[#d8dce2] px-3 text-[14px] font-normal outline-none transition focus:border-[#0d6efd] focus:ring-2 focus:ring-[#0d6efd]/15"
      id={id}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  </label>
)

export default RegisterPage
