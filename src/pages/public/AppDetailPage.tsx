import React, { useEffect, useState } from 'react';
import { AppItem, PageContent } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useRouter, Link } from '../../context/RouterContext.tsx';
import { ImageLightbox } from '../../components/ui/ImageLightbox.tsx';
import {
  Play,
  Shield,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Mail,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Smartphone,
  Info,
  Key,
} from 'lucide-react';

export const AppDetailPage: React.FC = () => {
  const { path } = useRouter();
  // Extract slug from /apps/:slug
  const slug = path.replace('/apps/', '').split('/')[0];

  const [app, setApp] = useState<AppItem | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lightbox state for screenshots
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // FAQ accordion state
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({ 0: true });

  useEffect(() => {
    async function loadApp() {
      if (!slug) return;
      try {
        const [appRes, contentRes] = await Promise.all([
          api.getAppBySlug(slug),
          api.getPageContent(),
        ]);
        if (appRes.success && appRes.app) {
          setApp(appRes.app);
        } else {
          setError('App not found');
        }
        if (contentRes.success && contentRes.content) {
          setContent(contentRes.content);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load app');
      } finally {
        setLoading(false);
      }
    }
    loadApp();
  }, [slug]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const tpl = content?.appDetailPage;

  if (loading) {
    return (
      <div className="min-h-screen py-20 max-w-5xl mx-auto px-4">
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen py-24 max-w-lg mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Not Found</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          The requested application could not be found or may have been unpublished.
        </p>
        <Link
          to="/apps"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{tpl?.backButtonText || 'Back to All Apps'}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-8">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white">
          Home
        </Link>
        <span>/</span>
        <Link to="/apps" className="hover:text-slate-900 dark:hover:text-white">
          {tpl?.backButtonText || 'Our Apps'}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px]">
          {app.name}
        </span>
      </div>

      {/* Main Header Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 mb-10 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-8">
          {/* App Icon */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md shrink-0">
            <img
              src={app.icon}
              alt={`${app.name} App Icon`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Details & Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                {app.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {app.platform || 'Android'}
              </span>
              {app.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              )}
              {app.status === 'Coming Soon' ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                  Coming Soon
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                  Published
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {app.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {app.shortDescription}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              {app.version && (
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Version: </span>
                  <span>{app.version}</span>
                </div>
              )}
              {app.appType && (
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Type: </span>
                  <span>{app.appType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            {app.playStoreUrl ? (
              <a
                href={app.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="app-detail-play-store-cta"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{tpl?.playStoreButtonLabel || 'Get on Google Play'}</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            ) : (
              <div className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span>Google Play Release In Progress</span>
              </div>
            )}

            <Link
              to={`/apps/${app.slug}/privacy`}
              id="app-detail-privacy-cta"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>App Privacy Policy</span>
            </Link>

            <Link
              to={`/support?app=${encodeURIComponent(app.name)}`}
              id="app-detail-support-cta"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Get Support for this App</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Screenshots Gallery Section */}
      {app.screenshots && app.screenshots.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            {tpl?.screenshotsTitle || 'Screenshots & Interface'}
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {app.screenshots.map((shot, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActivePhotoIndex(idx);
                  setLightboxOpen(true);
                }}
                className="group relative shrink-0 w-60 sm:w-72 aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 cursor-pointer shadow-xs hover:shadow-lg transition-all"
              >
                <img
                  src={shot}
                  alt={`${app.name} preview ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-xs font-semibold text-white bg-slate-950/60 px-3 py-1.5 rounded-lg backdrop-blur-xs transition-opacity">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two Column Content: Description & Features / Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        {/* Left Column (2 cols): Full Description & Key Features */}
        <div className="lg:col-span-2 space-y-10">
          {/* About This App */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              About {app.name}
            </h2>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {app.fullDescription || app.shortDescription}
            </div>
          </div>

          {/* Key Features */}
          {app.features && app.features.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>{tpl?.featuresTitle || 'Key Features'}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {app.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {app.faq && app.faq.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>{tpl?.faqTitle || 'Frequently Asked Questions'}</span>
              </h2>
              <div className="space-y-3">
                {app.faq.map((item, idx) => {
                  const isOpen = !!openFaqIndices[idx];
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Permissions, Privacy, Support */}
        <div className="space-y-6">
          {/* Permissions Transparency */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{tpl?.permissionsTitle || 'Device Permissions'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              We practice minimal permission usage. Below are the permissions requested by this application:
            </p>
            {app.permissions && app.permissions.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {app.permissions.map((perm, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                No sensitive device permissions required.
              </p>
            )}
          </div>

          {/* Privacy Guarantee Card */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Privacy & Data Security</span>
            </div>
            <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed mb-4">
              {app.privacyPolicy ||
                'This application does not transmit or monetize your personal files, notes, or credentials.'}
            </p>
            <Link
              to={`/apps/${app.slug}/privacy`}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Read Full App Privacy Policy</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Need Support Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {tpl?.supportSectionTitle || 'Need Assistance With This App?'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              {tpl?.supportSectionDescription ||
                `If you experience any crashes or have suggestions for ${app.name}, reach out directly to our engineering support.`}
            </p>
            <Link
              to={`/support?app=${encodeURIComponent(app.name)}`}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <span>Submit Ticket for {app.name}</span>
            </Link>
          </div>

          {/* Trademark Disclaimer */}
          <p className="text-[11px] text-slate-400 text-center leading-normal">
            {tpl?.disclaimerText || 'Google Play and the Google Play logo are trademarks of Google LLC.'}
          </p>
        </div>
      </div>

      {/* Lightbox for Screenshots */}
      <ImageLightbox
        isOpen={lightboxOpen}
        images={app.screenshots || []}
        currentIndex={activePhotoIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() =>
          setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : (app.screenshots?.length || 1) - 1))
        }
        onNext={() =>
          setActivePhotoIndex((prev) => (prev < (app.screenshots?.length || 1) - 1 ? prev + 1 : 0))
        }
      />
    </div>
  );
};
