import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PersonnelLogin from './pages/PersonnelLogin'
import StaffLogin from './pages/StaffLogin';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding from './pages/Onboarding';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AuthProvider, useAuth } from './AuthContext';
import OnboardingForm from './pages/OnboardingForm';
import PersonnelSelection from './pages/PersonnelSelection';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!role) {
    console.log('No role, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  return (
   <div className="flex min-h-screen">
      {/* Sidebar (visible on all screens) */}
      <Sidebar />
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        {/* Page content */}
        <main className="flex-1 p-4 bg-[#FCEEE9] sm:p-6 lg:p-8 mt-[35px] ml-[2px] collapsed:ml-[60px]">
          <Outlet /> {/* Renders Home, Onboarding, etc. */}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Routes with Header and Sidebar */}
        <Route element={<MainLayout />}>
           <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
              <Route
              path="/onboarding-form"
              element={
                  <OnboardingForm/>
              }
            />
            <Route
              path="/personnel-selection"
              element={
                <ProtectedRoute>
                  <PersonnelSelection />
                </ProtectedRoute>
              }
            />
        </Route>
        {/* Routes without Header and Sidebar */}
        <Route path="/login" element={<PersonnelLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
              path="/可可入职用户入门指南"
              element={
                <ProtectedRoute>
                  <Onboarding/>
                </ProtectedRoute>
              }
            />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;