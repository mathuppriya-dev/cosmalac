import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, MailOpen, BookOpen, Settings, LogOut, Heart } from 'lucide-react';
import { SEO } from '../../components/SEO';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const adminEmail = localStorage.getItem('user_email') || 'admin@cosmalac.com';
  const adminRole = localStorage.getItem('user_role') || 'SuperAdmin';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MailOpen },
    { name: 'Science Blog', path: '/admin/blog', icon: BookOpen },
    { name: 'CMS Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <>
      <SEO title="Control Center Dashboard" description="Admin administration dashboard panel." />

      <div className="min-h-screen bg-bg-primary/50 flex font-body">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-border-pink flex flex-col justify-between flex-shrink-0 text-left">
          <div className="p-6 space-y-8">
            {/* Logo */}
            <Link to="/" className="flex flex-col">
              <span className="text-xl font-bold tracking-widest text-text-primary font-heading">
                COSMALAC
              </span>
              <span className="text-[8px] tracking-[0.3em] uppercase text-text-secondary -mt-1 font-body">
                Control Panel
              </span>
            </Link>

            {/* Profile Info */}
            <div className="p-4 bg-bg-secondary/60 rounded-2xl border border-border-pink/40 space-y-1">
              <p className="text-[10px] text-muted uppercase font-bold tracking-wide">Connected</p>
              <p className="text-xs font-semibold text-text-primary truncate">{adminEmail}</p>
              <span className="px-2 py-0.5 bg-rose-gold text-white text-[9px] font-bold uppercase rounded-full inline-block">
                {adminRole}
              </span>
            </div>

            {/* Menus */}
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-rose-gold text-white shadow-sm'
                        : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-border-pink/60 space-y-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold tracking-wide transition-colors"
            >
              <LogOut size={16} />
              Log Out Session
            </button>
            
            <p className="text-[9px] text-text-secondary text-center flex items-center justify-center gap-1">
              COSMALAC CMS v1.0 <Heart size={8} className="text-rose-gold fill-rose-gold" />
            </p>
          </div>
        </aside>

        {/* Content Box */}
        <main className="flex-grow p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
