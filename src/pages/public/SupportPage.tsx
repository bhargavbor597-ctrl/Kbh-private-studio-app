import React, { useEffect, useState } from 'react';
import { AppItem, SiteSettings, PageContent } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useRouter } from '../../context/RouterContext.tsx';
import {
  HelpCircle,
  Mail,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
  Send,
  MessageSquare,
  Wrench,
  Lightbulb,
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { query } = useRouter();
  const preSelectedApp = query.get('app') || '';

  const [apps, setApps] = useState<AppItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedApp, setSelectedApp] = useState(preSelectedApp);
  const [requestType, setRequestType] = useState<'problem' | 'feature' | 'general'>('problem');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [appsRes, settingsRes, contentRes] = await Promise.all([
          api.getPublicApps(),
          api.getSettings(),
          api.getPageContent(),
        ]);
        if (appsRes.success) {
          setApps(appsRes.apps);
          if (preSelectedApp && !selectedApp) {
            setSelectedApp(preSelectedApp);
          }
        }
        if (settingsRes.success) setSettings(settingsRes.settings);
        if (contentRes.success && contentRes.content) setContent(contentRes.content);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [preSelectedApp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitSupport({
        name,
        email,
        app: selectedApp || 'General Support',
        type: requestType,
        subject: subject.trim() || `${requestType.toUpperCase()}: ${selectedApp || 'General Inquiry'}`,
        message,
      });

      if (res.success) {
        setSuccessTicketId(res.ticketId);
        setName('');
        setEmail('');
        setMessage('');
        setSubject('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const support = content?.supportPage;

  interface DisplayFaq {
    q: string;
    a: string;
    enabled?: boolean;
  }

  const defaultFaqs: DisplayFaq[] = [
    {
      q: 'How do I backup or restore data in your utility apps?',
      a: 'Most of our applications (such as Expense Manager and Color Notes) offer local backup files or CSV export options under the in-app Settings. Since we prioritize privacy and do not store your data on external clouds, your backups reside securely on your device storage or personal Google Drive.',
    },
    {
      q: 'Are your apps and casual games free to use?',
      a: 'Yes! Our utility apps and games are free to download on Google Play. Some apps display non-intrusive advertisements served through Google AdMob to support continuous development.',
    },
    {
      q: 'Do your apps require an active internet connection?',
      a: 'Our core productivity tools, calculators, and casual games operate 100% offline. Network permissions are only utilized when refreshing external currency rates, checking for updates, or loading Google Play advertisements.',
    },
    {
      q: 'How can I report a bug or crash?',
      a: 'Use the support form below! Please mention your device model, Android OS version, and the steps to reproduce the issue. Our engineering team responds to all verified bug reports.',
    },
  ];

  const faqs: DisplayFaq[] = (support?.faqs && support.faqs.length > 0)
    ? support.faqs
        .filter((item: any) => item.enabled !== false)
        .map((item: any) => ({
          q: item.question || item.q || '',
          a: item.answer || item.a || '',
        }))
    : defaultFaqs;

  const supportEmail = settings?.supportEmail || 'support@khbenterprise.com';

  return (
    <div className="min-h-screen py-10 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>{support?.badge || 'Support & Helpdesk'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {support?.title || 'How Can We Help You?'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          {support?.subtitle ||
            'Find quick answers to common questions or submit a ticket directly to our technical support team.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Support Ticket Form (2 cols) */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {support?.formTitle || 'Submit a Support Ticket'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {support?.responseTimeNotice || 'Our support team reviews inquiries within 24 to 48 business hours.'}
            </p>

            {successTicketId ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  Support Ticket Submitted
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mb-3">
                  Your ticket reference is: <strong className="font-mono">{successTicketId}</strong>
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-6">
                  We have saved your inquiry and will follow up with you directly via email.
                </p>
                <button
                  onClick={() => setSuccessTicketId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-200/60 dark:bg-emerald-800/60 hover:bg-emerald-200"
                >
                  Submit Another Ticket
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

                {/* Request Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Inquiry Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRequestType('problem')}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition-colors ${
                        requestType === 'problem'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Bug Report</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRequestType('feature')}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition-colors ${
                        requestType === 'feature'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Feature Idea</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRequestType('general')}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition-colors ${
                        requestType === 'general'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>General Help</span>
                    </button>
                  </div>
                </div>

                {/* Name and Email */}
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
                      placeholder="e.g. John Doe"
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
                      placeholder="john@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Application Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Related Application
                  </label>
                  <select
                    value={selectedApp}
                    onChange={(e) => setSelectedApp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">General Support (Not app-specific)</option>
                    {apps.map((app) => (
                      <option key={app.id} value={app.name}>
                        {app.name} ({app.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your question or issue..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or feature request in detail. If reporting a bug, please include device model and steps to reproduce..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Ticket...' : 'Send Support Request'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Support Sidebar (1 col): Email info & Common FAQs */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {support?.directEmailTitle || 'Direct Support Email'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              {support?.directEmailSubtitle || 'Prefer writing directly from your email client? Reach our engineering team at:'}
            </p>
            <a
              href={`mailto:${supportEmail}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-950/40 px-3.5 py-2 rounded-xl"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{supportEmail}</span>
            </a>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {support?.faqSectionTitle || 'Frequently Asked Questions'}
            </h3>
            {support?.faqSectionSubtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {support.faqSectionSubtitle}
              </p>
            )}
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-indigo-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-3 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
