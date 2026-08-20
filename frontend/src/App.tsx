import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/reactQuery';

// Layouts & Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import { SkipLink } from './components/Accessibility';

// Public Pages / Features
import Home from './features/home/Home';
import Products from './features/products/Products';
import ProductDetails from './features/products/ProductDetails';
import B2BTrade from './features/b2b/B2BTrade';
import Contact from './features/contact/Contact';
import About from './pages/About';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

// Admin CMS Features
import Login from './features/admin/Login';
import AdminLayout from './features/admin/AdminLayout';
import DashboardOverview from './features/admin/DashboardOverview';
import ContentManager from './features/admin/ContentManager';
import ProductManager from './features/admin/ProductManager';
import MediaManager from './features/admin/MediaManager';
import InquiryManager from './features/admin/InquiryManager';
import SettingsManager from './features/admin/SettingsManager';

// Authentication Guard helper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

// Scroll to top on navigation helper
const ScrollToTopWrapper = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

// Public Layout Container
const PublicLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main-content" className={`flex-grow ${isHomePage ? '' : 'pt-20'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/b2b" element={<B2BTrade />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Dynamic global additions */}
        <ScrollProgress />
        <SkipLink />

        {/* Scroll restoration */}
        <ScrollToTopWrapper />

        <Routes>
          {/* Public Frontend Routes */}
          <Route path="/*" element={<PublicLayout />} />

          {/* Secure Admin Dashboard Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="inquiries" element={<InquiryManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
