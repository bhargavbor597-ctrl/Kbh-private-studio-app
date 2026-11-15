import React, { useEffect, useMemo, useState } from 'react';
import { AppItem, SiteSettings } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useRouter, Link } from '../../context/RouterContext.tsx';
import { Shield, ArrowLeft, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

function scopeCssRules(cssText: string, scopeClass: string): string {
  // Remove CSS comments and dangerous @import / javascript: expressions
  let cleaned = cssText
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/@import[^;]*;/gi, '')
    .replace(/expression\s*\(/gi, '');

  const prefixSelectorList = (selectorList: string): string => {
    return selectorList
      .split(',')
      .map((sel) => {
        const s = sel.trim();
        if (!s) return '';
        if (s === ':root' || s === 'html' || s === 'body') {
          return `.${scopeClass}`;
        }
        if (s === '*') {
          return `.${scopeClass}, .${scopeClass} *`;
        }
        if (s.startsWith('body ')) {
          return `.${scopeClass} ${s.slice(5)}`;
        }
        if (s.startsWith('html ')) {
          return `.${scopeClass} ${s.slice(5)}`;
        }
        return `.${scopeClass} ${s}`;
      })
      .filter(Boolean)
      .join(', ');
  };

  // Handle @media blocks and standard rules cleanly
  let result = '';
  let i = 0;
  const len = cleaned.length;

  while (i < len) {
    const openIdx = cleaned.indexOf('{', i);
    if (openIdx === -1) break;

    const prelude = cleaned.slice(i, openIdx).trim();

    if (prelude.startsWith('@media') || prelude.startsWith('@supports')) {
      // Find matching closing brace for nested block
      let depth = 1;
      let j = openIdx + 1;
      while (j < len && depth > 0) {
        if (cleaned[j] === '{') depth++;
        else if (cleaned[j] === '}') depth--;
        j++;
      }
      const innerCss = cleaned.slice(openIdx + 1, j - 1);
      result += `${prelude} {\n${scopeCssRules(innerCss, scopeClass)}\n}\n`;
      i = j;
    } else if (prelude.startsWith('@')) {
      let depth = 1;
      let j = openIdx + 1;
      while (j < len && depth > 0) {
        if (cleaned[j] === '{') depth++;
        else if (cleaned[j] === '}') depth--;
        j++;
      }
      result += `${cleaned.slice(i, j)}\n`;
      i = j;
    } else {
      const closeIdx = cleaned.indexOf('}', openIdx + 1);
      if (closeIdx === -1) break;
      const body = cleaned.slice(openIdx + 1, closeIdx);
      const scopedSelector = prefixSelectorList(prelude);
      if (scopedSelector) {
        result += `${scopedSelector} {${body}}\n`;
      }
      i = closeIdx + 1;
    }
  }

  return result;
}

function parseSanitizedHtmlDocument(rawHtml: string): { scopedCss: string; bodyHtml: string } {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return { scopedCss: '', bodyHtml: '' };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // Extract and scope <style> tags
  const styleNodes = Array.from(doc.querySelectorAll('style'));
  const combinedCss = styleNodes.map((s) => s.textContent || '').join('\n');
  const scopedCss = scopeCssRules(combinedCss, 'khb-privacy-embed');

  // Remove unsafe tags from body
  const dangerousSelectors = 'script, iframe, object, embed, link, meta, style, base, form';
  doc.body.querySelectorAll(dangerousSelectors).forEach((el) => el.remove());

  // Strip inline event handlers & javascript: URLs
  doc.body.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const val = attr.value.trim().toLowerCase();
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
      } else if ((name === 'href' || name === 'src') && val.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    }
  });

  return {
    scopedCss,
    bodyHtml: doc.body.innerHTML,
  };
}

export const AppPrivacyPage: React.FC = () => {
  const { path } = useRouter();
  // Extract slug from /apps/:slug/privacy
  const cleanPath = path.replace(/\/+$/, '');
  const parts = cleanPath.split('/');
  const slug = parts[2];

  const [app, setApp] = useState<AppItem | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
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

  const parsedCustomHtml = useMemo(() => {
    if (!app?.privacyPolicyHtml || !app.privacyPolicyHtml.trim()) {
      return null;
    }
    return parseSanitizedHtmlDocument(app.privacyPolicyHtml);
  }, [app?.privacyPolicyHtml]);

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

  if (parsedCustomHtml && parsedCustomHtml.bodyHtml) {
    return (
      <div className="min-h-screen py-8 md:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link
              to={`/apps/${app.slug}`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {app.name} Details</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <Link
              to="/privacy-policy"
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
            >
              All Privacy Policies
            </Link>
          </div>

          <a
            href={`/apps/${app.slug}/privacy.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <span>Open Standalone HTML</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
          {parsedCustomHtml.scopedCss && (
            <style>{parsedCustomHtml.scopedCss}</style>
          )}
          <div
            className="khb-privacy-embed"
            dangerouslySetInnerHTML={{ __html: parsedCustomHtml.bodyHtml }}
          />
        </div>
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
