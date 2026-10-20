import React, { useEffect, useState } from 'react';
import { PageContent } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Save, FileText, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminLegalPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form Fields
  const [privacyText, setPrivacyText] = useState('');
  const [termsText, setTermsText] = useState('');

  // About fields
  const [aboutIntro, setAboutIntro] = useState('');
  const [aboutWhoWeAre, setAboutWhoWeAre] = useState('');
  const [aboutWhatWeBuild, setAboutWhatWeBuild] = useState('');
  const [aboutOurPurpose, setAboutOurPurpose] = useState('');
  const [aboutOurApproach, setAboutOurApproach] = useState('');
  const [aboutVision, setAboutVision] = useState('');

  useEffect(() => {
    api
      .getPageContent()
      .then((res) => {
        if (res.success && res.content) {
          const c = res.content;
          setPrivacyText(c.privacyPolicy || '');
          setTermsText(c.termsConditions || '');
          if (c.aboutContent) {
            setAboutIntro(c.aboutContent.intro || '');
            setAboutWhoWeAre(c.aboutContent.whoWeAre || '');
            setAboutWhatWeBuild(c.aboutContent.whatWeBuild || '');
            setAboutOurPurpose(c.aboutContent.ourPurpose || '');
            setAboutOurApproach(c.aboutContent.ourApproach || '');
            setAboutVision(c.aboutContent.vision || '');
          }
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const updated: Partial<PageContent> = {
        privacyPolicy: privacyText,
        termsConditions: termsText,
        aboutContent: {
          intro: aboutIntro,
          whoWeAre: aboutWhoWeAre,
          whatWeBuild: aboutWhatWeBuild,
          ourPurpose: aboutOurPurpose,
          ourApproach: aboutOurApproach,
          vision: aboutVision,
        },
      };

      const res = await api.adminUpdateContent(updated);
      if (res.success) {
        setSuccess('Legal policies and page content saved successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading legal content...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Legal Policies & Page Content
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Edit privacy policy statements, terms and conditions, and about company descriptions. Or use the full <a href="/admin/content" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">Website Content Management</a> system.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Content'}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-950/40 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Privacy Policy */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>1. Organization Privacy Policy</span>
          </h2>
          <p className="text-xs text-slate-500">
            Markdown formatted privacy policy for KHB Private Limited and all Google Play published apps.
          </p>
          <textarea
            rows={10}
            value={privacyText}
            onChange={(e) => setPrivacyText(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
          />
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>2. Terms & Conditions</span>
          </h2>
          <p className="text-xs text-slate-500">
            Governing terms for apps, games, and website usage.
          </p>
          <textarea
            rows={10}
            value={termsText}
            onChange={(e) => setTermsText(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
          />
        </div>

        {/* About Page Content */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. About Us Editorial Text
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Introduction
            </label>
            <textarea
              rows={2}
              value={aboutIntro}
              onChange={(e) => setAboutIntro(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Who We Are
            </label>
            <textarea
              rows={2}
              value={aboutWhoWeAre}
              onChange={(e) => setAboutWhoWeAre(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                What We Build
              </label>
              <textarea
                rows={3}
                value={aboutWhatWeBuild}
                onChange={(e) => setAboutWhatWeBuild(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Our Engineering Approach
              </label>
              <textarea
                rows={3}
                value={aboutOurApproach}
                onChange={(e) => setAboutOurApproach(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Legal Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
