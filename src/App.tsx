import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ApplyLeave } from './pages/ApplyLeave';
import { LeaveHistory } from './pages/LeaveHistory';
import { LeaveRequests } from './pages/LeaveRequests';
import { Outlets } from './pages/Outlets';
import { Employees } from './pages/Employees';
import { Managers } from './pages/Managers';
import { SignupRequests } from './pages/SignupRequests';
import { Reports } from './pages/Reports';
import { Team } from './pages/Team';
import { LoadingSpinner } from './components/UI';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center shell-pattern">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    default:
      return <EmployeeDashboard />;
  }
};

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center shell-pattern">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/apply-leave" 
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <ApplyLeave />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/leave-history" 
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <LeaveHistory />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/leave-requests" 
        element={
          <ProtectedRoute allowedRoles={['manager', 'admin']}>
            <LeaveRequests />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/team" 
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Team />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/outlets" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Outlets />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/employees" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Employees />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/managers" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Managers />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/signup-requests" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SignupRequests />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </ProtectedRoute>
        } 
      />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
