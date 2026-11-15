import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

// Layouts
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';

// Public Pages
import { HomePage } from './pages/public/HomePage.tsx';
import { OurAppsPage } from './pages/public/OurAppsPage.tsx';
import { AppDetailPage } from './pages/public/AppDetailPage.tsx';
import { AppPrivacyPage } from './pages/public/AppPrivacyPage.tsx';
import { AboutPage } from './pages/public/AboutPage.tsx';
import { SupportPage } from './pages/public/SupportPage.tsx';
import { ContactPage } from './pages/public/ContactPage.tsx';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage.tsx';
import { TermsPage } from './pages/public/TermsPage.tsx';
import { NotFoundPage } from './pages/public/NotFoundPage.tsx';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';
import { AdminAppsListPage } from './pages/admin/AdminAppsListPage.tsx';
import { AdminGamesListPage } from './pages/admin/AdminGamesListPage.tsx';
import { AdminAppFormPage } from './pages/admin/AdminAppFormPage.tsx';
import { AdminThemePage } from './pages/admin/AdminThemePage.tsx';
import { AdminContactInfoPage } from './pages/admin/AdminContactInfoPage.tsx';
import { AdminMediaLibraryPage } from './pages/admin/AdminMediaLibraryPage.tsx';
import { AdminNavigationPage } from './pages/admin/AdminNavigationPage.tsx';
import { AdminSeoPage } from './pages/admin/AdminSeoPage.tsx';
import { AdminAppAdsPage } from './pages/admin/AdminAppAdsPage.tsx';
import { AdminBackupPage } from './pages/admin/AdminBackupPage.tsx';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage.tsx';
import { AdminSupportPage } from './pages/admin/AdminSupportPage.tsx';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.tsx';
import { AdminLegalPage } from './pages/admin/AdminLegalPage.tsx';
import { AdminContentManagementPage } from './pages/admin/AdminContentManagementPage.tsx';

const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { navigate } = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Verifying administrator session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

const AppContent: React.FC = () => {
  const { path } = useRouter();
  const cleanPath = path.length > 1 ? path.replace(/\/+$/, '') : path;

  // 1. Admin Authentication Route
  if (cleanPath === '/admin/login') {
    return <AdminLoginPage />;
  }

  // 2. Admin Routes (Protected)
  if (cleanPath.startsWith('/admin')) {
    let adminComponent = <AdminDashboardPage />;

    if (cleanPath === '/admin/apps') {
      adminComponent = <AdminAppsListPage />;
    } else if (cleanPath === '/admin/games') {
      adminComponent = <AdminGamesListPage />;
    } else if (cleanPath === '/admin/apps/new') {
      adminComponent = <AdminAppFormPage />;
    } else if (cleanPath.startsWith('/admin/apps/edit/')) {
      adminComponent = <AdminAppFormPage />;
    } else if (cleanPath === '/admin/theme') {
      adminComponent = <AdminThemePage />;
    } else if (cleanPath === '/admin/homepage') {
      adminComponent = <AdminContentManagementPage initialTab="home" />;
    } else if (cleanPath === '/admin/pages') {
      adminComponent = <AdminContentManagementPage initialTab="about" />;
    } else if (cleanPath === '/admin/header-footer') {
      adminComponent = <AdminContentManagementPage initialTab="footer" />;
    } else if (cleanPath === '/admin/contact-info') {
      adminComponent = <AdminContactInfoPage />;
    } else if (cleanPath === '/admin/media') {
      adminComponent = <AdminMediaLibraryPage />;
    } else if (cleanPath === '/admin/navigation') {
      adminComponent = <AdminNavigationPage />;
    } else if (cleanPath === '/admin/seo') {
      adminComponent = <AdminSeoPage />;
    } else if (cleanPath === '/admin/app-ads') {
      adminComponent = <AdminAppAdsPage />;
    } else if (cleanPath === '/admin/backup') {
      adminComponent = <AdminBackupPage />;
    } else if (cleanPath === '/admin/content') {
      adminComponent = <AdminContentManagementPage />;
    } else if (cleanPath === '/admin/messages') {
      adminComponent = <AdminMessagesPage />;
    } else if (cleanPath === '/admin/support') {
      adminComponent = <AdminSupportPage />;
    } else if (cleanPath === '/admin/settings') {
      adminComponent = <AdminSettingsPage />;
    } else if (cleanPath === '/admin/legal') {
      adminComponent = <AdminLegalPage />;
    }

    return <AdminRouteGuard>{adminComponent}</AdminRouteGuard>;
  }

  // 3. Public Routes
  let publicComponent = <NotFoundPage />;

  if (cleanPath === '/') {
    publicComponent = <HomePage />;
  } else if (cleanPath === '/apps') {
    publicComponent = <OurAppsPage />;
  } else if (cleanPath.startsWith('/apps/') && cleanPath.endsWith('/privacy')) {
    publicComponent = <AppPrivacyPage />;
  } else if (cleanPath.startsWith('/apps/') && cleanPath.split('/').length === 3) {
    publicComponent = <AppDetailPage />;
  } else if (cleanPath === '/about') {
    publicComponent = <AboutPage />;
  } else if (cleanPath === '/support') {
    publicComponent = <SupportPage />;
  } else if (cleanPath === '/contact') {
    publicComponent = <ContactPage />;
  } else if (cleanPath === '/privacy-policy') {
    publicComponent = <PrivacyPolicyPage />;
  } else if (cleanPath === '/terms') {
    publicComponent = <TermsPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">{publicComponent}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </RouterProvider>
    </ThemeProvider>
  );
}
