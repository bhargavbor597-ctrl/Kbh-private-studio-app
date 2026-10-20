import React, { useEffect, useState } from 'react';
import { AppItem, SiteSettings, PageContent } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Link } from '../../context/RouterContext.tsx';
import { AppCard } from '../../components/ui/AppCard.tsx';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Smartphone,
  Gamepad2,
  CheckCircle2,
  Layers,
  ChevronRight,
  Lock,
  ExternalLink,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [appsRes, settingsRes, contentRes] = await Promise.all([
          api.getPublicApps(),
          api.getSettings(),
          api.getPageContent(),
        ]);
        if (appsRes.success) setApps(appsRes.apps);
        if (settingsRes.success) setSettings(settingsRes.settings);
        if (contentRes.success) setContent(contentRes.content);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredApps = apps.filter((a) => a.featured);
  const latestApps = apps.slice(0, 6);
  const publishedCount = apps.filter((a) => a.status === 'Published').length;
  const comingSoonCount = apps.filter((a) => a.status === 'Coming Soon').length;

  const orgName = settings?.organizationName || 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED';
  const brandName = settings?.brandName || 'KHB Private Limited';
  const tagline = settings?.tagline || 'Building Useful Apps and Digital Experiences';
  const description =
    settings?.description ||
    'We create useful mobile applications and engaging games designed to provide simple, practical and enjoyable digital experiences.';

  const home = content?.homeContent;

  const categories = [
    { name: 'Productivity', count: apps.filter((a) => a.category === 'Productivity').length, icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
    { name: 'Utilities', count: apps.filter((a) => a.category === 'Utilities').length, icon: Smartphone, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
    { name: 'Games', count: apps.filter((a) => a.category === 'Games').length, icon: Gamepad2, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
    { name: 'Tools', count: apps.filter((a) => a.category === 'Tools').length, icon: Layers, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
  ];

  // Helper to render button safely
  const renderButton = (btn?: { text: string; url: string; visible: boolean }, isPrimary = true, idPrefix = '') => {
    if (!btn || btn.visible === false) return null;
    const isExternal = btn.url.startsWith('http://') || btn.url.startsWith('https://');

    const className = isPrimary
      ? 'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20 transition-all'
      : 'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all shadow-xs';

    if (isExternal) {
      return (
        <a
          href={btn.url}
          target="_blank"
          rel="noreferrer"
          id={`${idPrefix}-cta`}
          className={className}
        >
          <span>{btn.text}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      );
    }

    return (
      <Link to={btn.url || '/'} id={`${idPrefix}-cta`} className={className}>
        <span>{btn.text}</span>
        {isPrimary && <ArrowRight className="w-5 h-5" />}
      </Link>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Organization Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              <span>{home?.hero.badge || orgName}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] mb-6">
              {home?.hero.heading || tagline}
            </h1>

            {/* Short Description */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
              {home?.hero.description || description}
            </p>

            {/* Optional Hero Visual Image if uploaded */}
            {home?.hero.heroImage && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg max-w-xl mx-auto">
                <img
                  src={home.hero.heroImage}
                  alt={home.hero.heading}
                  className="w-full h-auto object-cover max-h-72"
                />
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {renderButton(
                home?.hero.primaryButton || { text: 'Explore Our Apps', url: '/apps', visible: true },
                true,
                'hero-explore-apps'
              )}
              {renderButton(
                home?.hero.secondaryButton || { text: 'Contact Support', url: '/support', visible: true },
                false,
                'hero-support'
              )}
            </div>
          </div>

          {/* Simple Statistics Strip */}
          {(!home || home.stats.enabled !== false) && (
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center shadow-xs">
                <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">
                  {loading ? '...' : publishedCount}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {home?.stats.stat1Label || 'Published Apps'}
                </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center shadow-xs">
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
                  {loading ? '...' : comingSoonCount}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {home?.stats.stat2Label || 'Coming Soon'}
                </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center shadow-xs">
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
                  {home?.stats.stat3Value || '4+'}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {home?.stats.stat3Label || 'Categories'}
                </div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center shadow-xs">
                <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mb-1">
                  {home?.stats.stat4Value || '100%'}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {home?.stats.stat4Label || 'Privacy-Focused'}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. FEATURED APPS SECTION */}
      {featuredApps.length > 0 && (!home || home.featuredSection.enabled !== false) && (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>{home?.featuredSection.badge || 'Featured Releases'}</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {home?.featuredSection.title || 'Our Top Applications'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                {home?.featuredSection.subtitle ||
                  'Handpicked mobile tools and experiences built with performance, security, and intuitive design in mind.'}
              </p>
            </div>
            {(!home?.featuredSection.viewAllButton || home.featuredSection.viewAllButton.visible !== false) && (
              <Link
                to={home?.featuredSection.viewAllButton?.url || '/apps'}
                id="view-all-featured-cta"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
              >
                <span>{home?.featuredSection.viewAllButton?.text || 'View All Apps'}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApps.map((app) => (
              <AppCard key={app.id} app={app} featuredHighlight />
            ))}
          </div>
        </section>
      )}

      {/* 3. CATEGORIES SHOWCASE */}
      {(!home || home.categoriesSection.enabled !== false) && (
        <section className="py-12 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {home?.categoriesSection.title || 'Explore by Category'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {home?.categoriesSection.subtitle || 'Find software crafted for everyday efficiency and recreation.'}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    to={`/apps?category=${encodeURIComponent(cat.name)}`}
                    id={`cat-card-${cat.name.toLowerCase()}`}
                    className="group flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-800/60 hover:shadow-md transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${cat.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {cat.count} {cat.count === 1 ? 'Application' : 'Applications'}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. LATEST APPS SECTION */}
      {(!home || home.latestSection.enabled !== false) && (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {home?.latestSection.title || 'Latest Published Apps'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                {home?.latestSection.subtitle ||
                  'Discover our newest additions to Google Play and upcoming digital tools.'}
              </p>
            </div>
            {(!home?.latestSection.viewAllButton || home.latestSection.viewAllButton.visible !== false) && (
              <Link
                to={home?.latestSection.viewAllButton?.url || '/apps'}
                id="explore-all-apps-cta"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
              >
                <span>{home?.latestSection.viewAllButton?.text || 'See Complete Directory'}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>
      )}

      {/* 5. WHY CHOOSE OUR APPS */}
      {(!home || home.whyChooseSection.enabled !== false) && (
        <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {home?.whyChooseSection.title || 'Why Users Choose Our Apps'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {home?.whyChooseSection.subtitle ||
                  'We design mobile software with a laser focus on speed, user privacy, and dependable utility.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(home?.whyChooseSection.items || [
                {
                  title: 'Privacy By Design',
                  description: 'Zero intrusive personal tracking. Our apps store your sensitive notes, expenses, and settings safely on your physical device.',
                  icon: 'Lock',
                },
                {
                  title: 'Lightweight & Fast',
                  description: 'Optimized APK sizes and rapid launch times. Engineered to conserve battery and run smoothly on modern and budget devices alike.',
                  icon: 'Zap',
                },
                {
                  title: '100% Offline Capable',
                  description: 'Core features work seamlessly without an active internet connection. Perfect for commutes, flights, and low-connectivity regions.',
                  icon: 'Smartphone',
                },
                {
                  title: 'Minimal Permissions',
                  description: "We only request permissions essential to the application's explicit features. Transparent explanations provided in every app.",
                  icon: 'ShieldCheck',
                },
              ]).map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                    {idx === 0 ? (
                      <Lock className="w-5 h-5 text-emerald-600" />
                    ) : idx === 1 ? (
                      <Zap className="w-5 h-5 text-indigo-600" />
                    ) : idx === 2 ? (
                      <Smartphone className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. ABOUT THE ORGANIZATION SUMMARY */}
      {(!home || home.aboutSummarySection.enabled !== false) && (
        <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl relative overflow-hidden">
            <div className="max-w-3xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 mb-6">
                <span>{home?.aboutSummarySection.badge || 'About Organization'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                {home?.aboutSummarySection.title || orgName}
              </h2>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8">
                {home?.aboutSummarySection.description ||
                  `Operating under the consumer brand ${brandName}, our engineering organization is dedicated to creating accessible mobile tools, productivity software, and interactive games. We adhere strictly to Google Play developer standards and respect customer digital rights.`}
              </p>
              <div className="flex flex-wrap gap-4">
                {home?.aboutSummarySection.primaryButton.visible !== false && (
                  <Link
                    to={home?.aboutSummarySection.primaryButton.url || '/about'}
                    id="about-org-learn-more"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white text-slate-950 hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    <span>{home?.aboutSummarySection.primaryButton.text || 'Read Full Company Profile'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                {home?.aboutSummarySection.secondaryButton.visible !== false && (
                  <Link
                    to={home?.aboutSummarySection.secondaryButton.url || '/support'}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <span>{home?.aboutSummarySection.secondaryButton.text || 'Help & Support Center'}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. SUPPORT CTA */}
      {(!home || home.ctaSection.enabled !== false) && (
        <section className="py-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              {home?.ctaSection.title || 'Have a question or need technical support?'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              {home?.ctaSection.subtitle ||
                'Whether you need help with an app or want to suggest a new feature, our support team is here to assist you.'}
            </p>
            <div className="flex items-center justify-center gap-4">
              {home?.ctaSection.primaryButton.visible !== false && (
                <Link
                  to={home?.ctaSection.primaryButton.url || '/support'}
                  id="cta-submit-ticket"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                >
                  <span>{home?.ctaSection.primaryButton.text || 'Submit Support Request'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {home?.ctaSection.secondaryButton.visible !== false && (
                <Link
                  to={home?.ctaSection.secondaryButton.url || '/contact'}
                  id="cta-contact-form"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <span>{home?.ctaSection.secondaryButton.text || 'Contact Us'}</span>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
