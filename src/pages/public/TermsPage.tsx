import React, { useEffect, useState } from 'react';
import { SiteSettings, PageContent } from '../../types.ts';
import { api } from '../../services/api.ts';
import { FileText, Clock, Mail } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);

  useEffect(() => {
    Promise.all([api.getSettings(), api.getPageContent()]).then(([sRes, cRes]) => {
      if (sRes.success) setSettings(sRes.settings);
      if (cRes.success) setContent(cRes.content);
    }).catch(console.error);
  }, []);

  const orgName = settings?.organizationName || 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED';
  const brandName = settings?.brandName || 'KHB Private Limited';
  const contactEmail = settings?.contactEmail || 'contact@khbenterprise.com';
  const lastUpdated = content?.termsLastUpdated || 'September 1, 2026';

  return (
    <div className="min-h-screen py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-12 shadow-xs">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Terms & Conditions
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-3">
            <span>
              Company: <strong>{orgName}</strong>
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

        {/* Content */}
        {content?.termsConditions ? (
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {content.termsConditions}
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing our website or downloading, installing, and using any mobile applications or games published by <strong>{orgName}</strong> (also known as <strong>{brandName}</strong>), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                2. License & Intellectual Property
              </h2>
              <p>
                We grant you a personal, non-exclusive, non-transferable, revocable license to use our mobile software solely for your personal, non-commercial purposes in compliance with the Google Play Terms of Service. All source code, artwork, logos, icons, and intellectual property remain the exclusive property of {orgName}.
              </p>
            </section>

            <section className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Contact Legal
              </h2>
              <p>
                For questions regarding these terms, reach our administrative team at:
              </p>
              <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {contactEmail}
                </span>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
