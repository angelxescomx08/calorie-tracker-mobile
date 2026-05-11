import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AuthProvider } from '@/presentation/context/AuthContext'
import { AppLayout } from '@/presentation/layouts/AppLayout'
import { AuthLayout } from '@/presentation/layouts/AuthLayout'
import { ProtectedRoute } from '@/presentation/components/ProtectedRoute'
import { LoginPage } from '@/presentation/pages/auth/LoginPage'
import { RegisterPage } from '@/presentation/pages/auth/RegisterPage'
import { DashboardPage } from '@/presentation/pages/DashboardPage'
import { DiaryPage } from '@/presentation/pages/DiaryPage'
import { ExercisePage } from '@/presentation/pages/ExercisePage'
import { GoalsPage } from '@/presentation/pages/GoalsPage'
import { ProfilePage } from '@/presentation/pages/ProfilePage'
import { ProgressPage } from '@/presentation/pages/ProgressPage'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/exercise" element={<ExercisePage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
