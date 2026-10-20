import React, { useEffect, useState } from 'react';
import { SiteSettings, AppAdsTxtSettings, AuthorizedSellerEntry } from '../../types.ts';
import { api } from '../../services/api.ts';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  RefreshCw,
  Copy,
  Info,
  Layers,
} from 'lucide-react';

export const AdminAppAdsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [content, setContent] = useState('');
  const [publisherId, setPublisherId] = useState('');
  const [sellers, setSellers] = useState<AuthorizedSellerEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live test result of root /app-ads.txt URL
  const [verifyingRoot, setVerifyingRoot] = useState(false);
  const [rootStatus, setRootStatus] = useState<{ checked: boolean; ok: boolean; message: string } | null>(null);

  useEffect(() => {
    loadAppAdsData();
  }, []);

  const loadAppAdsData = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.settings) {
        setSettings(res.settings);
        const rawContent =
          res.settings.appAds?.content ||
          res.settings.appAdsTxtContent ||
          '# KHB Private Limited - Google AdMob Authorized Digital Sellers\ngoogle.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n';

        setContent(rawContent);
        setPublisherId(res.settings.admobPublisherId || res.settings.appAds?.admobPublisherId || '');
        setSellers(
          res.settings.appAds?.authorizedSellers || [
            {
              domain: 'google.com',
              publisherId: res.settings.admobPublisherId || 'pub-0000000000000000',
              relation: 'DIRECT',
              certificationAuthorityId: 'f08c47fec0942fa0',
            },
          ]
        );
        setLastUpdated(res.settings.appAds?.lastUpdated || 'September 1, 2026');
        validateEntries(rawContent);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const validateEntries = (txt: string) => {
    const issues: string[] = [];
    const lines = txt.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));

    const seen = new Set<string>();

    lines.forEach((line, idx) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length < 3) {
        issues.push(`Line ${idx + 1}: Incomplete record. Expected "domain, publisher_id, DIRECT/RESELLER, [cert_id]"`);
      } else {
        const [domain, pubId, relation] = parts;
        if (!domain.includes('.')) {
          issues.push(`Line ${idx + 1}: Invalid domain format "${domain}".`);
        }
        if (!pubId.startsWith('pub-') && pubId !== 'pub-0000000000000000') {
          issues.push(`Line ${idx + 1}: AdMob publisher ID should begin with "pub-", found "${pubId}".`);
        }
        if (relation !== 'DIRECT' && relation !== 'RESELLER') {
          issues.push(`Line ${idx + 1}: Third field must be DIRECT or RESELLER, found "${relation}".`);
        }
        const key = `${domain}:${pubId}`;
        if (seen.has(key)) {
          issues.push(`Line ${idx + 1}: Duplicate entry for domain ${domain} with publisher ${pubId}.`);
        }
        seen.add(key);
      }
    });

    setValidationIssues(issues);
  };

  const handleContentChange = (newVal: string) => {
    setContent(newVal);
    validateEntries(newVal);
  };

  const handleAddSellerEntry = () => {
    const newEntry: AuthorizedSellerEntry = {
      domain: 'google.com',
      publisherId: publisherId || 'pub-0000000000000000',
      relation: 'DIRECT',
      certificationAuthorityId: 'f08c47fec0942fa0',
    };
    const updated = [...sellers, newEntry];
    setSellers(updated);
    regenerateContentFromSellers(updated, publisherId);
  };

  const handleRemoveSellerEntry = (idx: number) => {
    const updated = sellers.filter((_, i) => i !== idx);
    setSellers(updated);
    regenerateContentFromSellers(updated, publisherId);
  };

  const handleUpdateSeller = (idx: number, field: keyof AuthorizedSellerEntry, val: string) => {
    const updated = [...sellers];
    updated[idx] = { ...updated[idx], [field]: val };
    setSellers(updated);
    regenerateContentFromSellers(updated, publisherId);
  };

  const regenerateContentFromSellers = (currentSellers: AuthorizedSellerEntry[], pubId: string) => {
    const header = `# KHB Private Limited - Google AdMob Authorized Digital Sellers\n# Organization: KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED\n# Format: <Domain>, <Publisher ID>, <Relationship>, <Certification Authority ID>\n`;
    const lines = currentSellers.map((s) => {
      const pId = s.publisherId || pubId || 'pub-0000000000000000';
      return `${s.domain || 'google.com'}, ${pId}, ${s.relation || 'DIRECT'}, ${s.certificationAuthorityId || 'f08c47fec0942fa0'}`;
    });
    const result = header + lines.join('\n') + '\n';
    setContent(result);
    validateEntries(result);
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const res = await api.adminPublishAppAds({
        content,
        admobPublisherId: publisherId,
        authorizedSellers: sellers,
      });

      if (res.success) {
        setLastUpdated(res.lastUpdated);
        showNotify('success', 'app-ads.txt successfully published to root URL and persistent database storage!');
        testRootVerification();
      }
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to publish app-ads.txt');
    } finally {
      setSaving(false);
    }
  };

  const testRootVerification = async () => {
    setVerifyingRoot(true);
    setRootStatus(null);
    try {
      const res = await fetch('/app-ads.txt');
      const text = await res.text();
      const contentType = res.headers.get('content-type') || '';
      const isPlain = contentType.includes('text/plain');

      if (res.ok && isPlain && text.length > 0) {
        setRootStatus({
          checked: true,
          ok: true,
          message: `Root URL (/app-ads.txt) is live and returning Content-Type: ${contentType}.`,
        });
      } else {
        setRootStatus({
          checked: true,
          ok: false,
          message: `Root returned status ${res.status} with type ${contentType}.`,
        });
      }
    } catch (err: any) {
      setRootStatus({
        checked: true,
        ok: false,
        message: 'Could not connect to /app-ads.txt: ' + err.message,
      });
    } finally {
      setVerifyingRoot(false);
    }
  };

  const handleDownloadBackup = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'app-ads.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/app-ads.txt` : '/app-ads.txt';

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading app-ads.txt manager...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AdMob Monetization & Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            app-ads.txt Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage and verify your root-level Authorized Digital Sellers file for Google AdMob and Google Play.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Backup (.txt)</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Publish to Root URL'}</span>
          </button>
        </div>
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
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Root Status & Verification Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Public File URL:</span>
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono text-indigo-600 dark:text-indigo-400">
              {publicUrl}
            </code>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Status: <strong className="text-emerald-600">Published (Root-Level)</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={testRootVerification}
            disabled={verifyingRoot}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifyingRoot ? 'animate-spin' : ''}`} />
            <span>Verify Live Server Endpoint</span>
          </button>

          <a
            href="/app-ads.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <span>Open Public /app-ads.txt</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {rootStatus && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
            rootStatus.ok
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
          }`}
        >
          {rootStatus.ok ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{rootStatus.message}</span>
        </div>
      )}

      {/* Warnings & Validation Feedback */}
      {validationIssues.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Formatting Warnings Detected ({validationIssues.length})</span>
          </div>
          <ul className="list-disc pl-6 space-y-0.5 pt-1">
            {validationIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Editor Grid: Visual Entries Builder & Raw Plain Text File Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Authorized Seller Entry Builder */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Authorized Sellers Entries
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Add entries for Google AdMob and advertising exchange partners.
                </p>
              </div>

              <button
                onClick={handleAddSellerEntry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Seller Line</span>
              </button>
            </div>

            {/* Default AdMob Publisher ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Google AdMob Publisher ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="pub-XXXXXXXXXXXXXXXX"
                  value={publisherId}
                  onChange={(e) => {
                    setPublisherId(e.target.value);
                    if (sellers.length > 0 && sellers[0].domain === 'google.com') {
                      handleUpdateSeller(0, 'publisherId', e.target.value);
                    }
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Found in your Google AdMob account under Settings &gt; Account Information (e.g. pub-1234567890123456).
              </span>
            </div>

            {/* List of Sellers */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Seller Records ({sellers.length})
              </label>

              {sellers.map((seller, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Entry #{idx + 1}
                    </span>
                    {sellers.length > 1 && (
                      <button
                        onClick={() => handleRemoveSellerEntry(idx)}
                        className="text-red-500 hover:text-red-700 text-xs"
                        title="Remove entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                        Domain
                      </label>
                      <input
                        type="text"
                        value={seller.domain}
                        onChange={(e) => handleUpdateSeller(idx, 'domain', e.target.value)}
                        placeholder="google.com"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                        Relationship
                      </label>
                      <select
                        value={seller.relation}
                        onChange={(e) => handleUpdateSeller(idx, 'relation', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      >
                        <option value="DIRECT">DIRECT</option>
                        <option value="RESELLER">RESELLER</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                        Publisher ID
                      </label>
                      <input
                        type="text"
                        value={seller.publisherId}
                        onChange={(e) => handleUpdateSeller(idx, 'publisherId', e.target.value)}
                        placeholder="pub-XXXXXXXXXXXXXXXX"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                        Certification Authority ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={seller.certificationAuthorityId || ''}
                        onChange={(e) => handleUpdateSeller(idx, 'certificationAuthorityId', e.target.value)}
                        placeholder="f08c47fec0942fa0 (Google TAG ID)"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Plain Text Direct Editor */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Exact File Content (Plain Text)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  This exact raw text is served directly at <code>/app-ads.txt</code> with <code>text/plain; charset=utf-8</code>.
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  showNotify('success', 'Content copied to clipboard!');
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Copy content"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={16}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-y"
              spellCheck={false}
            />

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Lines: {content.split('\n').length}</span>
              <button
                onClick={handlePublish}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Save & Publish app-ads.txt'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
