import { AppItem, SiteSettings, PageContent, AdminUser } from '../types.js';
import bcrypt from 'bcryptjs';

export const initialSettings: SiteSettings = {
  organizationName: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED',
  brandName: 'KHB Private Limited',
  tagline: 'Building Useful Apps and Digital Experiences',
  description: 'We create useful mobile applications and engaging games designed to provide simple, practical and enjoyable digital experiences.',
  supportEmail: 'support@khbenterprise.com',
  contactEmail: 'contact@khbenterprise.com',
  websiteUrl: 'https://kbh-private-studio-app.vercel.app',
  playStoreDeveloperUrl: 'https://play.google.com/store/apps/developer?id=KHB+Private+Limited',
  socialLinks: {
    twitter: 'https://twitter.com/khbenterprise',
    linkedin: 'https://linkedin.com/company/khb-enterprise',
    github: 'https://github.com/khb-enterprise',
  },
  logoUrl: '',
  admobPublisherId: 'pub-0000000000000000',
  appAdsTxtContent: '# KHB Private Limited - Google AdMob Authorized Digital Sellers\n# Replace with your verified AdMob publisher ID before app release:\ngoogle.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n',

  // Advanced modules
  theme: {
    activeThemeId: 'modern-blue',
    colors: {
      primary: '#4f46e5',
      primaryHover: '#4338ca',
      secondary: '#0f172a',
      accent: '#06b6d4',
      background: '#f8fafc',
      surface: '#ffffff',
      textMain: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      headerBg: '#ffffff',
      footerBg: '#0f172a',
      cardBg: '#ffffff',
    },
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'base',
    borderRadius: 'xl',
    buttonStyle: 'rounded',
    shadows: 'sm',
    mode: 'light',
    customThemes: [],
  },
  contactInfo: {
    publicContactEmail: 'contact@khbenterprise.com',
    customerSupportEmail: 'support@khbenterprise.com',
    businessEmail: 'inquiries@khbenterprise.com',
    contactPhone: '+1 (555) 234-5678',
    companyAddress: 'Gujarat, India / Global Mobile Publishing',
    supportHours: 'Monday - Friday: 9:00 AM – 6:00 PM IST (Turnaround: 24–48 hours)',
    socialLinks: {
      twitter: 'https://twitter.com/khbenterprise',
      linkedin: 'https://linkedin.com/company/khb-enterprise',
      github: 'https://github.com/khb-enterprise',
    },
    contactPageHeading: 'Contact & Official Inquiries',
    contactPageSubtitle: 'Get in touch with the team at KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED (KHB Private Limited). We welcome feedback, developer inquiries, and technical questions.',
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
      statusMessage: 'Ready for production SMTP or Resend API key integration via environment variables.',
    },
    testEmailLogs: [],
  },
  appAds: {
    content: '# KHB Private Limited - Google AdMob Authorized Digital Sellers\n# Replace with your verified AdMob publisher ID before app release:\ngoogle.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n',
    admobPublisherId: 'pub-0000000000000000',
    authorizedSellers: [
      {
        domain: 'google.com',
        publisherId: 'pub-0000000000000000',
        relation: 'DIRECT',
        certificationAuthorityId: 'f08c47fec0942fa0',
      },
    ],
    lastUpdated: 'September 1, 2026',
    publishStatus: 'published',
  },
  seo: {
    metaTitle: 'KHB Private Limited | Official Organization & Android Apps',
    metaDescription: 'Official company and mobile apps publishing website for KHB Private Limited (KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED). Discover reliable productivity tools and casual games.',
    metaKeywords: 'KHB Private Limited, KAMBARIYA-HB, mobile apps, Android apps, Google Play, utility tools, casual games, developer',
    ogImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    twitterCardType: 'summary_large_image',
    canonicalBaseUrl: 'https://kbh-private-studio-app.vercel.app',
    googleSearchConsoleVerification: 'b8imPF_4NNCALLvmwffUqdhf8X50oLRGOiUUkkFXzpE',
    googlePlayDeveloperVerification: 'KHB Private Limited',
    robotsTxtContent: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://kbh-private-studio-app.vercel.app/sitemap.xml
`,
    enableStructuredData: true,
  },
  navigation: {
    headerMenuItems: [
      { id: 'nav-home', label: 'Home', href: '/', visible: true, displayOrder: 1 },
      { id: 'nav-apps', label: 'Our Apps', href: '/apps', visible: true, displayOrder: 2 },
      { id: 'nav-about', label: 'About Us', href: '/about', visible: true, displayOrder: 3 },
      { id: 'nav-support', label: 'Support', href: '/support', visible: true, displayOrder: 4 },
      { id: 'nav-contact', label: 'Contact', href: '/contact', visible: true, displayOrder: 5 },
    ],
    footerQuickLinks: [
      { id: 'foot-home', label: 'Home', href: '/', visible: true, displayOrder: 1 },
      { id: 'foot-apps', label: 'Our Apps & Games', href: '/apps', visible: true, displayOrder: 2 },
      { id: 'foot-about', label: 'About Us', href: '/about', visible: true, displayOrder: 3 },
      { id: 'foot-support', label: 'Support & Help', href: '/support', visible: true, displayOrder: 4 },
      { id: 'foot-contact', label: 'Contact Us', href: '/contact', visible: true, displayOrder: 5 },
    ],
    footerCategoryLinks: [
      { id: 'cat-prod', label: 'Productivity Apps', href: '/apps?category=Productivity', visible: true, displayOrder: 1 },
      { id: 'cat-util', label: 'Utility Tools', href: '/apps?category=Utilities', visible: true, displayOrder: 2 },
      { id: 'cat-games', label: 'Mobile Games', href: '/apps?category=Games', visible: true, displayOrder: 3 },
      { id: 'cat-tools', label: 'Digital Tools', href: '/apps?category=Tools', visible: true, displayOrder: 4 },
    ],
    footerLegalLinks: [
      { id: 'leg-priv', label: 'Privacy Policy', href: '/privacy-policy', visible: true, displayOrder: 1 },
      { id: 'leg-terms', label: 'Terms & Conditions', href: '/terms', visible: true, displayOrder: 2 },
      { id: 'leg-ads', label: 'app-ads.txt', href: '/app-ads.txt', openInNewTab: true, visible: true, displayOrder: 3 },
    ],
  },
  mediaLibrary: [
    {
      id: 'med-logo-1',
      name: 'KHB Brand Badge',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=240&auto=format&fit=crop&q=80',
      category: 'logo',
      uploadedAt: '2026-08-01T12:00:00.000Z',
    },
    {
      id: 'med-hero-1',
      name: 'Modern Studio Visual',
      url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop&q=80',
      category: 'hero',
      uploadedAt: '2026-08-01T12:00:00.000Z',
    },
    {
      id: 'med-app-auto-clicker',
      name: 'Auto Clicker Icon',
      url: '/assets/auto-clicker-icon.svg',
      category: 'app-icon',
      uploadedAt: '2026-11-15T00:00:00.000Z',
    },
  ],
};

export const initialPageContent: PageContent = {
  privacyPolicy: `# Privacy Policy
**KHB Private Limited (KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED)**
*Last updated: September 1, 2026*

This Privacy Policy explains how KHB Private Limited ("we", "us", or "our") collects, uses, and discloses information about you when you use our mobile applications, games, and website services.

### 1. Information We Collect
We believe in minimal data collection. Most of our utility apps and casual games function entirely on-device without requiring an account.
- **Device & Technical Information:** Hardware model, operating system version, anonymous device identifiers, and general diagnostic crash logs.
- **Support & Inquiries:** When you contact us directly via email or our support forms, we receive your name, email address, and message contents.

### 2. Information We Do Not Collect
- We do NOT collect personal financial account data, government ID numbers, or sensitive personal documents.
- We do NOT sell, rent, or trade your personal information to third parties.

### 3. Third-Party Services & Advertising
Some of our free applications display advertisements provided by Google AdMob. These services may collect pseudonymous identifiers (e.g., Google Advertising ID) subject to their respective privacy policies:
- **Google Play Services:** https://policies.google.com/privacy
- **Google AdMob:** https://support.google.com/admob/answer/6128543

### 4. Children's Privacy
Our applications comply with the Children's Online Privacy Protection Act (COPPA) and Google Play Families Policy. Apps targeted toward general audiences or families do not knowingly collect personal information from children under 13 without verifiable parental consent.

### 5. Data Security
We implement industry-standard security protocols to protect data against unauthorized access, alteration, or destruction.

### 6. User Rights & Contact
You have the right to inquire about any data we retain or request its deletion. For any questions regarding this Privacy Policy, contact us at:
**Email:** support@khbenterprise.com  
**Legal Entity:** KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED
`,
  termsConditions: `# Terms & Conditions
**KHB Private Limited (KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED)**
*Last updated: September 1, 2026*

Please read these Terms & Conditions ("Terms") carefully before downloading or using applications or services provided by KHB Private Limited.

### 1. Acceptance of Terms
By downloading, installing, or accessing our mobile applications or website, you agree to be bound by these Terms. If you do not agree, please do not use our software.

### 2. Intellectual Property Rights
All visual designs, software code, trademarks, game assets, graphics, and logos published under KHB Private Limited / KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED are the exclusive property of the company and protected by copyright and intellectual property laws.

### 3. Acceptable Use
You agree not to reverse engineer, decompile, modify, or distribute unauthorized clones of our applications. You agree not to use our services for unlawful, abusive, or harmful purposes.

### 4. Disclaimers & Limitation of Liability
Our applications and services are provided on an "AS IS" and "AS AVAILABLE" basis. To the maximum extent permitted by applicable law, KHB Private Limited shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the apps.

### 5. Updates & Termination
We reserve the right to update, modify, or discontinue any app or feature at any time without prior notice.

### 6. Contact Us
For legal questions regarding these terms, reach out to:
**Email:** contact@khbenterprise.com  
**Organization:** KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED
`,
  aboutContent: {
    intro: 'KHB Private Limited (KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED) is a modern technology company focused on designing and engineering reliable mobile applications, utility tools, and interactive digital experiences.',
    whoWeAre: 'We are an agile software engineering team passionate about creating fast, privacy-respecting, and purposeful software for millions of Android smartphone users globally.',
    whatWeBuild: 'Our portfolio spans smart daily utilities, personal productivity systems, offline calculations, and casual mobile games built with clean user interfaces and smooth performance.',
    ourPurpose: 'We believe mobile software should be intuitive, lightweight, and respectful of user attention. We eliminate unnecessary friction to deliver practical value.',
    ourApproach: 'We craft software through rigorous testing, minimal permission footprints, responsive modern styling, and continuous user-driven iterations.',
    vision: 'To continuously expand our library of dependable digital products on Google Play that empower users in their daily personal and professional routines.',
  },
  privacyLastUpdated: 'September 1, 2026',
  termsLastUpdated: 'September 1, 2026',
  homeContent: {
    hero: {
      badge: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED',
      heading: 'Building Useful Apps and Digital Experiences',
      subtitle: 'Official Android Publishing & Software Studio',
      description: 'We create useful mobile applications and engaging games designed to provide simple, practical and enjoyable digital experiences.',
      heroImage: '',
      primaryButton: {
        text: 'Explore Our Apps',
        url: '/apps',
        visible: true,
      },
      secondaryButton: {
        text: 'Contact Support',
        url: '/support',
        visible: true,
      },
    },
    stats: {
      enabled: true,
      stat1Label: 'Published Apps',
      stat1Value: 'Live Dynamic',
      stat2Label: 'Coming Soon',
      stat2Value: 'In Pipeline',
      stat3Label: 'Categories',
      stat3Value: '4+ Focus Areas',
      stat4Label: 'Privacy Commitment',
      stat4Value: '100% On-Device',
    },
    featuredSection: {
      enabled: true,
      badge: 'Featured Releases',
      title: 'Our Top Applications',
      subtitle: 'Handpicked mobile tools and experiences built with performance, security, and intuitive design in mind.',
      viewAllButton: {
        text: 'View All Apps',
        url: '/apps',
        visible: true,
      },
    },
    categoriesSection: {
      enabled: true,
      title: 'Explore by Category',
      subtitle: 'Find software crafted for everyday efficiency and recreation.',
    },
    latestSection: {
      enabled: true,
      title: 'Latest Published Apps',
      subtitle: 'Discover our newest additions to Google Play and upcoming digital tools.',
      viewAllButton: {
        text: 'See Complete Directory',
        url: '/apps',
        visible: true,
      },
    },
    whyChooseSection: {
      enabled: true,
      title: 'Why Users Choose Our Apps',
      subtitle: 'We design mobile software with a laser focus on speed, user privacy, and dependable utility.',
      items: [
        {
          title: 'Privacy By Design',
          description: 'Zero intrusive personal tracking. Our apps store your sensitive notes, expenses, and settings safely on your physical device.',
          icon: 'Lock',
        },
        {
          title: 'Lightweight & Fast',
          description: 'Optimized APK sizes and rapid launch times. Engineered to conserve battery and run smoothly on modern and budget devices alike.',
          icon: 'Zap',
        },
        {
          title: '100% Offline Capable',
          description: 'Core features work seamlessly without an active internet connection. Perfect for commutes, flights, and low-connectivity regions.',
          icon: 'Smartphone',
        },
        {
          title: 'Minimal Permissions',
          description: "We only request permissions essential to the application's explicit features. Transparent explanations provided in every app.",
          icon: 'ShieldCheck',
        },
      ],
    },
    aboutSummarySection: {
      enabled: true,
      badge: 'About Organization',
      title: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED',
      description: 'Operating under the consumer brand KHB Private Limited, our engineering organization is dedicated to creating accessible mobile tools, productivity software, and interactive games. We adhere strictly to Google Play developer standards and respect customer digital rights.',
      bannerImage: '',
      primaryButton: {
        text: 'Read Full Company Profile',
        url: '/about',
        visible: true,
      },
      secondaryButton: {
        text: 'Help & Support Center',
        url: '/support',
        visible: true,
      },
    },
    ctaSection: {
      enabled: true,
      title: 'Have a question or need technical support?',
      subtitle: 'Whether you need help with an app or want to suggest a new feature, our support team is here to assist you.',
      primaryButton: {
        text: 'Submit Support Request',
        url: '/support',
        visible: true,
      },
      secondaryButton: {
        text: 'Contact Us',
        url: '/contact',
        visible: true,
      },
    },
  },
  aboutPage: {
    badge: 'About Our Organization',
    title: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED',
    subtitle: 'Publishing Brand: KHB Private Limited',
    heroImage: '',
    intro: 'KHB Private Limited (KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED) is a software engineering company dedicated to designing and publishing useful mobile applications, intuitive utility tools, and engaging casual games.',
    whoWeAre: 'We are an agile software engineering team passionate about creating fast, privacy-respecting, and purposeful software for millions of Android smartphone users globally.',
    whatWeBuild: 'Our portfolio spans smart daily utilities, personal productivity systems, offline calculations, and casual mobile games built with clean user interfaces and smooth performance.',
    ourPurpose: 'We believe mobile software should be intuitive, lightweight, and respectful of user attention. We eliminate unnecessary friction to deliver practical value.',
    ourApproach: 'We craft software through rigorous testing, minimal permission footprints, responsive modern styling, and continuous user-driven iterations.',
    vision: 'To continuously expand our library of dependable digital products on Google Play that empower users in their daily personal and professional routines.',
    mission: 'To build intuitive digital utilities and games that solve daily practical problems while keeping user data private and safe.',
    pillars: [
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
    ],
    ctaTitle: 'Connect With Our Team',
    ctaSubtitle: 'Have an inquiry, partnership proposal, or feedback regarding any of our published software products?',
    ctaButton: {
      text: 'Send Official Message',
      url: '/contact',
      visible: true,
    },
  },
  ourAppsPage: {
    title: 'Our Applications & Games',
    subtitle: 'Explore our complete directory of mobile software, daily utilities, and casual games available on Google Play.',
    searchPlaceholder: 'Search apps by title, feature, or keyword...',
    categoryFilterLabel: 'Category',
    statusFilterLabel: 'Status',
    sortLabel: 'Sort By',
    noAppsFoundMessage: 'No applications match your selected filters. Try searching with different terms.',
    headerBanner: '',
  },
  appDetailPage: {
    backButtonText: 'Back to All Apps',
    featuresTitle: 'Key Features & Capabilities',
    screenshotsTitle: 'App Preview & Screenshots',
    faqTitle: 'Frequently Asked Questions',
    permissionsTitle: 'Device Permissions & Security',
    supportSectionTitle: 'Need Assistance With This App?',
    supportSectionDescription: 'Have questions, encountered a glitch, or want to suggest a new feature? Our support desk responds promptly.',
    playStoreButtonLabel: 'Get it on Google Play',
    disclaimerText: 'Google Play and the Google Play logo are trademarks of Google LLC.',
  },
  supportPage: {
    badge: 'Support & Helpdesk',
    title: 'How Can We Help You?',
    subtitle: 'Find quick answers to common questions or submit a ticket directly to our technical support team.',
    formTitle: 'Submit a Support Ticket',
    formSubtitle: 'Our support team reviews inquiries within 24 to 48 business hours.',
    responseTimeNotice: 'Expected response time: 24 to 48 hours (excluding public holidays)',
    directEmailTitle: 'Direct Email Support',
    directEmailSubtitle: 'Prefer sending an email directly? Reach our desks at:',
    faqSectionTitle: 'Common Questions & Answers',
    faqSectionSubtitle: 'Quick solutions to questions regarding data backup, offline functionality, and app updates.',
    faqs: [
      {
        q: 'How do I backup or restore data in your utility apps?',
        a: 'Our utility applications store your automation profiles, presets, and preferences securely on your local device storage. You can manage or clear saved presets directly inside the app Settings at any time.',
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
        a: 'Use the support form on this page! Please mention your device model, Android OS version, and the steps to reproduce the issue. Our engineering team responds to all verified bug reports.',
      },
    ],
  },
  contactPage: {
    title: 'Contact & Official Inquiries',
    subtitle: 'Get in touch with the administrative team at KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED (KHB Private Limited). We welcome business inquiries, developer collaborations, and user feedback.',
    formTitle: 'Send Us a Message',
    formSubtitle: 'Fill out the form below and your message will be routed directly to our administration desk.',
    responseTimeText: 'Standard response turnaround: 1 to 2 business days.',
    officeLocationTitle: 'Registered Corporate Information',
    officeLocationText: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED is a registered corporate enterprise in India. For official legal communications or notices, please contact us via our official registered email.',
    successTitle: 'Message Sent Successfully',
    successMessage: 'Thank you for contacting KHB Private Limited. We have received your inquiry and will follow up shortly.',
  },
  footerContent: {
    brandName: 'KHB Private Limited',
    description: 'We create useful mobile applications and engaging games designed to provide simple, practical and enjoyable digital experiences.',
    copyrightText: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED. All rights reserved.',
    showQuickLinks: true,
    showCategories: true,
    showLegal: true,
    disclaimerText: 'Android, Google Play and the Google Play logo are trademarks of Google LLC.',
    socialLinks: {
      twitter: 'https://twitter.com/khbenterprise',
      linkedin: 'https://linkedin.com/company/khb-enterprise',
      github: 'https://github.com/khb-enterprise',
      youtube: 'https://youtube.com',
    },
  },
};

export const AUTO_CLICKER_PRIVACY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy — Auto Clicker Software Testing Utility</title>
  <style>
    :root {
      --bg: #0b1120;
      --surface: #131c31;
      --surface-alt: #1a2642;
      --border: #263554;
      --text: #f1f5f9;
      --muted: #94a3b8;
      --accent: #38bdf8;
      --success: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.65;
      padding: 32px 16px 64px;
    }
    .container {
      max-width: 820px;
      margin: 0 auto;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 36px 32px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
    }
    header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      background: rgba(56, 189, 248, 0.14);
      color: var(--accent);
      border: 1px solid rgba(56, 189, 248, 0.35);
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 4px 12px;
      margin-bottom: 10px;
      letter-spacing: 0.03em;
    }
    h1 {
      font-size: 1.9rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }
    .meta {
      color: var(--muted);
      font-size: 0.9rem;
    }
    .highlight-box {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 24px;
      color: #d1fae5;
      font-size: 0.94rem;
    }
    section {
      background: var(--surface-alt);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px 20px;
      margin-bottom: 16px;
    }
    h2 {
      font-size: 1.08rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 8px;
    }
    p, li {
      font-size: 0.95rem;
      color: #cbd5e1;
    }
    ul {
      padding-left: 20px;
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    a {
      color: var(--accent);
      text-decoration: underline;
    }
    footer {
      margin-top: 28px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      text-align: center;
      color: var(--muted);
      font-size: 0.85rem;
    }
    @media (max-width: 600px) {
      .container { padding: 24px 18px; }
      h1 { font-size: 1.5rem; }
    }
  </style>
</head>
<body>
  <main class="container">
    <header>
      <span class="badge">SOFTWARE TESTING &amp; AUTOMATION UTILITY</span>
      <h1>Privacy Policy for Auto Clicker</h1>
      <p class="meta">Package ID: <strong>com.kbh.precisionautoclicker</strong> &bull; Effective Date: January 1, 2026</p>
    </header>

    <div class="highlight-box">
      <strong>Summary:</strong> Auto Clicker operates 100% locally on your device. We do not collect, track, sell, or transmit personal data, screen content, keystrokes, or usage telemetry to external servers.
    </div>

    <section>
      <h2>1. Overview &amp; Scope</h2>
      <p>
        This Privacy Policy explains how <strong>Auto Clicker</strong> (<code>com.kbh.precisionautoclicker</code>), a personal-purpose software testing, UI verification, and accessibility automation utility, handles device permissions and local configuration storage.
      </p>
    </section>

    <section>
      <h2>2. Information We Do Not Collect</h2>
      <p>Auto Clicker is engineered with a strict zero-collection architecture. The application does not collect, access, store externally, or share:</p>
      <ul>
        <li>Personally identifiable information (name, email address, phone number, or account credentials).</li>
        <li>Device identifiers, advertising IDs, IP addresses, or precise geolocation data.</li>
        <li>Keystrokes, passwords, notifications, financial details, or personal messages.</li>
        <li>Screenshots, screen recordings, or analytics/crash telemetry sent to third-party servers.</li>
      </ul>
    </section>

    <section>
      <h2>3. Local On-Device Storage</h2>
      <p>
        All user-created automation profiles, target screen coordinates, timing intervals, hold durations, and interface preferences (such as dark/light theme and marker appearance) are saved exclusively on your local device using Android Room SQLite, SharedPreferences, or browser <code>localStorage</code>. You maintain full control and may delete saved presets inside the app or remove all stored data by clearing app storage or uninstalling the application.
      </p>
    </section>

    <section>
      <h2>4. Android AccessibilityService API Disclosure</h2>
      <p>
        To execute automated touch testing and repetitive click workflows on Android, Auto Clicker requests permission to use the Android <code>AccessibilityService</code> API. This permission is strictly limited to:
      </p>
      <ul>
        <li>Dispatching touch gestures (taps and timed holds via <code>dispatchGesture()</code>) at the exact screen coordinates configured by the user.</li>
        <li>Inspecting active window transition status strictly for real-click test diagnostics.</li>
      </ul>
      <p style="margin-top: 8px;">
        Auto Clicker <strong>never</strong> uses the AccessibilityService to collect personal data, monitor text input, bypass security prompts, or transmit screen contents off your device.
      </p>
    </section>

    <section>
      <h2>5. Display Over Other Apps (Overlay Permission)</h2>
      <p>
        The <code>SYSTEM_ALERT_WINDOW</code> permission is used solely to render floating control widgets (Start, Pause, Stop, Add Target) and draggable target markers over other applications during testing or automation sessions. You can toggle off the overlay at any time inside the app or revoke the permission in Android System Settings.
      </p>
    </section>

    <section>
      <h2>6. Third-Party Services &amp; Advertising</h2>
      <p>
        Auto Clicker does not embed third-party advertising networks, behavioral tracking SDKs, or external data brokers. No user data is shared with third parties.
      </p>
    </section>

    <section>
      <h2>7. Children's Privacy</h2>
      <p>
        This software testing utility is not directed toward children under the age of 13 and does not knowingly collect personal information from anyone, including children.
      </p>
    </section>

    <section>
      <h2>8. Policy Updates &amp; Contact Information</h2>
      <p>
        We may update this Privacy Policy periodically to remain transparent and compliant with platform requirements. If you have questions or privacy inquiries regarding Auto Clicker, please contact:
      </p>
      <p style="margin-top: 8px;">
        <strong>Developer Contact:</strong> <a href="mailto:bhargavbor597@gmail.com">bhargavbor597@gmail.com</a>
      </p>
    </section>

    <footer>
      &copy; 2026 Auto Clicker (com.kbh.precisionautoclicker) &bull; Software Testing &amp; Accessibility Utility
    </footer>
  </main>
</body>
</html>`;

export const sampleApps: AppItem[] = [
  {
    id: 'app-auto-clicker',
    name: 'Auto Clicker',
    slug: 'auto-clicker',
    packageName: 'com.kbh.precisionautoclicker',
    shortDescription: 'Personal-purpose software testing, UI verification, and accessibility automation utility with 100% local privacy.',
    fullDescription: 'Auto Clicker (com.kbh.precisionautoclicker) is a software testing, UI verification, and accessibility automation utility engineered with a strict zero-collection architecture. Execute automated touch testing and repetitive click workflows using the Android AccessibilityService API, control sessions with floating widgets (Start, Pause, Stop, Add Target) and draggable target markers, and save automation profiles, coordinates, timing intervals, and hold durations 100% locally on your device.',
    icon: '/assets/auto-clicker-icon.svg',
    screenshots: [],
    category: 'Utilities',
    appType: 'Software Testing & Accessibility Utility',
    platform: 'Android / Google Play',
    status: 'Published',
    version: '1.0.0',
    features: [
      'Precision automated taps and timed holds via Android AccessibilityService dispatchGesture()',
      'Floating control widgets (Start, Pause, Stop, Add Target) & draggable target markers',
      'Local storage for automation profiles, target screen coordinates, intervals & hold durations',
      'Customizable dark/light interface theme and marker appearance preferences',
      'Strict zero-collection architecture — zero ads, trackers, or external telemetry',
      'Real-click test diagnostics using active window transition inspection',
    ],
    permissions: [
      'Android AccessibilityService API — Strictly limited to dispatching touch gestures (taps and timed holds via dispatchGesture()) at user-configured coordinates and inspecting active window transition status for real-click test diagnostics.',
      'Display Over Other Apps (SYSTEM_ALERT_WINDOW) — Used solely to render floating control widgets (Start, Pause, Stop, Add Target) and draggable target markers over other applications.',
    ],
    playStoreUrl: '',
    privacyPolicy: 'Auto Clicker operates 100% locally on your device. We do not collect, track, sell, or transmit personal data, screen content, keystrokes, or usage telemetry to external servers.',
    privacyPolicyHtml: AUTO_CLICKER_PRIVACY_HTML,
    supportEmail: 'bhargavbor597@gmail.com',
    websiteUrl: 'https://kbh-private-studio-app.vercel.app/apps/auto-clicker',
    faq: [
      {
        question: 'Does Auto Clicker collect or transmit personal data?',
        answer: 'No. Auto Clicker operates 100% locally on your device with a strict zero-collection architecture. No personal data, screen content, keystrokes, or telemetry are ever sent to external servers.',
      },
      {
        question: 'Why does Auto Clicker use the Android AccessibilityService API?',
        answer: 'The AccessibilityService API is used strictly to dispatch touch gestures (taps and timed holds via dispatchGesture()) at your configured screen coordinates and inspect active window transition status for real-click test diagnostics.',
      },
      {
        question: 'Why is Display Over Other Apps (SYSTEM_ALERT_WINDOW) required?',
        answer: 'It is used solely to display floating control widgets (Start, Pause, Stop, Add Target) and draggable target markers over other applications during testing or automation sessions.',
      },
    ],
    featured: true,
    published: true,
    displayOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-11-15T00:00:00.000Z',
  },
];

export async function createInitialAdminUser(email: string, password: string):Promise<AdminUser> {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return {
    id: 'admin-initial-001',
    email: email.toLowerCase().trim(),
    passwordHash,
    name: 'KHB Administrator',
    role: 'superadmin',
    createdAt: new Date().toISOString(),
  };
}
