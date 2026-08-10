import { Routes, Route, Navigate } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import LandingPage from '../pages/LandingPage.page'
import LoginPage from '../pages/LoginPage.page'
import RegisterPage from '../pages/Register.page'
import ForgotPasswordPage from '../pages/ForgotPassword.page'
import AdminLayout from '../layouts/AdminLayout'
import CompanyLayout from '../layouts/CompanyLayout'
import UniversityStaffDashboard from '../pages/university_staff/UniversityStaffDashboard.page'
import CompanyStaffDashboard from '../pages/company_staff/CompanyStaffDashboard.page'
import VerifyRecoveryEmailPage from '../pages/VerifyRecoveryEmail.page'
import UniversityLayout from '../layouts/UniversityLayout'

// ADMIN PAGES
import AdminDashboard from '../pages/admin/Dashboard.page'
import AdminKelolaPerusahaan from '../pages/admin/KelolaPerusahaan.page'
import AdminDetailVerifikasiPerusahaan from '../pages/admin/DetailVerifikasiPerusahaan.page' 
import AdminPerusahaanDiterimaDitolak from '../pages/admin/PerusahaanDiterima-Ditolak.page' 
import AdminKelolaUniversitas from '../pages/admin/KelolaUniversitas.page'
import AdminTambahUniv from '../pages/admin/TambahUniv.page' // <-- IMPORT BARU
import AdminLogAktifitas from '../pages/admin/LogAktifitasPengguna.page'
import AdminManajemenPengguna from '../pages/admin/ManajemenPengguna.page'
import AdminMasterData from '../pages/admin/MasterData.page'

// STUDENT PAGES
import StudentDashboard from '../pages/student/StudentDashboard.page'
import StudentJobMatching from '../pages/student/StudentJobMatching.page'
import StudentJobApply from '../pages/student/StudentJobApply.page'
import StudentCompetencyProfile from '../pages/student/StudentCompetencyProfile.page'
import StudentNotification from '../pages/student/StudentNotification.page'
import StudentHelp from '../pages/student/StudentHelp.page'

// COMPANY PAGES
import Company_Dashboard from '../pages/company/Company_Dashboard.page'
import Company_DaftarPelamar from '../pages/company/Company_DaftarPelamar.page'
import Company_KelolaLowongan from '../pages/company/Company_KelolaLowongan.page'
import Company_TambahLowongan from '../pages/company/Company_TambahLowongan.page'
import Company_RekomendasiKandidat from '../pages/company/Company_RekomendasiKandidat.page'
import Company_DetailKandidat from '../pages/company/Company_DetailKandidat.page'
import Company_ProfilePerusahaan from '../pages/company/Company_ProfilePerusahaan.page'
import Company_UbahProfile from '../pages/company/Company_UbahProfile.page'
import Company_PengaturanAkun from '../pages/company/Company_PengaturanAkun.page'

// UNIVERSITY PAGES
import UniversityDashboard from '../pages/university/UniversityDashboard.page'
import UniversityManajemenMahasiswa from '../pages/university/UniversityManajemenMahasiswa.page'
import EditMahasiswa from '../pages/university/EditMahasiswa.page'
import DetailMahasiswa from '../pages/university/DetailMahasiswa.page'
import UniversityManajemenCLO from '../pages/university/UniversityManajemenCLO.page'
import UniversityDetailCLO from '../pages/university/UniversityDetailCLO.page'       
import UniversityManajemenNilai from '../pages/university/UniversityManejemenNilai.page'
import UniversityKelolaNilai from '../pages/university/UniversityKelolaNilai.page'
import UniversityVerifikasiSertifikat from '../pages/university/UniversityVerifikasiSertifikat.page'
import DetailSertifikat from '../pages/university/DetailSertifikat.page'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />

      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/landing" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

      {/* ===== ADMIN ROUTES ===== */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="kelola-perusahaan" element={<AdminKelolaPerusahaan />} />
        <Route path="kelola-perusahaan/detail/:id" element={<AdminDetailVerifikasiPerusahaan />} /> 
        <Route path="kelola-perusahaan/status/:id" element={<AdminPerusahaanDiterimaDitolak />} />
        <Route path="kelola-universitas" element={<AdminKelolaUniversitas />} />
        <Route path="kelola-universitas/tambah" element={<AdminTambahUniv />} /> {/* <-- ROUTE BARU */}
        <Route path="log-aktivitas" element={<AdminLogAktifitas />} />
        <Route path="manajemen-pengguna" element={<AdminManajemenPengguna />} />
        <Route path="master-data" element={<AdminMasterData />} />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* ===== UNIVERSITY ROUTES ===== */}
      <Route path="/university" element={<ProtectedRoute allowedRoles={['university']}><UniversityLayout /></ProtectedRoute>}>
        <Route index element={<UniversityDashboard />} />
        <Route path="manajemen-mahasiswa" element={<UniversityManajemenMahasiswa />} />
        <Route path="edit-mahasiswa" element={<EditMahasiswa />} />
        <Route path="edit-mahasiswa/:id" element={<EditMahasiswa />} />
        <Route path="detail-mahasiswa/:id" element={<DetailMahasiswa />} />
        <Route path="manajemen-clo" element={<UniversityManajemenCLO />} />
        <Route path="detail-clo/:id" element={<UniversityDetailCLO />} />      
        <Route path="manajemen-nilai" element={<UniversityManajemenNilai />} />
        <Route path="kelola-nilai/:id" element={<UniversityKelolaNilai />} />
        <Route path="verifikasi-sertifikat" element={<UniversityVerifikasiSertifikat />} />
        <Route path="detail-sertifikat/:id" element={<DetailSertifikat />} />

        <Route path="*" element={<Navigate to="/university" replace />} />
      </Route>

      {/* ===== COMPANY ROUTES ===== */}
      <Route path="/company" element={<ProtectedRoute allowedRoles={['company']}><CompanyLayout /></ProtectedRoute>}>
        <Route index element={<Company_Dashboard />} />
        <Route path="daftar-pelamar" element={<Company_DaftarPelamar />} />
        <Route path="kelola-lowongan" element={<Company_KelolaLowongan />} />
        <Route path="tambah-lowongan" element={<Company_TambahLowongan />} />
        <Route path="rekomendasi-kandidat" element={<Company_RekomendasiKandidat />} />
        <Route path="detail-kandidat/:id" element={<Company_DetailKandidat />} />
        <Route path="profil-perusahaan" element={<Company_ProfilePerusahaan />} />
        <Route path="ubah-profil-perusahaan" element={<Company_UbahProfile />} />
        <Route path="pengaturan-akun" element={<Company_PengaturanAkun />} />

        <Route path="*" element={<Navigate to="/company" replace />} />
      </Route>
         
      {/* ===== STAFF ROUTES ===== */}
      <Route path="/university-staff" element={<ProtectedRoute allowedRoles={['university_staff']}><UniversityStaffDashboard /></ProtectedRoute>} />
      <Route path="/company-staff" element={<ProtectedRoute allowedRoles={['company_staff']}><CompanyStaffDashboard /></ProtectedRoute>} />

      {/* ===== STUDENT ROUTES ===== */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/job-matching" element={<ProtectedRoute allowedRoles={['student']}><StudentJobMatching /></ProtectedRoute>} />
      <Route path="/student/job-apply" element={<ProtectedRoute allowedRoles={['student']}><StudentJobApply /></ProtectedRoute>} />
      <Route path="/student/competency-profile" element={<ProtectedRoute allowedRoles={['student']}><StudentCompetencyProfile /></ProtectedRoute>} />
      <Route path="/student/notification" element={<ProtectedRoute allowedRoles={['student']}><StudentNotification /></ProtectedRoute>} />
      <Route path="/student/help" element={<ProtectedRoute allowedRoles={['student']}><StudentHelp /></ProtectedRoute>} />

      {/* Forgot password */}
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/verify-recovery-email" element={<PublicRoute><VerifyRecoveryEmailPage /></PublicRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/student" replace />} />
    </Routes>
  )
}

export default AppRouter