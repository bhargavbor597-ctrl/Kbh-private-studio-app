import React, { useEffect, useState } from 'react';
import { SiteSettings, SEOSettings } from '../../types.ts';
import { api } from '../../services/api.ts';
import { ImageUploader } from '../../components/admin/ImageUploader.tsx';
import {
  Globe,
  Search,
  Share2,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
  FileText,
  Code,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const AdminSeoPage: React.FC = () => {
  const [seo, setSeo] = useState<SEOSettings>({
    metaTitle: 'KHB Private Limited | Official Organization & Android Apps',
    metaDescription: 'Official company and mobile apps publishing website for KHB Private Limited (KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED). Discover reliable productivity tools and casual games.',
    metaKeywords: 'KHB Private Limited, KAMBARIYA-HB, mobile apps, Android apps, Google Play, utility tools, casual games',
    ogImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    twitterCardType: 'summary_large_image',
    canonicalBaseUrl: 'https://khbenterprise.com',
    googleSearchConsoleVerification: '',
    googlePlayDeveloperVerification: 'KHB Private Limited',
    robotsTxtContent: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://khbenterprise.com/sitemap.xml\n`,
    enableStructuredData: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadSeo();
  }, []);

  const loadSeo = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.settings.seo) {
        setSeo(res.settings.seo);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await api.adminUpdateSettings({ seo });
      if (res.success) {
        showNotify('success', 'SEO & metadata configurations published successfully!');
      }
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading SEO configurations...</div>;
  }

  const titleLength = seo.metaTitle.length;
  const descLength = seo.metaDescription.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Search Engines & Social Sharing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            SEO & Social Card Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure Google search titles, snippets, OpenGraph social preview cards, robots.txt, and Search Console verification.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Publish SEO'}</span>
        </button>
      </div>

      {notification && (
        <div
          className={`flex items-center gap-2 p-4 rounded-2xl text-xs font-semibold ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Editable Settings Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Metadata Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600" />
              <span>Core Search Engine Metadata</span>
            </h2>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Global Meta Title (30 - 60 characters)
                </label>
                <span className={`text-[10px] font-mono ${titleLength > 60 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                  {titleLength} / 60
                </span>
              </div>
              <input
                type="text"
                value={seo.metaTitle}
                onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Global Meta Description (120 - 160 characters)
                </label>
                <span className={`text-[10px] font-mono ${descLength > 160 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                  {descLength} / 160
                </span>
              </div>
              <textarea
                rows={3}
                value={seo.metaDescription}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Meta Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={seo.metaKeywords}
                onChange={(e) => setSeo({ ...seo, metaKeywords: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Canonical Base URL
              </label>
              <input
                type="url"
                value={seo.canonicalBaseUrl}
                onChange={(e) => setSeo({ ...seo, canonicalBaseUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Social Share Graphic */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-600" />
              <span>Social Share Card & OpenGraph Image</span>
            </h2>

            <ImageUploader
              label="OpenGraph Share Image (Recommended: 1200 x 630 px)"
              currentUrl={seo.ogImageUrl}
              onImageUploaded={(url) => setSeo({ ...seo, ogImageUrl: url })}
              aspectRatioNotice="Appears when links are shared on Slack, Twitter/X, Discord, LinkedIn, or iMessage"
            />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Twitter Card Format
                </label>
                <select
                  value={seo.twitterCardType}
                  onChange={(e) => setSeo({ ...seo, twitterCardType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                >
                  <option value="summary_large_image">summary_large_image (Large banner card)</option>
                  <option value="summary">summary (Square icon card)</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seo.enableStructuredData}
                    onChange={(e) => setSeo({ ...seo, enableStructuredData: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded-sm"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Enable Schema.org WebApplication JSON-LD
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Verification & Robots.txt */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Webmaster Verifications & Robots.txt</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Google Search Console Verification Token / Tag
              </label>
              <input
                type="text"
                placeholder="e.g. google-site-verification=abc123xyz"
                value={seo.googleSearchConsoleVerification}
                onChange={(e) => setSeo({ ...seo, googleSearchConsoleVerification: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Robots.txt Content
              </label>
              <textarea
                rows={5}
                value={seo.robotsTxtContent}
                onChange={(e) => setSeo({ ...seo, robotsTxtContent: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Previews */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Google Search Snippet Preview */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-500" />
                <span>Google Search Snippet Preview</span>
              </span>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">khbenterprise.com</span>
                  <span>› apps</span>
                </div>
                <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                  {seo.metaTitle || 'KHB Private Limited'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {seo.metaDescription || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Social Sharing Card Preview */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-purple-500" />
                <span>Social Share Card Preview (Slack / Twitter)</span>
              </span>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-xs">
                {seo.ogImageUrl && (
                  <div className="aspect-16/9 bg-slate-900 overflow-hidden">
                    <img
                      src={seo.ogImageUrl}
                      alt="OpenGraph visual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    khbenterprise.com
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {seo.metaTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {seo.metaDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
