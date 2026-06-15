import { Routes, Route, Navigate } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import LandingPage from '../pages/LandingPage.page'
import LoginPage from '../pages/LoginPage.page'
import AdminDashboard from '../pages/admin/AdminDashboard.page'
import UniversityDashboard from '../pages/university/UniversityDashboard.page'
import CompanyDashboard from '../pages/company/CompanyDashboard.page'
import UniversityStaffDashboard from '../pages/university_staff/UniversityStaffDashboard.page'
import CompanyStaffDashboard from '../pages/company_staff/CompanyStaffDashboard.page'
import StudentDashboard from '../pages/student/StudentDashboard.page'
import StudentJobMatching from '../pages/student/StudentJobMatching.page'
import StudentJobApply from '../pages/student/StudentJobApply.page'
import StudentCompetencyProfile from '../pages/student/StudentCompetencyProfile.page'
import StudentNotification from '../pages/student/StudentNotification.page'
import StudentHelp from '../pages/student/StudentHelp.page'

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
        path='/student/job-apply'
        element={
          <PublicRoute>
            <StudentJobApply />
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
