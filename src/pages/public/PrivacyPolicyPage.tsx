import React, { useEffect, useState } from 'react';
import { AppItem, SiteSettings, PageContent } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Link } from '../../context/RouterContext.tsx';
import { Shield, Clock, Mail, ArrowRight, ExternalLink } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);
  const [apps, setApps] = useState<AppItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [settingsRes, contentRes, appsRes] = await Promise.all([
          api.getSettings(),
          api.getPageContent(),
          api.getPublicApps(),
        ]);
        if (settingsRes.success) setSettings(settingsRes.settings);
        if (contentRes.success) setContent(contentRes.content);
        if (appsRes.success) setApps(appsRes.apps);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const orgName = settings?.organizationName || 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED';
  const brandName = settings?.brandName || 'KHB Private Limited';
  const supportEmail = settings?.supportEmail || 'support@khbenterprise.com';
  const lastUpdated = content?.privacyLastUpdated || 'September 1, 2026';

  return (
    <div className="min-h-screen py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* App-Specific Privacy Policies Directory */}
      {apps.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>App-Specific Privacy Policies</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            Application Privacy Statements
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Select an application below to view its dedicated privacy policy and permission disclosures.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {apps.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={app.icon}
                    alt={app.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {app.name}
                    </div>
                    {app.packageName && (
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                        {app.packageName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/apps/${app.slug}/privacy`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    <span>View Policy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {app.privacyPolicyHtml && (
                    <a
                      href={`/apps/${app.slug}/privacy.html`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open Standalone HTML"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-12 shadow-xs">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Official Privacy Statement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-3">
            <span>
              Organization: <strong>{orgName}</strong>
            </span>
            <span>•</span>
            <span>
              Brand: <strong>{brandName}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Last updated: {lastUpdated}</span>
            </span>
          </div>
        </div>

        {/* Policy Body */}
        {content?.privacyPolicy ? (
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {content.privacyPolicy}
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                1. Introduction & Scope
              </h2>
              <p>
                This Privacy Policy explains how <strong>{orgName}</strong> (operating as <strong>{brandName}</strong>) handles information across our official website and the mobile applications and games published under our developer account on the Google Play Store.
              </p>
              <p className="mt-2">
                We respect individual digital privacy. Our primary design philosophy is to build applications that operate locally on your device without harvesting personal identifying information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                2. Data Collection Principles
              </h2>
              <p>
                We do not collect sensitive personal data such as passwords, banking credentials, biometric data, or precise real-time physical location unless an explicit tool strictly requires it to function (with upfront user consent).
              </p>
            </section>

            <section className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Contact Information
              </h2>
              <p>
                For questions regarding this Privacy Policy, contact our team at:
              </p>
              <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {supportEmail}
                </span>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
