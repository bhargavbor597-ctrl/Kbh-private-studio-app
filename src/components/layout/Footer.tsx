import React, { useEffect, useState } from 'react';
import { Link } from '../../context/RouterContext.tsx';
import { SiteSettings, PageContent } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Shield, Lock, FileText, ExternalLink, Mail, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);

  useEffect(() => {
    Promise.all([api.getSettings(), api.getPageContent()])
      .then(([settingsRes, contentRes]) => {
        if (settingsRes.success && settingsRes.settings) setSettings(settingsRes.settings);
        if (contentRes.success && contentRes.content) setContent(contentRes.content);
      })
      .catch(() => {});
  }, []);

  const currentYear = new Date().getFullYear();
  const orgName = settings?.organizationName || 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED';
  const brandName = settings?.brandName || 'KHB Private Limited';
  const supportEmail = settings?.supportEmail || 'support@khbenterprise.com';
  const contactEmail = settings?.contactEmail || 'contact@khbenterprise.com';
  const footer = content?.footerContent;

  const socialLinks = footer?.socialLinks || settings?.socialLinks || {};

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={brandName}
                  className="w-9 h-9 rounded-xl object-contain bg-white p-1 shadow-md"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md">
                  <span>KHB</span>
                </div>
              )}
              <span className="font-bold text-xl text-white tracking-tight">
                {footer?.brandName || brandName}
              </span>
            </div>
            <p className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
              {orgName}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {footer?.description ||
                settings?.description ||
                'We create useful mobile applications and engaging games designed to provide simple, practical and enjoyable digital experiences.'}
            </p>
            <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Support: </span>
                <a href={`mailto:${supportEmail}`} className="text-slate-200 hover:text-white underline">
                  {supportEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Contact: </span>
                <a href={`mailto:${contactEmail}`} className="text-slate-200 hover:text-white underline">
                  {contactEmail}
                </a>
              </div>
            </div>

            {/* Social Icons list */}
            {Object.keys(socialLinks).length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Twitter/X
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    YouTube
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          {(!footer || footer.showQuickLinks !== false) && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2 text-sm">
                {(settings?.navigation?.footerQuickLinks && settings.navigation.footerQuickLinks.length > 0
                  ? settings.navigation.footerQuickLinks.filter((l) => l.visible !== false)
                  : [
                      { id: '1', label: 'Home', href: '/' },
                      { id: '2', label: 'Our Apps & Games', href: '/apps' },
                      { id: '3', label: 'About Us', href: '/about' },
                      { id: '4', label: 'Support & Help', href: '/support' },
                      { id: '5', label: 'Contact Us', href: '/contact' },
                    ]
                ).map((link) => (
                  <li key={link.id}>
                    <Link to={link.href} className="text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* App Categories */}
          {(!footer || footer.showCategories !== false) && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/apps?category=Productivity" className="text-slate-400 hover:text-white transition-colors">
                    Productivity Apps
                  </Link>
                </li>
                <li>
                  <Link to="/apps?category=Utilities" className="text-slate-400 hover:text-white transition-colors">
                    Utility Tools
                  </Link>
                </li>
                <li>
                  <Link to="/apps?category=Games" className="text-slate-400 hover:text-white transition-colors">
                    Mobile Games
                  </Link>
                </li>
                <li>
                  <Link to="/apps?category=Tools" className="text-slate-400 hover:text-white transition-colors">
                    Digital Tools
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Legal & Publisher Compliance */}
          {(!footer || footer.showLegal !== false) && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal & Compliance</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/privacy-policy" id="footer-privacy-policy" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" id="footer-terms-conditions" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Terms & Conditions</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="/app-ads.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="footer-app-ads"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>app-ads.txt</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                {settings?.playStoreDeveloperUrl && (
                  <li>
                    <a
                      href={settings.playStoreDeveloperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <span>Google Play Developer</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1">
            <p>
              © {currentYear} {footer?.copyrightText || `${orgName}. All Rights Reserved.`}
            </p>
            {footer?.disclaimerText && (
              <p className="text-[11px] text-slate-500">
                {footer.disclaimerText}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-slate-600">•</span>
            <Link
              to="/admin/login"
              id="footer-admin-link"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
              title="Organization Admin Console"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
