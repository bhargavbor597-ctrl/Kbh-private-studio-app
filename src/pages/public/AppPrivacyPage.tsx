import React, { useEffect, useState } from 'react';
import { AppItem, SiteSettings } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useRouter, Link } from '../../context/RouterContext.tsx';
import { Shield, ArrowLeft, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

export const AppPrivacyPage: React.FC = () => {
  const { path } = useRouter();
  // Extract slug from /apps/:slug/privacy
  const parts = path.split('/');
  const slug = parts[2];

  const [app, setApp] = useState<AppItem | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const [appRes, settingsRes] = await Promise.all([
          api.getAppBySlug(slug),
          api.getSettings(),
        ]);
        if (appRes.success) setApp(appRes.app);
        if (settingsRes.success) setSettings(settingsRes.settings);
      } catch (err) {
        console.error('Failed to load app privacy:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 max-w-4xl mx-auto px-4">
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen py-24 max-w-lg mx-auto px-4 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Application Not Found</h1>
        <Link to="/apps" className="text-indigo-600 hover:underline">
          Return to Our Apps
        </Link>
      </div>
    );
  }

  const orgName = settings?.organizationName || 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED';
  const brandName = settings?.brandName || 'KHB Private Limited';
  const supportEmail = app.supportEmail || settings?.supportEmail || 'support@khbenterprise.com';

  return (
    <div className="min-h-screen py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        to={`/apps/${app.slug}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to {app.name} Details</span>
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border shrink-0">
            <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Application Privacy Statement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {app.name} Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Published by {orgName} ({brandName})
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Overview</h2>
            <p>
              This privacy notice specifically applies to the mobile application <strong>{app.name}</strong>, published on Google Play by {orgName}. We value your trust and are dedicated to safeguarding your digital privacy.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Data Storage & On-Device Processing</h2>
            <p>
              {app.privacyPolicy ||
                `${app.name} operates primarily on your device. User data, configurations, and personal inputs are stored locally and are not transferred to remote corporate databases.`}
            </p>
          </div>

          {app.permissions && app.permissions.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Required Permissions & Functional Purpose</h2>
              <p className="mb-3">
                {app.name} requests only permissions strictly necessary for its features:
              </p>
              <ul className="space-y-2">
                {app.permissions.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">4. Third-Party Services (Google AdMob / Play Services)</h2>
            <p>
              If advertisements are served within {app.name}, they are facilitated through Google AdMob or Google Play Services. These networks may collect anonymous identifiers for fraud prevention and contextual ad delivery in accordance with Google's privacy policies.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">5. Children's Compliance</h2>
            <p>
              {app.name} complies with Google Play Families Policy and does not knowingly harvest personal information from children under 13 years of age.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Have questions regarding this app's privacy practices?
              </p>
              <a
                href={`mailto:${supportEmail}`}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 mt-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{supportEmail}</span>
              </a>
            </div>

            <Link
              to="/privacy-policy"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 underline"
            >
              View Main Organization Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
