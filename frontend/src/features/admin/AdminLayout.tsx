import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  MailOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
  Menu,
  X,
  FileText,
  Image as ImageIcon,
  Command as CommandIcon
} from 'lucide-react';
import CommandPalette from './components/CommandPalette';

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('cosmalac_admin_sidebar_collapsed') === 'true';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const adminEmail = localStorage.getItem('user_email') || 'admin@cosmalac.com';
  const adminRole = localStorage.getItem('user_role') || 'SUPERADMIN';

  useEffect(() => {
    // Ensure dark class is completely purged
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('cosmalac_theme');
  }, []);

  // Save sidebar collapse state
  const toggleSidebar = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    localStorage.setItem('cosmalac_admin_sidebar_collapsed', String(nextState));
  };

  // Keyboard shortcut listener for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, badge: null },
    { name: 'Content & CMS', path: '/admin/content', icon: FileText, badge: 'Live' },
    { name: 'Formulations', path: '/admin/products', icon: ShoppingBag, badge: '2' },
    { name: 'Media Library', path: '/admin/media', icon: ImageIcon, badge: null },
    { name: 'Trade Inquiries', path: '/admin/inquiries', icon: MailOpen, badge: 'Leads' },
    { name: 'Site & WhatsApp', path: '/admin/settings', icon: Settings, badge: null }
  ];

  return (
    <div className="min-h-screen bg-[#F1EFE7] text-[#2D2D2D] flex font-body">
      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onToggleTheme={() => {}}
        isDarkMode={false}
      />

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between transition-all duration-300 ease-in-out border-r z-30 sticky top-0 h-screen bg-white border-[#D8D2C8] shadow-xs ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top Header & Navigation */}
        <div className="p-4 space-y-6">
          {/* Logo & Collapse Toggle */}
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden group">
              <div className="w-8 h-8 rounded-xl bg-rose-gold text-white flex items-center justify-center font-logo font-bold text-sm shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                C
              </div>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col text-left"
                >
                  <span className="text-lg font-bold tracking-widest text-[#121110] font-logo leading-tight">
                    COSMALAC
                  </span>
                  <span className="text-[8px] tracking-[0.25em] uppercase text-rose-gold font-bold">
                    Control Center
                  </span>
                </motion.div>
              )}
            </Link>

            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-[#57534E] hover:text-[#121110] hover:bg-bg-secondary transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2" aria-label="Admin Navigation">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-[#121110] text-white shadow-sm'
                      : 'text-[#57534E] hover:bg-[#EBE7DC]/60 hover:text-[#121110]'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-rose-gold' : 'text-[#121110]'
                    }`}
                  />

                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between w-full"
                    >
                      <span>{item.name}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-rose-gold text-white'
                              : 'bg-rose-gold/15 text-rose-gold'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Info & Actions */}
        <div className="p-4 space-y-3 border-t border-[#D8D2C8]">
          {!collapsed ? (
            <div className="p-3 bg-[#F1EFE7] rounded-2xl border border-[#D8D2C8] space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wider text-[#57534E]">
                  Logged In
                </span>
                <span className="px-2 py-0.5 bg-rose-gold/15 text-rose-gold text-[9px] font-bold uppercase rounded-full">
                  {adminRole}
                </span>
              </div>
              <p className="text-xs font-bold truncate text-[#121110]">
                {adminEmail}
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title={`${adminEmail} (${adminRole})`}>
              <div className="w-8 h-8 rounded-full bg-rose-gold/20 text-rose-gold flex items-center justify-center text-xs font-bold">
                {adminEmail.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Log Out Session"
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Log Out Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-18 border-b px-4 sm:px-8 flex items-center justify-between gap-4 bg-white/95 border-[#D8D2C8] backdrop-blur-xl">
          {/* Left: Mobile Menu Toggle & Command Palette Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-[#57534E] hover:text-[#121110] hover:bg-bg-secondary transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu size={20} />
            </button>

            {/* Quick Command Palette Trigger Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-3 px-4 py-2 bg-[#F1EFE7] hover:bg-white border border-[#D8D2C8] rounded-2xl text-xs font-semibold text-[#121110] transition-all duration-150 group shadow-2xs"
            >
              <Search size={14} className="text-rose-gold group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Search formulations, actions...</span>
              <span className="sm:hidden">Search...</span>
              <div className="hidden sm:flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white border border-[#D8D2C8] rounded-lg text-[#57534E]">
                <CommandIcon size={10} /> K
              </div>
            </button>
          </div>

          {/* Right: Storefront Link & Profile */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#121110] hover:text-rose-gold transition-colors"
              title="View Public Storefront"
            >
              <ExternalLink size={13} />
              <span>Live Website</span>
            </a>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#D8D2C8]">
              <div className="w-8 h-8 rounded-full bg-rose-gold text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {adminEmail.charAt(0).toUpperCase()}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold leading-tight text-[#121110]">
                  {adminEmail.split('@')[0]}
                </p>
                <p className="text-[9px] uppercase font-bold text-rose-gold">
                  {adminRole}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Route Content */}
        <main id="admin-main-content" className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
