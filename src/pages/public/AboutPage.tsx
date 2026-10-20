import React, { useEffect, useState } from 'react';
import { SiteSettings, PageContent } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Link } from '../../context/RouterContext.tsx';
import {
  Smartphone,
  Gamepad2,
  Layers,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, contentRes] = await Promise.all([
          api.getSettings(),
          api.getPageContent(),
        ]);
        if (settingsRes.success) setSettings(settingsRes.settings);
        if (contentRes.success) setContent(contentRes.content);
      } catch (err) {
        console.error('Failed to load about data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const orgName = settings?.organizationName || 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED';
  const brandName = settings?.brandName || 'KHB Private Limited';
  const about = content?.aboutPage;
  const legacyAbout = content?.aboutContent;

  const pillars = about?.pillars || [
    {
      title: 'Useful Mobile Applications',
      description: 'We develop tools that assist users with daily productivity, task management, notes, smart calculations, and device organization.',
      icon: 'Smartphone',
    },
    {
      title: 'Engaging Mobile Games',
      description: 'We engineer brain teasers, strategy games like Chess, puzzle challenges, and physics-based arcade experiences that provide relaxing, offline-ready entertainment.',
      icon: 'Gamepad2',
    },
    {
      title: 'Simple Digital Tools',
      description: 'Our software is engineered with clean ergonomics, minimal permission footprints, and fast load times. We believe tools should solve problems without unnecessary clutter.',
      icon: 'Layers',
    },
    {
      title: 'User Privacy & Security',
      description: 'We adhere strictly to Google Play policy guidelines and privacy regulations. Personal user data remains on-device wherever feasible, maintaining user trust and confidentiality.',
      icon: 'ShieldCheck',
    },
  ];

  return (
    <div className="min-h-screen py-10 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{about?.badge || 'About Our Organization'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {about?.title || orgName}
        </h1>
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-2 uppercase tracking-wider">
          {about?.subtitle || `Publishing Brand: ${brandName}`}
        </p>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-6 leading-relaxed">
          {about?.intro ||
            legacyAbout?.intro ||
            'KHB Private Limited (KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED) is a software engineering company dedicated to designing and publishing useful mobile applications, intuitive utility tools, and engaging casual games.'}
        </p>
      </div>

      {/* Optional About Hero / Office Image */}
      {about?.heroImage && (
        <div className="mb-16 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md max-h-96">
          <img
            src={about.heroImage}
            alt={about.title || orgName}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {pillars.map((pillar, idx) => {
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                {idx === 0 ? (
                  <Smartphone className="w-6 h-6 text-blue-600" />
                ) : idx === 1 ? (
                  <Gamepad2 className="w-6 h-6 text-purple-600" />
                ) : idx === 2 ? (
                  <Layers className="w-6 h-6 text-emerald-600" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {pillar.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Purpose & Approach Section */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 mb-16">
        <div className="max-w-3xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Our Mission & Purpose
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {about?.ourPurpose ||
                legacyAbout?.ourPurpose ||
                'We believe that mobile software should be intuitive, lightweight, and respectful of user attention. In an era of overloaded apps, we prioritize practical value, clean design, and reliable performance.'}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Our Engineering Approach
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {about?.ourApproach ||
                legacyAbout?.ourApproach ||
                'We craft software through rigorous testing, minimal permission footprints, responsive modern styling, and continuous user-driven iterations.'}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Future Vision
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {about?.vision ||
                legacyAbout?.vision ||
                'We continuously iterate on user feedback to release high-quality Android apps on Google Play that empower users in their personal, educational, and professional lives.'}
            </p>
          </div>
        </div>
      </div>

      {/* Direct Contact CTA */}
      <div className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {about?.ctaTitle || 'Connect With Our Team'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
          {about?.ctaSubtitle ||
            'Have an inquiry, partnership proposal, or feedback regarding any of our published software products?'}
        </p>
        <div className="flex justify-center gap-4">
          {(!about?.ctaButton || about.ctaButton.visible !== false) && (
            <Link
              to={about?.ctaButton?.url || '/contact'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <span>{about?.ctaButton?.text || 'Send Official Message'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            to="/apps"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <span>View Published Apps</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
