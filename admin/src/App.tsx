import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/reactQuery';
import { AdminLayout } from './features/admin/AdminLayout';
import { DashboardOverview } from './features/admin/DashboardOverview';
import { ContentManager } from './features/admin/ContentManager';
import { ProductManager } from './features/admin/ProductManager';
import { MediaManager } from './features/admin/MediaManager';
import { InquiryManager } from './features/admin/InquiryManager';
import { SettingsManager } from './features/admin/SettingsManager';
import { Login } from './features/admin/Login';

// Protected Route Guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication */}
          <Route path="/login" element={<Login />} />

          {/* Standalone Admin Workspace (Protected) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="inquiries" element={<InquiryManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
