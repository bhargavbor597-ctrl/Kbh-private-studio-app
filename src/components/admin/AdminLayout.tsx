import React, { useState } from 'react';
import { useRouter, Link } from '../../context/RouterContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import {
  LayoutDashboard,
  Smartphone,
  Gamepad2,
  Palette,
  Home,
  Layers,
  Layout,
  Menu,
  Image as ImageIcon,
  Sliders,
  FileText,
  Mail,
  MessageSquare,
  LifeBuoy,
  Globe,
  ShieldCheck,
  Settings,
  Database,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  X,
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { path, navigate } = useRouter();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navSections = [
    {
      group: 'Overview & Catalogs',
      items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'Apps Management', href: '/admin/apps', icon: Smartphone },
        { label: 'Games Management', href: '/admin/games', icon: Gamepad2 },
      ],
    },
    {
      group: 'Theme & Design',
      items: [
        { label: 'Theme & Appearance', href: '/admin/theme', icon: Palette },
        { label: 'Homepage Editor', href: '/admin/homepage', icon: Home },
        { label: 'Page & Section Editor', href: '/admin/pages', icon: Layers },
        { label: 'Header & Footer Editor', href: '/admin/header-footer', icon: Layout },
        { label: 'Navigation & Menus', href: '/admin/navigation', icon: Menu },
      ],
    },
    {
      group: 'Content & Media',
      items: [
        { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
        { label: 'Website Content', href: '/admin/content', icon: Sliders },
        { label: 'Legal & Policies', href: '/admin/legal', icon: FileText },
      ],
    },
    {
      group: 'Operations & Settings',
      items: [
        { label: 'Contact Settings', href: '/admin/contact-info', icon: Mail },
        { label: 'Contact Messages', href: '/admin/messages', icon: MessageSquare },
        { label: 'Support Tickets', href: '/admin/support', icon: LifeBuoy },
        { label: 'SEO Settings', href: '/admin/seo', icon: Globe },
        { label: 'app-ads.txt Manager', href: '/admin/app-ads', icon: ShieldCheck },
        { label: 'Website Settings', href: '/admin/settings', icon: Settings },
        { label: 'Backup & Restore', href: '/admin/backup', icon: Database },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin' && path === '/admin') return true;
    if (href !== '/admin' && path.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 h-screen sticky top-0 overflow-hidden">
        {/* Admin Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-sm">
              <span>KHB</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white leading-tight truncate">
                Admin Console
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold block truncate">
                KHB Private Limited
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items grouped */}
        <nav className="flex-1 p-3.5 space-y-4 overflow-y-auto scrollbar-thin">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                {sec.group}
              </span>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    id={`admin-nav-${item.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Info & Actions */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {user?.email}
            </p>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="p-1.5 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            KHB
          </div>
          <span className="font-bold text-sm">Admin Console</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 rounded-lg"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-3 max-h-[80vh] overflow-y-auto">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
                {sec.group}
              </span>
              {sec.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                    isActive(item.href)
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}

          <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-xs text-indigo-600 font-semibold">
              Visit Public Website
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-red-600 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
