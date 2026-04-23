import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PremiumWelcome from './screens/PremiumWelcome';
import PremiumHome from './screens/PremiumHome';
import PremiumLogin from './screens/PremiumLogin';
import PremiumRegister from './screens/PremiumRegister';
import PremiumForgotPassword from './screens/PremiumForgotPassword';
import PremiumDashboard from './screens/PremiumDashboard';
import PremiumSchedule from './screens/PremiumSchedule';
import PremiumPlans from './screens/PremiumPlans';
import PremiumVideoGallery from './screens/PremiumVideoGallery';
import PremiumInstructorProfile from './screens/PremiumInstructorProfile';
import PremiumPhotoGallery from './screens/PremiumPhotoGallery';
import PremiumNotifications from './screens/PremiumNotifications';
import PremiumNotificationSettings from './screens/PremiumNotificationSettings';
import PremiumChangePassword from './screens/PremiumChangePassword';
import PremiumPaymentSuccess from './screens/PremiumPaymentSuccess';
import PremiumVideoUpload from './screens/PremiumVideoUpload';
import PremiumAdminDashboard from './screens/PremiumAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './screens/AuthCallback';
import PremiumAssetManagement from './screens/PremiumAssetManagement';
import PremiumAdminStudents from './screens/PremiumAdminStudents';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PremiumHome />} />
          <Route path="/welcome" element={<PremiumWelcome />} />
          <Route path="/login" element={<PremiumLogin />} />
          <Route path="/register" element={<PremiumRegister />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/forgot-password" element={<PremiumForgotPassword />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PremiumDashboard />
            </ProtectedRoute>
          } />
          <Route path="/schedule" element={<PremiumSchedule />} />
          <Route path="/plans" element={<PremiumPlans />} />
          <Route path="/videos" element={<PremiumVideoGallery />} />
          <Route path="/gallery" element={<PremiumPhotoGallery />} />
          <Route path="/instructor" element={<PremiumInstructorProfile />} />
          <Route path="/notifications" element={<PremiumNotifications />} />
          <Route path="/settings" element={<PremiumNotificationSettings />} />
          <Route path="/change-password" element={<PremiumChangePassword />} />
          <Route path="/payment-success" element={<PremiumPaymentSuccess />} />
          <Route path="/upload-video" element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <PremiumVideoUpload />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PremiumAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/assets" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PremiumAssetManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PremiumAdminStudents />
            </ProtectedRoute>
          } />
          {/* Fallback to welcome if not logged in (logic would go here in real app) */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
