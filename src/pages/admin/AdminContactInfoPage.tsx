import React, { useEffect, useState } from 'react';
import { SiteSettings, ContactInfoSettings } from '../../types.ts';
import { api } from '../../services/api.ts';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Save,
  Server,
  Key,
  ExternalLink,
  Globe,
  Share2,
} from 'lucide-react';

export const AdminContactInfoPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Test email state
  const [testRecipient, setTestRecipient] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    provider: string;
    delivered: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.settings) {
        setSettings(res.settings);
        setContactInfo(
          res.settings.contactInfo || {
            publicContactEmail: res.settings.contactEmail || 'contact@khbenterprise.com',
            customerSupportEmail: res.settings.supportEmail || 'support@khbenterprise.com',
            businessEmail: 'inquiries@khbenterprise.com',
            contactPhone: '+1 (555) 234-5678',
            companyAddress: 'Gujarat, India / Global Mobile Publishing',
            supportHours: 'Monday - Friday: 9:00 AM – 6:00 PM IST',
            socialLinks: res.settings.socialLinks || {},
            contactPageHeading: 'Contact & Official Inquiries',
            contactPageSubtitle: 'Get in touch with the team at KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED.',
            formLabels: {
              nameLabel: 'Your Name *',
              emailLabel: 'Email Address *',
              subjectLabel: 'Subject / Topic',
              messageLabel: 'Message Details *',
              submitButtonText: 'Send Official Message',
            },
            emailServiceConfig: {
              provider: 'direct',
              configured: false,
              senderAddress: 'noreply@khbenterprise.com',
              statusMessage: 'Ready for production SMTP or Resend API credentials',
            },
            testEmailLogs: [],
          }
        );
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
    if (!contactInfo) return;

    setSaving(true);
    try {
      const res = await api.adminUpdateSettings({
        contactEmail: contactInfo.publicContactEmail,
        supportEmail: contactInfo.customerSupportEmail,
        contactInfo: contactInfo,
      });

      if (res.success) {
        setSettings(res.settings);
        showNotify(
          'success',
          'Contact settings updated! Public contact email and support addresses synchronized across the entire website.'
        );
      }
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to update contact settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient.trim()) return;

    setTestingEmail(true);
    setTestResult(null);
    try {
      const res = await api.adminSendTestEmail(testRecipient.trim());
      setTestResult(res);
      if (res.success) {
        showNotify('success', 'Email diagnostics routine completed successfully!');
        loadSettings();
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        provider: 'Error',
        delivered: false,
        message: err.message || 'Failed to dispatch test verification message',
      });
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading || !contactInfo) {
    return (
      <div className="p-12 text-center text-slate-400">Loading contact settings...</div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Communications & Deliverability</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact Information Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage public support emails, corporate addresses, phone numbers, contact form texts, and test outgoing email delivery.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save & Sync Everywhere'}</span>
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

      {/* Critical Security Distinction Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
        <div className="flex items-center gap-2 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Important Security Notice: Public Email vs Administrator Credentials</span>
        </div>
        <p className="leading-relaxed pl-6">
          The public contact email and support email below are displayed to public visitors and used in website footers, support tickets, and Play Store policies. Changing them will <strong>NOT</strong> change or expose your private administrator login credentials or backend SMTP environment keys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Email Addresses */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Primary Email Addresses</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Public Contact Email (Visible in Footer & Contact Page) *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactInfo.publicContactEmail}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, publicContactEmail: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Propagates to footer, contact page, and header links.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Customer Support Email (Support & App Detail Pages) *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactInfo.customerSupportEmail}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, customerSupportEmail: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Used for technical inquiries and Google Play listing support.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Business / Partnership Email
                  </label>
                  <input
                    type="email"
                    value={contactInfo.businessEmail}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, businessEmail: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Public Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactInfo.contactPhone}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, contactPhone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Office Address & Support Hours */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Physical Address & Operating Hours</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Company Registered Address / Studio Location
                  </label>
                  <textarea
                    rows={2}
                    value={contactInfo.companyAddress}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, companyAddress: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Support Desk Hours & Expected Turnaround
                  </label>
                  <input
                    type="text"
                    value={contactInfo.supportHours}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, supportHours: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Contact Page Text & Labels */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                <span>Contact Page Text & Form Labels</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Page Heading
                  </label>
                  <input
                    type="text"
                    value={contactInfo.contactPageHeading}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, contactPageHeading: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Page Subtitle / Introductory Text
                  </label>
                  <textarea
                    rows={2}
                    value={contactInfo.contactPageSubtitle}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, contactPageSubtitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Name Input Label
                    </label>
                    <input
                      type="text"
                      value={contactInfo.formLabels.nameLabel}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          formLabels: { ...contactInfo.formLabels, nameLabel: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Email Input Label
                    </label>
                    <input
                      type="text"
                      value={contactInfo.formLabels.emailLabel}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          formLabels: { ...contactInfo.formLabels, emailLabel: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Subject Input Label
                    </label>
                    <input
                      type="text"
                      value={contactInfo.formLabels.subjectLabel}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          formLabels: { ...contactInfo.formLabels, subjectLabel: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Submit Button Text
                    </label>
                    <input
                      type="text"
                      value={contactInfo.formLabels.submitButtonText}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          formLabels: { ...contactInfo.formLabels, submitButtonText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save & Publish Contact Details'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Outgoing Email Service Status & Live Tester */}
        <div className="lg:col-span-4 space-y-6">
          {/* Email Infrastructure Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>Email Service Status</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Service Mode:</span>
                <span className="font-semibold text-slate-900 dark:text-white uppercase font-mono text-[11px]">
                  {contactInfo.emailServiceConfig?.provider || 'Direct'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Backend Status:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Sender Identity:</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {contactInfo.emailServiceConfig?.senderAddress || 'noreply@khbenterprise.com'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Contact submissions are recorded permanently in MongoDB / database storage and can be forwarded to your mailbox. Set <code>SMTP_HOST</code> or <code>RESEND_API_KEY</code> in environment variables for live remote SMTP delivery.
            </p>
          </div>

          {/* Test Email Dispatcher */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Send Test Email</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Test your email dispatch pipeline immediately by sending a verification message to any inbox.
            </p>

            <form onSubmit={handleSendTestEmail} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={testingEmail || !testRecipient}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                {testingEmail ? 'Testing Delivery Pipeline...' : 'Dispatch Test Verification'}
              </button>
            </form>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl text-xs space-y-1.5 ${
                  testResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>{testResult.provider}</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">{testResult.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
