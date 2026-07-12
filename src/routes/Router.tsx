import { Routes, Route, Navigate } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import LandingPage from '../pages/LandingPage.page'
import LoginPage from '../pages/LoginPage.page'
import RegisterPage from '../pages/Register.page'
import AdminDashboard from '../pages/admin/AdminDashboard.page'
import UniversityDashboard from '../pages/university/UniversityDashboard.page'
import CompanyDashboard from '../pages/company/CompanyDashboard.page'
import UniversityStaffDashboard from '../pages/university_staff/UniversityStaffDashboard.page'
import CompanyStaffDashboard from '../pages/company_staff/CompanyStaffDashboard.page'
import StudentDashboard from '../pages/student/StudentDashboard.page'
import StudentJobMatching from '../pages/student/StudentJobRecommendation.page'
import StudentJobDetail from '../pages/student/StudentJobDetail.page'
import CompanyDetail from '../pages/student/StudentCompanyDetail.page'
import StudentJobApply from '../pages/student/StudentJobApply.page'
import StudentCompetencyProfile from '../pages/student/StudentCompetencyProfile.page'
import StudentCertification from '../pages/student/StudentCertification.page'
import StudentCertificationUpload from '../pages/student/StudentCertificationUpload.page'
import StudentCertificationDetail from '../pages/student/StudentCertificationDetail.page'
import StudentCertificationDenied from '../pages/student/StudentCertificationDenied.page'
import StudentNotification from '../pages/student/StudentNotification.page'
import StudentHelp from '../pages/student/StudentHelp.page'
import StudentInvitation from '../pages/student/StudentInvitation.page'

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Navigate to='/landing' replace />
        }
      />
      
      {/* Public Routes */}
      <Route
        path='/landing'
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path='/login'
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path='/register'
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path='/admin'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/university'
        element={
          <ProtectedRoute allowedRoles={['university']}>
            <UniversityDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/company'
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/university-staff'
        element={
          <ProtectedRoute allowedRoles={['university_staff']}>
            <UniversityStaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/company-staff'
        element={
          <ProtectedRoute allowedRoles={['company_staff']}>
            <CompanyStaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/student'
        element={
          <PublicRoute>
            <StudentDashboard />
          </PublicRoute>
        }
      />
      <Route
        path='/student/job-matching'
        element={
          <PublicRoute>
            <StudentJobMatching />
          </PublicRoute>
        }
      />
      <Route
        path='/student/job-matching/:jobId'
        element={
          <PublicRoute>
            <StudentJobDetail />
          </PublicRoute>
        }
      />
      <Route
        path='/student/company/:companyId'
        element={
          <PublicRoute>
            <CompanyDetail />
          </PublicRoute>
        }
      />
      <Route
        path='/student/job-apply'
        element={
          <PublicRoute>
            <StudentJobApply />
          </PublicRoute>
        }
      />
      <Route
        path='/student/invitation'
        element={
          <PublicRoute>
            <StudentInvitation />
          </PublicRoute>
        }
      />
      <Route
        path='/student/competency-profile'
        element={
          <PublicRoute>
            <StudentCompetencyProfile />
          </PublicRoute>
        }
      />
      <Route
        path='/student/certification'
        element={
          <PublicRoute>
            <StudentCertification />
          </PublicRoute>
        }
      />
      <Route
        path='/student/certification/upload'
        element={
          <PublicRoute>
            <StudentCertificationUpload />
          </PublicRoute>
        }
      />
      <Route
        path='/student/certification/:certId'
        element={
          <PublicRoute>
            <StudentCertificationDetail />
          </PublicRoute>
        }
      />
      <Route
        path='/student/certification/:certId/denied'
        element={
          <PublicRoute>
            <StudentCertificationDenied />
          </PublicRoute>
        }
      />
      <Route
        path='/student/notification'
        element={
          <PublicRoute>
            <StudentNotification />
          </PublicRoute>
        }
      />
      <Route
        path='/student/help'
        element={
          <PublicRoute>
            <StudentHelp />
          </PublicRoute>
        }
      />
    </Routes>
  )
}

export default AppRouter
