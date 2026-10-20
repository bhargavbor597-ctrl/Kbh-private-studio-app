import React, { useEffect, useState } from 'react';
import { PageContent, SiteSettings, ButtonConfig, SectionItem, FAQItem } from '../../types.ts';
import { api } from '../../services/api.ts';
import { ImageUploader } from '../../components/admin/ImageUploader.tsx';
import { ButtonEditor } from '../../components/admin/ButtonEditor.tsx';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Home,
  Info,
  Smartphone,
  FileCode,
  HelpCircle,
  Mail,
  Shield,
  FileText,
  Layout,
  Settings,
  Plus,
  Trash2,
  Sparkles,
  Eye,
  Sliders,
} from 'lucide-react';

type TabKey =
  | 'home'
  | 'about'
  | 'apps'
  | 'app-detail'
  | 'support'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'footer'
  | 'settings';

export interface AdminContentManagementProps {
  initialTab?: TabKey;
}

export const AdminContentManagementPage: React.FC<AdminContentManagementProps> = ({ initialTab = 'home' }) => {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [content, setContent] = useState<PageContent | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [contentRes, settingsRes] = await Promise.all([
          api.getPageContent(),
          api.getSettings(),
        ]);
        if (contentRes.success && contentRes.content) {
          setContent(contentRes.content);
        }
        if (settingsRes.success && settingsRes.settings) {
          setSettings(settingsRes.settings);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load website content');
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleSaveContent = async () => {
    if (!content) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await api.adminUpdateContent(content);
      if (res.success && res.content) {
        setContent(res.content);
        showNotification('Website content changes saved to MongoDB & live on site!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await api.adminUpdateSettings(settings);
      if (res.success && res.settings) {
        setSettings(res.settings);
        showNotification('Company settings saved successfully!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all website content back to default factory content? Any custom text edits will be restored to defaults.')) {
      return;
    }
    setSaving(true);
    try {
      const res = await api.adminResetContent();
      if (res.success && res.content) {
        setContent(res.content);
        showNotification('Website content reset to defaults!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset content');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content || !settings) {
    return (
      <div className="py-24 text-center text-slate-500">
        <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Loading Centralized Content Management...</p>
      </div>
    );
  }

  const tabs: Array<{ key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; publicUrl?: string }> = [
    { key: 'home', label: '1. Home Page', icon: Home, publicUrl: '/' },
    { key: 'about', label: '2. About Us', icon: Info, publicUrl: '/about' },
    { key: 'apps', label: '3. Our Apps', icon: Smartphone, publicUrl: '/apps' },
    { key: 'app-detail', label: '4. App Detail Pages', icon: FileCode, publicUrl: '/apps' },
    { key: 'support', label: '5. Support & FAQs', icon: HelpCircle, publicUrl: '/support' },
    { key: 'contact', label: '6. Contact Page', icon: Mail, publicUrl: '/contact' },
    { key: 'privacy', label: '7. Privacy Policy', icon: Shield, publicUrl: '/privacy-policy' },
    { key: 'terms', label: '8. Terms & Conditions', icon: FileText, publicUrl: '/terms' },
    { key: 'footer', label: '9. Footer & Socials', icon: Layout },
    { key: 'settings', label: '10. Company Settings', icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Centralized CMS</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Website Content Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Control all public headings, paragraphs, banner images, buttons, and legal policies across all 10 areas of the official organization website without touching source code.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={saving}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 inline-flex items-center gap-1.5 transition-colors"
            title="Restore default factory content"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>

          <button
            type="button"
            onClick={activeTab === 'settings' ? handleSaveSettings : handleSaveContent}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl text-xs font-semibold text-red-800 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section Tab Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 inline-flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* ========================================================= */}
        {/* 1. HOME PAGE MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Home Page Content Editor
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage hero texts, primary and secondary CTAs, stats counter, feature cards, and section visibility.
                </p>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Preview Home</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Hero Section Sub-form */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Hero Banner</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Top Badge / Organization Tag
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.hero.badge}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          hero: { ...content.homeContent.hero, badge: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subtitle / Publishing Studio
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.hero.subtitle}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          hero: { ...content.homeContent.hero, subtitle: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Main Headline (H1)
                </label>
                <input
                  type="text"
                  value={content.homeContent.hero.heading}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        hero: { ...content.homeContent.hero, heading: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={content.homeContent.hero.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        hero: { ...content.homeContent.hero, description: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Optional Hero Visual / Banner Image"
                value={content.homeContent.hero.heroImage}
                onChange={(url) =>
                  setContent({
                    ...content,
                    homeContent: {
                      ...content.homeContent,
                      hero: { ...content.homeContent.hero, heroImage: url },
                    },
                  })
                }
                aspectRatioHint="Recommended: 1200 x 600px"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <ButtonEditor
                  label="Primary Hero Button"
                  config={content.homeContent.hero.primaryButton}
                  onChange={(btn) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        hero: { ...content.homeContent.hero, primaryButton: btn },
                      },
                    })
                  }
                  defaultUrl="/apps"
                />
                <ButtonEditor
                  label="Secondary Hero Button"
                  config={content.homeContent.hero.secondaryButton}
                  onChange={(btn) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        hero: { ...content.homeContent.hero, secondaryButton: btn },
                      },
                    })
                  }
                  defaultUrl="/support"
                />
              </div>
            </div>

            {/* Statistics Strip Management */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Statistics Highlight Strip
                </h3>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={content.homeContent.stats.enabled}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          stats: { ...content.homeContent.stats, enabled: e.target.checked },
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Show Section</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Stat 1 Label (Dynamic Count)
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.stats.stat1Label}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          stats: { ...content.homeContent.stats, stat1Label: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Stat 2 Label (Coming Soon)
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.stats.stat2Label}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          stats: { ...content.homeContent.stats, stat2Label: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Stat 3 Label & Value
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.stats.stat3Label}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          stats: { ...content.homeContent.stats, stat3Label: e.target.value },
                        },
                      })
                    }
                    placeholder="Categories"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs mb-1"
                  />
                  <input
                    type="text"
                    value={content.homeContent.stats.stat3Value}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          stats: { ...content.homeContent.stats, stat3Value: e.target.value },
                        },
                      })
                    }
                    placeholder="4+ Focus Areas"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Stat 4 Label & Value
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.stats.stat4Label}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          stats: { ...content.homeContent.stats, stat4Label: e.target.value },
                        },
                      })
                    }
                    placeholder="Privacy"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs mb-1"
                  />
                  <input
                    type="text"
                    value={content.homeContent.stats.stat4Value}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          stats: { ...content.homeContent.stats, stat4Value: e.target.value },
                        },
                      })
                    }
                    placeholder="100% On-Device"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Featured Apps Section Settings */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Featured Apps Showcase Section
                </h3>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={content.homeContent.featuredSection.enabled}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          featuredSection: {
                            ...content.homeContent.featuredSection,
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Show Section</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Section Badge
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.featuredSection.badge}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          featuredSection: {
                            ...content.homeContent.featuredSection,
                            badge: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.featuredSection.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          featuredSection: {
                            ...content.homeContent.featuredSection,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={content.homeContent.featuredSection.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        featuredSection: {
                          ...content.homeContent.featuredSection,
                          subtitle: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <ButtonEditor
                label="View All Apps Button"
                config={content.homeContent.featuredSection.viewAllButton}
                onChange={(btn) =>
                  setContent({
                    ...content,
                    homeContent: {
                      ...content.homeContent,
                      featuredSection: {
                        ...content.homeContent.featuredSection,
                        viewAllButton: btn,
                      },
                    },
                  })
                }
                defaultUrl="/apps"
              />
            </div>

            {/* Why Choose Our Apps Section */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    "Why Users Choose Our Apps" Section
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Manage key value propositions shown on the home page.
                  </p>
                </div>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={content.homeContent.whyChooseSection.enabled}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          whyChooseSection: {
                            ...content.homeContent.whyChooseSection,
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Show Section</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.whyChooseSection.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          whyChooseSection: {
                            ...content.homeContent.whyChooseSection,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.whyChooseSection.subtitle}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          whyChooseSection: {
                            ...content.homeContent.whyChooseSection,
                            subtitle: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Feature Cards ({content.homeContent.whyChooseSection.items.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [
                        ...content.homeContent.whyChooseSection.items,
                        { title: 'New Feature Benefit', description: 'Brief description of this benefit.', icon: 'CheckCircle2' },
                      ];
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          whyChooseSection: {
                            ...content.homeContent.whyChooseSection,
                            items: updated,
                          },
                        },
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Benefit Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {content.homeContent.whyChooseSection.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/80 space-y-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.homeContent.whyChooseSection.items.filter((_, i) => i !== idx);
                          setContent({
                            ...content,
                            homeContent: {
                              ...content.homeContent,
                              whyChooseSection: {
                                ...content.homeContent.whyChooseSection,
                                items: updated,
                              },
                            },
                          });
                        }}
                        className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-600"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...content.homeContent.whyChooseSection.items];
                          updated[idx].title = e.target.value;
                          setContent({
                            ...content,
                            homeContent: {
                              ...content.homeContent,
                              whyChooseSection: {
                                ...content.homeContent.whyChooseSection,
                                items: updated,
                              },
                            },
                          });
                        }}
                        placeholder="Feature Title"
                        className="w-full pr-7 font-bold text-xs bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:outline-none focus:border-indigo-500"
                      />

                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...content.homeContent.whyChooseSection.items];
                          updated[idx].description = e.target.value;
                          setContent({
                            ...content,
                            homeContent: {
                              ...content.homeContent,
                              whyChooseSection: {
                                ...content.homeContent.whyChooseSection,
                                items: updated,
                              },
                            },
                          });
                        }}
                        placeholder="Feature Description"
                        className="w-full text-xs text-slate-600 dark:text-slate-300 bg-transparent resize-none focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About Organization Summary Banner */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  About Organization Dark Banner (Home)
                </h3>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={content.homeContent.aboutSummarySection.enabled}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          aboutSummarySection: {
                            ...content.homeContent.aboutSummarySection,
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Show Section</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.aboutSummarySection.badge}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          aboutSummarySection: {
                            ...content.homeContent.aboutSummarySection,
                            badge: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={content.homeContent.aboutSummarySection.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          aboutSummarySection: {
                            ...content.homeContent.aboutSummarySection,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={content.homeContent.aboutSummarySection.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        aboutSummarySection: {
                          ...content.homeContent.aboutSummarySection,
                          description: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ButtonEditor
                  label="Primary Button"
                  config={content.homeContent.aboutSummarySection.primaryButton}
                  onChange={(btn) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        aboutSummarySection: {
                          ...content.homeContent.aboutSummarySection,
                          primaryButton: btn,
                        },
                      },
                    })
                  }
                  defaultUrl="/about"
                />
                <ButtonEditor
                  label="Secondary Button"
                  config={content.homeContent.aboutSummarySection.secondaryButton}
                  onChange={(btn) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        aboutSummarySection: {
                          ...content.homeContent.aboutSummarySection,
                          secondaryButton: btn,
                        },
                      },
                    })
                  }
                  defaultUrl="/support"
                />
              </div>
            </div>

            {/* Bottom Support CTA Section */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Bottom Support CTA Section (Home)
                </h3>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={content.homeContent.ctaSection.enabled}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homeContent: {
                          ...content.homeContent,
                          ctaSection: {
                            ...content.homeContent.ctaSection,
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Show Section</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  CTA Title
                </label>
                <input
                  type="text"
                  value={content.homeContent.ctaSection.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        ctaSection: {
                          ...content.homeContent.ctaSection,
                          title: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  CTA Subtitle / Help text
                </label>
                <input
                  type="text"
                  value={content.homeContent.ctaSection.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        ctaSection: {
                          ...content.homeContent.ctaSection,
                          subtitle: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ButtonEditor
                  label="Primary Button (Submit Ticket)"
                  config={content.homeContent.ctaSection.primaryButton}
                  onChange={(btn) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        ctaSection: {
                          ...content.homeContent.ctaSection,
                          primaryButton: btn,
                        },
                      },
                    })
                  }
                  defaultUrl="/support"
                />
                <ButtonEditor
                  label="Secondary Button (Contact Form)"
                  config={content.homeContent.ctaSection.secondaryButton}
                  onChange={(btn) =>
                    setContent({
                      ...content,
                      homeContent: {
                        ...content.homeContent,
                        ctaSection: {
                          ...content.homeContent.ctaSection,
                          secondaryButton: btn,
                        },
                      },
                    })
                  }
                  defaultUrl="/contact"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. ABOUT US PAGE MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  About Us Page Content Editor
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage company history, mission, vision, engineering approach, and core values.
                </p>
              </div>
              <a
                href="/about"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Preview About Us</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Page Badge / Tagline
                </label>
                <input
                  type="text"
                  value={content.aboutPage.badge}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutPage: { ...content.aboutPage, badge: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subtitle / Publishing Brand Note
                </label>
                <input
                  type="text"
                  value={content.aboutPage.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutPage: { ...content.aboutPage, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Main Page Heading (H1)
              </label>
              <input
                type="text"
                value={content.aboutPage.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    aboutPage: { ...content.aboutPage, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Introductory Overview
              </label>
              <textarea
                rows={3}
                value={content.aboutPage.intro}
                onChange={(e) =>
                  setContent({
                    ...content,
                    aboutPage: { ...content.aboutPage, intro: e.target.value },
                    aboutContent: { ...content.aboutContent, intro: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <ImageUploader
              label="About Us Hero / Office Image"
              value={content.aboutPage.heroImage}
              onChange={(url) =>
                setContent({
                  ...content,
                  aboutPage: { ...content.aboutPage, heroImage: url },
                })
              }
              aspectRatioHint="Recommended: 1200 x 600px"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Who We Are
                </label>
                <textarea
                  rows={3}
                  value={content.aboutPage.whoWeAre}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutPage: { ...content.aboutPage, whoWeAre: e.target.value },
                      aboutContent: { ...content.aboutContent, whoWeAre: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What We Build
                </label>
                <textarea
                  rows={3}
                  value={content.aboutPage.whatWeBuild}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutPage: { ...content.aboutPage, whatWeBuild: e.target.value },
                      aboutContent: { ...content.aboutContent, whatWeBuild: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Our Mission & Purpose
                </label>
                <textarea
                  rows={3}
                  value={content.aboutPage.ourPurpose}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutPage: { ...content.aboutPage, ourPurpose: e.target.value },
                      aboutContent: { ...content.aboutContent, ourPurpose: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Our Engineering Approach
                </label>
                <textarea
                  rows={3}
                  value={content.aboutPage.ourApproach}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutPage: { ...content.aboutPage, ourApproach: e.target.value },
                      aboutContent: { ...content.aboutContent, ourApproach: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Future Vision
                </label>
                <textarea
                  rows={3}
                  value={content.aboutPage.vision}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutPage: { ...content.aboutPage, vision: e.target.value },
                      aboutContent: { ...content.aboutContent, vision: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Core Mission
                </label>
                <textarea
                  rows={3}
                  value={content.aboutPage.mission}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutPage: { ...content.aboutPage, mission: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            {/* Bottom Contact CTA on About page */}
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Connect With Our Team CTA Box
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={content.aboutPage.ctaTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutPage: { ...content.aboutPage, ctaTitle: e.target.value },
                    })
                  }
                  placeholder="CTA Title"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <input
                  type="text"
                  value={content.aboutPage.ctaSubtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutPage: { ...content.aboutPage, ctaSubtitle: e.target.value },
                    })
                  }
                  placeholder="CTA Subtitle"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <ButtonEditor
                label="Action Button"
                config={content.aboutPage.ctaButton}
                onChange={(btn) =>
                  setContent({
                    ...content,
                    aboutPage: { ...content.aboutPage, ctaButton: btn },
                  })
                }
                defaultUrl="/contact"
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. OUR APPS PAGE MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'apps' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Our Apps Directory Page Editor
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Customize the heading, search placeholder, filter labels, and empty state notice.
                </p>
              </div>
              <a
                href="/apps"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Preview Apps Directory</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Directory Page Title (H1)
                </label>
                <input
                  type="text"
                  value={content.ourAppsPage.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      ourAppsPage: { ...content.ourAppsPage, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subtitle Description
                </label>
                <input
                  type="text"
                  value={content.ourAppsPage.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      ourAppsPage: { ...content.ourAppsPage, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Search Bar Placeholder Text
                </label>
                <input
                  type="text"
                  value={content.ourAppsPage.searchPlaceholder}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      ourAppsPage: { ...content.ourAppsPage, searchPlaceholder: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  No Apps Found Fallback Message
                </label>
                <input
                  type="text"
                  value={content.ourAppsPage.noAppsFoundMessage}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      ourAppsPage: { ...content.ourAppsPage, noAppsFoundMessage: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <ImageUploader
              label="Optional Header Promotional Banner"
              value={content.ourAppsPage.headerBanner}
              onChange={(url) =>
                setContent({
                  ...content,
                  ourAppsPage: { ...content.ourAppsPage, headerBanner: url },
                })
              }
              aspectRatioHint="Recommended: 1200 x 300px"
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. APP DETAIL TEMPLATE MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'app-detail' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  App Detail Page Template Editor
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Control the standard section labels, button text, and support text displayed across all dynamic app detail pages.
                </p>
              </div>
              <a
                href="/apps/expense-manager"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Preview Sample App Detail</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Back Button Text
                </label>
                <input
                  type="text"
                  value={content.appDetailPage.backButtonText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      appDetailPage: { ...content.appDetailPage, backButtonText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Google Play Store Button Label
                </label>
                <input
                  type="text"
                  value={content.appDetailPage.playStoreButtonLabel}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      appDetailPage: { ...content.appDetailPage, playStoreButtonLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Features Section Title
                </label>
                <input
                  type="text"
                  value={content.appDetailPage.featuresTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      appDetailPage: { ...content.appDetailPage, featuresTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Screenshots Section Title
                </label>
                <input
                  type="text"
                  value={content.appDetailPage.screenshotsTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      appDetailPage: { ...content.appDetailPage, screenshotsTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  FAQ Section Title
                </label>
                <input
                  type="text"
                  value={content.appDetailPage.faqTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      appDetailPage: { ...content.appDetailPage, faqTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Permissions Section Title
                </label>
                <input
                  type="text"
                  value={content.appDetailPage.permissionsTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      appDetailPage: { ...content.appDetailPage, permissionsTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Support & Help Box on App Detail Pages
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Support Box Title
                  </label>
                  <input
                    type="text"
                    value={content.appDetailPage.supportSectionTitle}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        appDetailPage: { ...content.appDetailPage, supportSectionTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Support Box Description
                  </label>
                  <input
                    type="text"
                    value={content.appDetailPage.supportSectionDescription}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        appDetailPage: { ...content.appDetailPage, supportSectionDescription: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Google Play Disclaimer / Trademark Notice
              </label>
              <input
                type="text"
                value={content.appDetailPage.disclaimerText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    appDetailPage: { ...content.appDetailPage, disclaimerText: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. SUPPORT PAGE & FAQS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Support Page & FAQ Management
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage support ticket desk notices, response times, and add, edit, or delete public frequently asked questions.
                </p>
              </div>
              <a
                href="/support"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Preview Support Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Support Page Heading (H1)
                </label>
                <input
                  type="text"
                  value={content.supportPage.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      supportPage: { ...content.supportPage, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subtitle Description
                </label>
                <input
                  type="text"
                  value={content.supportPage.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      supportPage: { ...content.supportPage, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ticket Form Title
                </label>
                <input
                  type="text"
                  value={content.supportPage.formTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      supportPage: { ...content.supportPage, formTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Response Time Notice
                </label>
                <input
                  type="text"
                  value={content.supportPage.responseTimeNotice}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      supportPage: { ...content.supportPage, responseTimeNotice: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            {/* Dynamic FAQs Editor */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Frequently Asked Questions ({content.supportPage.faqs.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Add, edit, or remove FAQ questions and answers displayed on the support portal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [
                      ...content.supportPage.faqs,
                      { q: 'New Support Question?', a: 'Detailed answer explaining the solution to the user.' },
                    ];
                    setContent({
                      ...content,
                      supportPage: { ...content.supportPage, faqs: updated },
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 inline-flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {content.supportPage.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        Question #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.supportPage.faqs.filter((_, i) => i !== idx);
                          setContent({
                            ...content,
                            supportPage: { ...content.supportPage, faqs: updated },
                          });
                        }}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => {
                        const updated = [...content.supportPage.faqs];
                        updated[idx].q = e.target.value;
                        setContent({
                          ...content,
                          supportPage: { ...content.supportPage, faqs: updated },
                        });
                      }}
                      placeholder="e.g. How do I backup my data?"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />

                    <textarea
                      rows={3}
                      value={faq.a}
                      onChange={(e) => {
                        const updated = [...content.supportPage.faqs];
                        updated[idx].a = e.target.value;
                        setContent({
                          ...content,
                          supportPage: { ...content.supportPage, faqs: updated },
                        });
                      }}
                      placeholder="Detailed answer..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. CONTACT PAGE MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Contact Page Content Editor
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update contact page headings, corporate office details, turnaround times, and form success messages.
                </p>
              </div>
              <a
                href="/contact"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Preview Contact Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Page Heading (H1)
                </label>
                <input
                  type="text"
                  value={content.contactPage.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactPage: { ...content.contactPage, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Response Turnaround Notice
                </label>
                <input
                  type="text"
                  value={content.contactPage.responseTimeText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactPage: { ...content.contactPage, responseTimeText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subtitle / Intro Note
              </label>
              <textarea
                rows={2}
                value={content.contactPage.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contactPage: { ...content.contactPage, subtitle: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Corporate Location / Address Card
              </h4>
              <input
                type="text"
                value={content.contactPage.officeLocationTitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contactPage: { ...content.contactPage, officeLocationTitle: e.target.value },
                  })
                }
                placeholder="Title (e.g. Registered Corporate Information)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              />
              <textarea
                rows={3}
                value={content.contactPage.officeLocationText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contactPage: { ...content.contactPage, officeLocationText: e.target.value },
                  })
                }
                placeholder="Official address or registered company jurisdiction info"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Success Headline
                </label>
                <input
                  type="text"
                  value={content.contactPage.successTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactPage: { ...content.contactPage, successTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Success Message
                </label>
                <input
                  type="text"
                  value={content.contactPage.successMessage}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactPage: { ...content.contactPage, successMessage: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 7. PRIVACY POLICY */}
        {/* ========================================================= */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Privacy Policy Editor
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compliant with Google Play Developer Policy, AdMob requirements, and COPPA standards.
                </p>
              </div>
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Preview Privacy Policy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Last Updated Date
              </label>
              <input
                type="text"
                value={content.privacyLastUpdated || 'September 1, 2026'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    privacyLastUpdated: e.target.value,
                  })
                }
                className="w-full max-w-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Policy Content (Markdown Supported)
              </label>
              <textarea
                rows={16}
                value={content.privacyPolicy}
                onChange={(e) => setContent({ ...content, privacyPolicy: e.target.value })}
                className="w-full font-mono text-xs p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 8. TERMS & CONDITIONS */}
        {/* ========================================================= */}
        {activeTab === 'terms' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Terms & Conditions Editor
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Legal agreements covering intellectual property, acceptable use, software disclaimers, and liability.
                </p>
              </div>
              <a
                href="/terms"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Preview Terms</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Last Updated Date
              </label>
              <input
                type="text"
                value={content.termsLastUpdated || 'September 1, 2026'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    termsLastUpdated: e.target.value,
                  })
                }
                className="w-full max-w-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Terms & Conditions Content (Markdown Supported)
              </label>
              <textarea
                rows={16}
                value={content.termsConditions}
                onChange={(e) => setContent({ ...content, termsConditions: e.target.value })}
                className="w-full font-mono text-xs p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 9. FOOTER & SOCIAL LINKS */}
        {/* ========================================================= */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Footer Content & Social Links
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure copyright statements, quick links visibility, and verified official social profile URLs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Copyright Text
                </label>
                <input
                  type="text"
                  value={content.footerContent.copyrightText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerContent: { ...content.footerContent, copyrightText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Trademark / Disclaimer Notice
                </label>
                <input
                  type="text"
                  value={content.footerContent.disclaimerText || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerContent: { ...content.footerContent, disclaimerText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Footer Brand Summary
              </label>
              <textarea
                rows={2}
                value={content.footerContent.description || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footerContent: { ...content.footerContent, description: e.target.value },
                  })
                }
                placeholder="Brief summary of company purpose in footer..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            {/* Visibility Toggles */}
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 flex flex-wrap items-center gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={content.footerContent.showQuickLinks}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerContent: { ...content.footerContent, showQuickLinks: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>Show Navigation Links</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={content.footerContent.showCategories}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerContent: { ...content.footerContent, showCategories: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>Show Categories Links</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={content.footerContent.showLegal}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footerContent: { ...content.footerContent, showLegal: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>Show Legal & Compliance</span>
              </label>
            </div>

            {/* Social Links Form */}
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Official Social Profiles
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Twitter / X
                  </label>
                  <input
                    type="url"
                    value={content.footerContent.socialLinks?.twitter || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footerContent: {
                          ...content.footerContent,
                          socialLinks: {
                            ...content.footerContent.socialLinks,
                            twitter: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="https://x.com/..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={content.footerContent.socialLinks?.linkedin || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footerContent: {
                          ...content.footerContent,
                          socialLinks: {
                            ...content.footerContent,
                            linkedin: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="https://linkedin.com/company/..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    GitHub Organization
                  </label>
                  <input
                    type="url"
                    value={content.footerContent.socialLinks?.github || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footerContent: {
                          ...content.footerContent,
                          socialLinks: {
                            ...content.footerContent,
                            github: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    YouTube Channel
                  </label>
                  <input
                    type="url"
                    value={content.footerContent.socialLinks?.youtube || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footerContent: {
                          ...content.footerContent,
                          socialLinks: {
                            ...content.footerContent,
                            youtube: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="https://youtube.com/@..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 10. COMPANY & SYSTEM SETTINGS */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Company Legal Identity & AdMob Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage registered organization legal entity names, branding, developer URLs, logo, and app-ads.txt compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Registered Legal Entity Name *
                </label>
                <input
                  type="text"
                  value={settings.organizationName}
                  onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Consumer Publishing Brand Name *
                </label>
                <input
                  type="text"
                  value={settings.brandName}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Slogan
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Google Play Developer Page URL
                </label>
                <input
                  type="url"
                  value={settings.playStoreDeveloperUrl || ''}
                  onChange={(e) => setSettings({ ...settings, playStoreDeveloperUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Support Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  General Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploader
                label="Company Logo (Cloudinary / Storage)"
                value={settings.logoUrl}
                onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                aspectRatioHint="Recommended: 512 x 512px PNG"
              />
              <ImageUploader
                label="Favicon / Icon"
                value={settings.faviconUrl}
                onChange={(url) => setSettings({ ...settings, faviconUrl: url })}
                aspectRatioHint="Recommended: 64 x 64px ICO or PNG"
              />
            </div>

            {/* AdMob & app-ads.txt */}
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Google AdMob app-ads.txt Configuration
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Served directly at <code className="text-indigo-600 font-mono">/app-ads.txt</code> for AdMob authorized digital seller verification.
                  </p>
                </div>
                <a
                  href="/app-ads.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>View /app-ads.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <textarea
                rows={5}
                value={settings.appAdsTxtContent || settings.appAdsTxt || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appAdsTxtContent: e.target.value,
                    appAdsTxt: e.target.value,
                  })
                }
                className="w-full font-mono text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
