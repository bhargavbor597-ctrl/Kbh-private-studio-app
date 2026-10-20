import React, { useEffect, useState } from 'react';
import { SiteSettings, PageContent } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Shield, Clock, Mail } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [settingsRes, contentRes] = await Promise.all([
          api.getSettings(),
          api.getPageContent(),
        ]);
        if (settingsRes.success) setSettings(settingsRes.settings);
        if (contentRes.success) setContent(contentRes.content);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const orgName = settings?.organizationName || 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED';
  const brandName = settings?.brandName || 'KHB Private Limited';
  const supportEmail = settings?.supportEmail || 'support@khbenterprise.com';
  const lastUpdated = content?.privacyLastUpdated || 'September 1, 2026';

  return (
    <div className="min-h-screen py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
