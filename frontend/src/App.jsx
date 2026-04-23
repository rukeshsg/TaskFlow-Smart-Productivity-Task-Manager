import { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

// Lazy-loaded pages
const AuthPage      = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CalendarPage  = lazy(() => import('./pages/CalendarPage'));
const ProfilePage   = lazy(() => import('./pages/ProfilePage'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[200px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-9 h-9 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-xs text-slate-500 font-medium">Loading...</p>
    </div>
  </div>
);

// Full authenticated layout — TaskProvider wraps ALL protected pages here (once!)
const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <TaskProvider>
      <div className="flex h-screen overflow-hidden bg-surface-950">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />

        <div
          className="flex flex-col flex-1 min-w-0 overflow-hidden transition-[margin] duration-300 ease-in-out"
          style={{ marginLeft: sidebarOpen ? 240 : 72 }}>
          <Topbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"         element={<DashboardPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/profile"  element={<ProfilePage />} />
                <Route path="*"         element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </TaskProvider>
  );
};

// Guard: shows loading spinner, then redirects if not authed
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Restoring session...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" replace />;
};

// Guard: redirects logged-in users away from /auth
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <AuthPage />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="bottom-right"
          gutter={10}
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: 500,
              padding: '12px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#0f172a' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#0f172a' } },
            loading: { iconTheme: { primary: '#818cf8', secondary: '#0f172a' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
