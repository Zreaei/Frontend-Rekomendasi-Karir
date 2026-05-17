import { Routes, Route, Navigate } from 'react-router-dom'

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Navigate to='/landing' replace />
        }
      />
    </Routes>
  )
}

export default AppRouter