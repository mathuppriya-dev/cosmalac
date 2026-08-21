import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

        {/* Public Storefront Routes */}
        <Routes>
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
