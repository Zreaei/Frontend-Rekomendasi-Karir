import { Routes, Route, Navigate } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import LandingPage from '../pages/LandingPage.page'
import LoginPage from '../pages/LoginPage.page'
import RegisterPage from '../pages/Register.page'
import ForgotPasswordPage from '../pages/ForgotPassword.page'
import AdminDashboard from '../pages/admin/AdminDashboard.page'
import UniversityDashboard from '../pages/university/UniversityDashboard.page'
import CompanyLayout from '../layouts/CompanyLayout'
import UniversityStaffDashboard from '../pages/university_staff/UniversityStaffDashboard.page'
import CompanyStaffDashboard from '../pages/company_staff/CompanyStaffDashboard.page'

// STUDENT PAGES
// ============================================
import StudentDashboard from '../pages/student/StudentDashboard.page'
import StudentJobMatching from '../pages/student/StudentJobMatching.page'
import StudentJobApply from '../pages/student/StudentJobApply.page'
import StudentCompetencyProfile from '../pages/student/StudentCompetencyProfile.page'
import StudentNotification from '../pages/student/StudentNotification.page'
import StudentHelp from '../pages/student/StudentHelp.page'

// COMPANY PAGES 
// ============================================
import Company_Dashboard from '../pages/company/Company_Dashboard.page'
import Company_DaftarPelamar from '../pages/company/Company_DaftarPelamar.page'
import Company_KelolaLowongan from '../pages/company/Company_KelolaLowongan.page'
import Company_TambahLowongan from '../pages/company/Company_TambahLowongan.page'
import Company_RekomendasiKandidat from '../pages/company/Company_RekomendasiKandidat.page'
import Company_DetailKandidat from '../pages/company/Company_DetailKandidat.page'

// TODO: Buat file Company_KandidatDiundang.page.tsx
// import Company_KandidatDiundang from '../pages/company/Company_KandidatDiundang.page'

import Company_ProfilePerusahaan from '../pages/company/Company_ProfilePerusahaan.page'
import Company_UbahProfile from '../pages/company/Company_UbahProfile.page'
import Company_PengaturanAkun from '../pages/company/Company_PengaturanAkun.page'
 

// PLACEHOLDER UNTUK HALAMAN YANG BELUM DIBUAT
// ============================================
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-[#111827]">{title}</h2>
      <p className="text-[#5b6170] mt-2">Halaman ini sedang dalam pengembangan tunggu yaa ^_^ </p>
      <p className="text-xs text-[#a3b1c6] mt-4">
        TODO: Buat file komponen dan ganti placeholder di Router.tsx
      </p>
    </div>
  </div>
)

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />

      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/landing" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

      {/* ===== PROTECTED ROUTES ===== */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/university" element={<ProtectedRoute allowedRoles={['university']}><UniversityDashboard /></ProtectedRoute>} />

      {/* ===== COMPANY ROUTES ===== */}
      <Route path="/company" element={<ProtectedRoute allowedRoles={['company']}><CompanyLayout /></ProtectedRoute>}>
        <Route index element={<Company_Dashboard />} />
        <Route path="daftar-pelamar" element={<Company_DaftarPelamar />} />
        <Route path="kelola-lowongan" element={<Company_KelolaLowongan />} />
        <Route path="tambah-lowongan" element={<Company_TambahLowongan />} />
        <Route path="rekomendasi-kandidat" element={<Company_RekomendasiKandidat />} />
        <Route path="detail-kandidat/:id" element={<Company_DetailKandidat />} />
        <Route path="kandidat-diundang" element={<PlaceholderPage title="Kandidat Diundang" />} />
        <Route path="profil-perusahaan" element={<Company_ProfilePerusahaan />} />
        <Route path="ubah-profil-perusahaan" element={<Company_UbahProfile />} />
        <Route path="pengaturan-akun" element={<Company_PengaturanAkun />} />

        <Route path="*" element={<Navigate to="/company" replace />} />
      </Route>

      {/* ===== STAFF ROUTES ===== */}
      <Route path="/university-staff" element={<ProtectedRoute allowedRoles={['university_staff']}><UniversityStaffDashboard /></ProtectedRoute>} />
      <Route path="/company-staff" element={<ProtectedRoute allowedRoles={['company_staff']}><CompanyStaffDashboard /></ProtectedRoute>} />

      {/* ===== STUDENT ROUTES ===== */}
      <Route path="/student" element={<PublicRoute><StudentDashboard /></PublicRoute>} />
      <Route path="/student/job-matching" element={<PublicRoute><StudentJobMatching /></PublicRoute>} />
      <Route path="/student/job-apply" element={<PublicRoute><StudentJobApply /></PublicRoute>} />
      <Route path="/student/competency-profile" element={<PublicRoute><StudentCompetencyProfile /></PublicRoute>} />
      <Route path="/student/notification" element={<PublicRoute><StudentNotification /></PublicRoute>} />
      <Route path="/student/help" element={<PublicRoute><StudentHelp /></PublicRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  )
}

export default AppRouter