import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { SEO } from '../components/SEO';

export const NotFound = () => {
  return (
    <>
      <SEO title="Page Not Found (404)" description="The skincare page you are searching for does not exist." />
      <div className="max-w-md mx-auto px-4 py-24 text-center font-body space-y-6">
        <ShieldAlert size={60} className="text-rose-gold mx-auto animate-pulse" />
        <h1 className="text-3xl font-extrabold font-heading text-text-primary">Page Not Found</h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          The formulation page, article, or resource you are looking for has been moved or is unavailable.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="px-6 py-3 bg-text-primary text-bg-primary text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-rose-gold transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
