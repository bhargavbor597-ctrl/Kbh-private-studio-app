export type AppStatus = 'Published' | 'Coming Soon' | 'Draft';

export interface AppFAQ {
  question: string;
  answer: string;
}

export interface AppItem {
  id: string;
  name: string;
  slug: string;
  packageName?: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  screenshots: string[];
  category: string;
  appType: string;
  platform: string;
  status: AppStatus;
  version: string;
  features: string[];
  permissions: string[];
  playStoreUrl?: string;
  privacyPolicy?: string;
  supportEmail?: string;
  websiteUrl?: string;
  faq: AppFAQ[];
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  app?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  createdAt: string;
}

export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  app: string;
  type: 'problem' | 'feature' | 'general';
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
}

export interface ButtonConfig {
  text: string;
  url: string;
  visible: boolean;
}

export interface SectionItem {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  badge?: string;
}

export interface FAQItem {
  id?: string;
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
  enabled?: boolean;
}

export interface HomeContent {
  hero: {
    badge: string;
    heading: string;
    subtitle: string;
    description: string;
    heroImage?: string;
    primaryButton: ButtonConfig;
    secondaryButton: ButtonConfig;
  };
  stats: {
    enabled: boolean;
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    stat3Label: string;
    stat3Value: string;
    stat4Label: string;
    stat4Value: string;
  };
  featuredSection: {
    enabled: boolean;
    badge: string;
    title: string;
    subtitle: string;
    viewAllButton: ButtonConfig;
  };
  categoriesSection: {
    enabled: boolean;
    title: string;
    subtitle: string;
  };
  latestSection: {
    enabled: boolean;
    title: string;
    subtitle: string;
    viewAllButton: ButtonConfig;
  };
  whyChooseSection: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: SectionItem[];
  };
  aboutSummarySection: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    bannerImage?: string;
    primaryButton: ButtonConfig;
    secondaryButton: ButtonConfig;
  };
  ctaSection: {
    enabled: boolean;
    title: string;
    subtitle: string;
    primaryButton: ButtonConfig;
    secondaryButton: ButtonConfig;
  };
}

export interface AboutPageContent {
  badge: string;
  title: string;
  subtitle: string;
  heroImage?: string;
  intro: string;
  whoWeAre: string;
  whatWeBuild: string;
  ourPurpose: string;
  ourApproach: string;
  vision: string;
  mission?: string;
  pillars: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: ButtonConfig;
}

export interface OurAppsPageContent {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  categoryFilterLabel: string;
  statusFilterLabel: string;
  sortLabel: string;
  noAppsFoundMessage: string;
  headerBanner?: string;
}

export interface AppDetailPageContent {
  backButtonText: string;
  featuresTitle: string;
  screenshotsTitle: string;
  faqTitle: string;
  permissionsTitle?: string;
  permissionsNoticeTitle?: string;
  supportSectionTitle?: string;
  supportSectionDescription?: string;
  playStoreButtonLabel: string;
  appStoreButtonLabel?: string;
  supportCTATitle?: string;
  privacyCTATitle?: string;
  disclaimerText?: string;
}

export interface SupportPageContent {
  badge: string;
  title: string;
  subtitle: string;
  formTitle: string;
  formSubtitle?: string;
  responseTimeNotice: string;
  directEmailTitle: string;
  directEmailSubtitle: string;
  faqSectionTitle: string;
  faqSectionSubtitle?: string;
  faqs: FAQItem[];
}

export interface ContactPageContent {
  title: string;
  subtitle: string;
  formTitle: string;
  formSubtitle: string;
  responseTimeText: string;
  officeLocationTitle: string;
  officeLocationText: string;
  successTitle: string;
  successMessage: string;
}

export interface FooterContent {
  brandName?: string;
  description?: string;
  copyrightText: string;
  showQuickLinks: boolean;
  showCategories: boolean;
  showLegal: boolean;
  disclaimerText?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface PageContent {
  privacyPolicy: string;
  termsConditions: string;
  privacyLastUpdated?: string;
  termsLastUpdated?: string;
  aboutContent: {
    intro: string;
    whoWeAre: string;
    whatWeBuild: string;
    ourPurpose: string;
    ourApproach: string;
    vision: string;
  };
  homeContent: HomeContent;
  aboutPage: AboutPageContent;
  ourAppsPage: OurAppsPageContent;
  appDetailPage: AppDetailPageContent;
  supportPage: SupportPageContent;
  contactPage: ContactPageContent;
  footerContent: FooterContent;
}

// ==========================================
// THEME & APPEARANCE SYSTEM
// ==========================================
export type PresetThemeId =
  | 'modern-blue'
  | 'premium-dark'
  | 'minimal-white'
  | 'purple-gradient'
  | 'green-technology'
  | 'orange-creative'
  | 'black-gold'
  | 'custom';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textMain: string;
  textMuted: string;
  border: string;
  headerBg: string;
  footerBg: string;
  cardBg: string;
}

export interface CustomThemePreset {
  id: string;
  name: string;
  description?: string;
  colors: ThemeColors;
  fontFamily: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  buttonStyle: 'rounded' | 'pill' | 'sharp' | 'soft';
  shadows: 'none' | 'sm' | 'md' | 'lg';
  mode: 'light' | 'dark' | 'system';
}

export interface SiteThemeSettings {
  activeThemeId: PresetThemeId;
  colors: ThemeColors;
  fontFamily: string;
  fontSize: 'sm' | 'base' | 'lg';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  buttonStyle: 'rounded' | 'pill' | 'sharp' | 'soft';
  shadows: 'none' | 'sm' | 'md' | 'lg';
  mode: 'light' | 'dark' | 'system';
  customThemes: CustomThemePreset[];
}

// ==========================================
// CONTACT INFO & EMAIL SERVICE
// ==========================================
export interface ContactInfoSettings {
  publicContactEmail: string;
  customerSupportEmail: string;
  businessEmail: string;
  contactPhone: string;
  companyAddress: string;
  supportHours: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
  };
  contactPageHeading: string;
  contactPageSubtitle: string;
  formLabels: {
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    messageLabel: string;
    submitButtonText: string;
  };
  emailServiceConfig: {
    provider: 'smtp' | 'resend' | 'sendgrid' | 'direct';
    configured: boolean;
    senderAddress: string;
    statusMessage: string;
  };
  testEmailLogs?: Array<{
    recipient: string;
    timestamp: string;
    status: 'success' | 'simulated' | 'failed';
    details: string;
  }>;
}

// ==========================================
// APP-ADS.TXT MANAGEMENT
// ==========================================
export interface AuthorizedSellerEntry {
  domain: string;
  publisherId: string;
  relation: 'DIRECT' | 'RESELLER';
  certificationAuthorityId?: string;
}

export interface AppAdsTxtSettings {
  content: string;
  admobPublisherId: string;
  authorizedSellers: AuthorizedSellerEntry[];
  lastUpdated: string;
  publishStatus: 'published' | 'draft' | 'needs-review';
}

// ==========================================
// SEO & METADATA
// ==========================================
export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageUrl: string;
  twitterCardType: 'summary' | 'summary_large_image';
  canonicalBaseUrl: string;
  googleSearchConsoleVerification: string;
  googlePlayDeveloperVerification: string;
  robotsTxtContent: string;
  enableStructuredData: boolean;
}

// ==========================================
// NAVIGATION & MENUS
// ==========================================
export interface NavMenuItem {
  id: string;
  label: string;
  href: string;
  openInNewTab?: boolean;
  visible: boolean;
  displayOrder: number;
}

export interface NavigationSettings {
  headerMenuItems: NavMenuItem[];
  footerQuickLinks: NavMenuItem[];
  footerCategoryLinks: NavMenuItem[];
  footerLegalLinks: NavMenuItem[];
}

// ==========================================
// MEDIA & ASSET LIBRARY
// ==========================================
export interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: 'logo' | 'hero' | 'app-icon' | 'screenshot' | 'banner' | 'other';
  size?: number;
  type?: string;
  uploadedAt: string;
}

// ==========================================
// COMPLETE SITE SETTINGS
// ==========================================
export interface SiteSettings {
  organizationName: string;
  brandName: string;
  tagline: string;
  description: string;
  supportEmail: string;
  contactEmail: string;
  websiteUrl: string;
  playStoreDeveloperUrl?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
  };
  logoUrl?: string;
  faviconUrl?: string;
  admobPublisherId?: string;
  appAdsTxtContent: string;
  appAdsTxt?: string;

  // Advanced modules
  theme?: SiteThemeSettings;
  contactInfo?: ContactInfoSettings;
  appAds?: AppAdsTxtSettings;
  seo?: SEOSettings;
  navigation?: NavigationSettings;
  mediaLibrary?: MediaItem[];
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
}
