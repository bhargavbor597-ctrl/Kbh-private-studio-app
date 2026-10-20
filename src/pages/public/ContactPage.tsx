import React, { useEffect, useState } from 'react';
import { SiteSettings, PageContent } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Mail, Send, CheckCircle2, AlertCircle, Building2, Globe } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getSettings(), api.getPageContent()])
      .then(([settingsRes, contentRes]) => {
        if (settingsRes.success && settingsRes.settings) setSettings(settingsRes.settings);
        if (contentRes.success && contentRes.content) setContent(contentRes.content);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitContact({
        name,
        email,
        subject: subject.trim() || 'General Website Inquiry',
        message,
      });

      if (res.success) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const orgName = settings?.organizationName || 'KAMBARIYA-HB ENTERPRIVATE LIMITED';
  const brandName = settings?.brandName || 'KHB Private Limited';
  const contactEmail = settings?.contactEmail || 'contact@khbenterprise.com';
  const supportEmail = settings?.supportEmail || 'support@khbenterprise.com';
  const cp = content?.contactPage;

  return (
    <div className="min-h-screen py-10 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {cp?.title || 'Contact & Official Inquiries'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          {cp?.subtitle ||
            `Get in touch with the team at ${orgName} (${brandName}). We welcome feedback, developer inquiries, and technical questions.`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Form (2 cols) */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {cp?.formTitle || 'Send Us a Message'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {cp?.formSubtitle ||
                'Fill out the form below and your message will be routed directly to our administration desk.'}
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  {cp?.successTitle || 'Message Sent Successfully'}
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-6">
                  {cp?.successMessage ||
                    'Thank you for contacting KHB Private Limited. We have received your message.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-200/60 dark:bg-emerald-800/60 hover:bg-emerald-200"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="flex items-center gap-2 p-3.5 rounded-xl text-xs font-medium text-red-700 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Miller"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Corporate inquiry, partnership, developer question"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    {cp?.responseTimeText || 'Standard response turnaround: 1 to 2 business days.'}
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="contact-submit-btn"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Organization Info (1 col) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{cp?.officeLocationTitle || 'Official Organization'}</span>
            </h3>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              {orgName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Consumer Publishing Identity: <strong>{brandName}</strong>
            </p>

            {cp?.officeLocationText && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                {cp.officeLocationText}
              </p>
            )}

            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  General Inquiries:
                </span>
                <a href={`mailto:${contactEmail}`} className="font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600">
                  {contactEmail}
                </a>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                  Technical App Support:
                </span>
                <a href={`mailto:${supportEmail}`} className="font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600">
                  {supportEmail}
                </a>
              </div>

              {settings?.websiteUrl && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                    Official Website:
                  </span>
                  <a href={settings.websiteUrl} className="font-bold text-indigo-600 hover:underline">
                    {settings.websiteUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
