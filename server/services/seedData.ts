import { AppItem, SiteSettings, PageContent, AdminUser } from '../types.js';
import bcrypt from 'bcryptjs';

export const initialSettings: SiteSettings = {
  organizationName: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED',
  brandName: 'KHB Private Limited',
  tagline: 'Building Useful Apps and Digital Experiences',
  description: 'We create useful mobile applications and engaging games designed to provide simple, practical and enjoyable digital experiences.',
  supportEmail: 'support@khbenterprise.com',
  contactEmail: 'contact@khbenterprise.com',
  websiteUrl: 'https://khbenterprise.com',
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
    canonicalBaseUrl: 'https://khbenterprise.com',
    googleSearchConsoleVerification: '',
    googlePlayDeveloperVerification: 'KHB Private Limited',
    robotsTxtContent: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://khbenterprise.com/sitemap.xml
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
      id: 'med-app-expense',
      name: 'Expense Manager Icon',
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=160&auto=format&fit=crop&q=80',
      category: 'app-icon',
      uploadedAt: '2026-08-01T12:00:00.000Z',
    },
    {
      id: 'med-app-notes',
      name: 'Color Notes Icon',
      url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=160&auto=format&fit=crop&q=80',
      category: 'app-icon',
      uploadedAt: '2026-08-01T12:00:00.000Z',
    },
    {
      id: 'med-app-chess',
      name: 'Chess Master Icon',
      url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=160&auto=format&fit=crop&q=80',
      category: 'app-icon',
      uploadedAt: '2026-08-01T12:00:00.000Z',
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

export const sampleApps: AppItem[] = [
  {
    id: 'app-expense-manager',
    name: 'Expense Manager',
    slug: 'expense-manager',
    shortDescription: 'Smart daily budget, income tracker, and visual expense manager with offline privacy.',
    fullDescription: 'Expense Manager is an intuitive personal finance and daily expense tracker designed to help you regain complete clarity over your finances. Categorize income and expenses effortlessly, set monthly spending limits, and review your spending habits with clean visual charts. Works 100% offline with zero bank account linking required.',
    icon: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=160&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Productivity',
    appType: 'Productivity App',
    platform: 'Android / Google Play',
    status: 'Published',
    version: '1.4.2',
    features: [
      'Quick 1-tap expense and income entry',
      'Custom categories with color tags and icons',
      'Monthly spending budgets with threshold notifications',
      'Detailed category breakdown and monthly comparison charts',
      'Complete offline data storage with optional CSV export',
      'Biometric PIN / Fingerprint lock for financial privacy',
    ],
    permissions: [
      'Storage / Media (for backing up and exporting CSV financial reports)',
      'Biometrics (optional for fingerprint app lock)',
      'Notifications (optional daily evening expense logging reminder)',
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.khb.expensemanager',
    privacyPolicy: 'Expense Manager operates fully on-device. Your financial transactions, categories, and balances are never uploaded to any remote server.',
    supportEmail: 'support@khbenterprise.com',
    websiteUrl: 'https://khbenterprise.com/apps/expense-manager',
    faq: [
      {
        question: 'Does Expense Manager link to my bank account?',
        answer: 'No. Expense Manager operates offline without asking for bank logins or credentials, ensuring 100% privacy.',
      },
      {
        question: 'Can I export my records for tax filing or Excel?',
        answer: 'Yes, you can export your entire transaction history to a CSV or PDF report at any time from the Settings screen.',
      },
    ],
    featured: true,
    published: true,
    displayOrder: 1,
    createdAt: '2026-06-10T10:00:00.000Z',
    updatedAt: '2026-08-20T14:30:00.000Z',
  },
  {
    id: 'app-color-notes',
    name: 'Color Notes & Quick Lists',
    slug: 'color-notes',
    shortDescription: 'Clean, colorful notepad for checklists, memos, reminders, and daily journaling.',
    fullDescription: 'Capture your thoughts, daily agendas, and shopping lists instantly with Color Notes. Featuring color-coded organization, rich markdown text editing, instant search, pinned favorites, and home screen widgets, it keeps your daily routine organized and effortless.',
    icon: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=160&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Productivity',
    appType: 'Productivity App',
    platform: 'Android / Google Play',
    status: 'Published',
    version: '2.1.0',
    features: [
      'Color-coded notebook tabs and labels',
      'Checklist mode with interactive strike-through items',
      'Voice-to-text dictation support',
      'Pin important notes to top of the grid',
      'Automatic dark mode and custom font scaling',
      'Trash bin recovery with 30-day restore guarantee',
    ],
    permissions: [
      'Notifications (for scheduled note reminders)',
      'Microphone (optional voice-to-text dictation)',
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.khb.colornotes',
    privacyPolicy: 'All notes, checklists, and memos are stored securely in local device storage and remain strictly private.',
    supportEmail: 'support@khbenterprise.com',
    websiteUrl: 'https://khbenterprise.com/apps/color-notes',
    faq: [
      {
        question: 'Are my notes backed up to the cloud?',
        answer: 'You can create an encrypted local backup file or save it to your personal Google Drive account at any time.',
      },
    ],
    featured: true,
    published: true,
    displayOrder: 2,
    createdAt: '2026-05-15T09:00:00.000Z',
    updatedAt: '2026-08-18T11:15:00.000Z',
  },
  {
    id: 'app-qr-utility',
    name: 'QR Utility - Scanner & Creator',
    slug: 'qr-utility',
    shortDescription: 'Lightning-fast QR & barcode scanner with custom code generator and history log.',
    fullDescription: 'QR Utility provides ultra-fast code scanning for all 1D and 2D formats (QR, UPC, EAN, Code 39, Data Matrix). Generate custom QR codes for Wi-Fi credentials, contacts, website links, or text with personalized colors and logos. Includes an offline history log and batch scanning mode.',
    icon: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=160&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1595079672139-545c604b9015?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Utilities',
    appType: 'Utility App',
    platform: 'Android / Google Play',
    status: 'Published',
    version: '3.0.1',
    features: [
      'Instant camera detection with flashlight toggle for dark settings',
      'Scan directly from gallery screenshots or images',
      'Wi-Fi QR code 1-tap connection',
      'Create QR codes for URLs, SMS, Contacts, WhatsApp, and Crypto',
      'Continuous batch scan mode for inventory and retail',
      'URL safety checks before opening external links in browser',
    ],
    permissions: [
      'Camera (required to scan QR and barcodes)',
      'Storage (optional to read QR codes from device photo gallery)',
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.khb.qrscanner',
    privacyPolicy: 'Camera feed is processed in real-time on your hardware. No images or camera streams are transmitted or saved.',
    supportEmail: 'support@khbenterprise.com',
    websiteUrl: 'https://khbenterprise.com/apps/qr-utility',
    faq: [
      {
        question: 'Does it support scanning barcodes on products?',
        answer: 'Yes! It supports UPC-A, EAN-13, EAN-8, Code 128, and many more barcode formats for price checks and product lookup.',
      },
    ],
    featured: true,
    published: true,
    displayOrder: 3,
    createdAt: '2026-04-01T08:30:00.000Z',
    updatedAt: '2026-08-25T16:00:00.000Z',
  },
  {
    id: 'app-chess-master',
    name: 'Chess Master 3D - Offline Strategy',
    slug: 'chess-master',
    shortDescription: 'Classic chess game with intelligent AI engine, puzzle tactics, and two-player mode.',
    fullDescription: 'Whether you are learning chess fundamentals or mastering advanced opening lines, Chess Master 3D brings a tactile wooden board experience to your smartphone. Challenge 10 adaptive AI difficulty levels, solve over 500 tactical chess puzzles, or pass-and-play with a friend offline.',
    icon: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=160&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Games',
    appType: 'Game',
    platform: 'Android / Google Play',
    status: 'Published',
    version: '1.2.0',
    features: [
      'Realistic 3D and high-contrast 2D board perspectives',
      '10 difficulty levels powered by an optimized Stockfish-derived engine',
      'Hint and Undo move assistance for beginner learning',
      'Daily endgame and checkmate puzzle challenges',
      'PGN export to analyze matches in your favorite chess software',
      'No internet connection required — play anytime on airplanes or commutes',
    ],
    permissions: [
      'Vibration (for tactile move feedback)',
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.khb.chessmaster',
    privacyPolicy: 'Offline game with zero personal telemetry. Game progress and scores are saved only on your device.',
    supportEmail: 'support@khbenterprise.com',
    websiteUrl: 'https://khbenterprise.com/apps/chess-master',
    faq: [
      {
        question: 'Can I play offline without Wi-Fi?',
        answer: 'Yes! The entire AI engine and puzzle database run 100% offline without any internet connection.',
      },
    ],
    featured: true,
    published: true,
    displayOrder: 4,
    createdAt: '2026-03-20T12:00:00.000Z',
    updatedAt: '2026-07-30T10:20:00.000Z',
  },
  {
    id: 'app-smart-alarm',
    name: 'Smart Alarm Clock & Sleep Sounds',
    slug: 'smart-alarm-clock',
    shortDescription: 'Gentle wake-up alarm with soothing nature sounds, math puzzles, and bedtime timer.',
    fullDescription: 'Smart Alarm Clock helps you wake up feeling refreshed rather than startled. Choose from progressive volume wake-up tones, ambient white noise and rain sounds for sleep, and interactive morning brain puzzles to ensure you never accidentally sleep through your schedule.',
    icon: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=160&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Utilities',
    appType: 'Utility App',
    platform: 'Android / Google Play',
    status: 'Published',
    version: '1.0.8',
    features: [
      'Gradual sunrise volume increase over 1 to 10 minutes',
      'Mission dismiss tasks: solve math, shake phone, or scan QR',
      'Soothing bedtime ambient sound machine (rain, waves, campfire, forest)',
      'Multiple recurring alarms with custom labels and vibration patterns',
      'Bedtime reminder with wind-down screen dimmer',
    ],
    permissions: [
      'Alarm & Reminders (USE_EXACT_ALARM for precision wake-up timing)',
      'Vibrate (tactile alarm feedback)',
      'Notifications (active alarm status in notification shade)',
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.khb.smartalarm',
    privacyPolicy: 'Alarm times, sound preferences, and sleep logs remain on your local phone storage.',
    supportEmail: 'support@khbenterprise.com',
    websiteUrl: 'https://khbenterprise.com/apps/smart-alarm-clock',
    faq: [
      {
        question: 'Will the alarm ring if my phone is on silent mode?',
        answer: 'Yes, alarms use the dedicated Android Alarm stream to ensure sound rings even when silent or Do Not Disturb is active.',
      },
    ],
    featured: false,
    published: true,
    displayOrder: 5,
    createdAt: '2026-06-01T07:00:00.000Z',
    updatedAt: '2026-08-10T15:45:00.000Z',
  },
  {
    id: 'app-brick-storm',
    name: 'Brick Storm - Retro Ball Breaker',
    slug: 'brick-storm',
    shortDescription: 'Addictive brick breaker arcade with physics-based bounces and power-ups.',
    fullDescription: 'Aim, shoot, and watch chains of balls clear geometric brick obstacles in Brick Storm. Featuring hundreds of satisfying stages, lasers, split-balls, bomb explosions, and vibrant retro synthwave visuals.',
    icon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=160&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Games',
    appType: 'Game',
    platform: 'Android / Google Play',
    status: 'Published',
    version: '1.1.2',
    features: [
      'Realistic ball physics and collision dynamics',
      'Over 300 unique handcrafted challenge levels',
      'Unlockable ball skins and glowing visual effects',
      'Power-up boosters including missile strikes and horizontal lasers',
      'Playable with one finger in vertical portrait mode',
    ],
    permissions: [
      'Vibration (haptic feedback on brick collisions)',
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.khb.brickstorm',
    privacyPolicy: 'Offline casual game. No personal data collected.',
    supportEmail: 'support@khbenterprise.com',
    websiteUrl: 'https://khbenterprise.com/apps/brick-storm',
    faq: [
      {
        question: 'Is internet connection required to play?',
        answer: 'No, all 300+ levels are unlocked and playable offline.',
      },
    ],
    featured: false,
    published: true,
    displayOrder: 6,
    createdAt: '2026-07-12T14:20:00.000Z',
    updatedAt: '2026-08-28T09:10:00.000Z',
  },
  {
    id: 'app-habit-forge',
    name: 'Habit Forge - Daily Routine Tracker',
    slug: 'habit-forge',
    shortDescription: 'Build enduring positive habits, track daily streaks, and visualize personal growth.',
    fullDescription: 'Habit Forge transforms goal setting into a rewarding daily habit loop. Create morning and evening routines, track milestone streaks, and build momentum with flexible schedules and motivating streak heatmaps.',
    icon: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=160&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Productivity',
    appType: 'Productivity App',
    platform: 'Android / Google Play',
    status: 'Coming Soon',
    version: '1.0.0-beta',
    features: [
      'Flexible habit scheduling (daily, specific weekdays, or times per week)',
      'GitHub-style annual streak heatmap visualization',
      'Custom reminder notifications tailored to each routine',
      'Detailed success rate statistics and completion percentages',
    ],
    permissions: [
      'Notifications (habit reminders)',
    ],
    playStoreUrl: '',
    privacyPolicy: 'Habit records and streak milestones are stored locally on your device.',
    supportEmail: 'support@khbenterprise.com',
    websiteUrl: 'https://khbenterprise.com/apps/habit-forge',
    faq: [],
    featured: false,
    published: false,
    displayOrder: 7,
    createdAt: '2026-08-01T11:00:00.000Z',
    updatedAt: '2026-08-29T10:00:00.000Z',
  },
  {
    id: 'app-unit-converter',
    name: 'Unit & Currency Converter Pro',
    slug: 'unit-currency-converter',
    shortDescription: 'Offline unit converter covering 30+ measurement categories and global currencies.',
    fullDescription: 'An indispensable tool for students, engineers, travelers, and home chefs. Converts length, weight, area, volume, temperature, pressure, speed, data storage, and global currency exchange rates with instant real-time typing results.',
    icon: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=160&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Tools',
    appType: 'Tool',
    platform: 'Android / Google Play',
    status: 'Coming Soon',
    version: '1.0.0',
    features: [
      'Instant conversion as you type across 30+ physical units',
      'Offline calculation engine with cached currency rates',
      'Built-in mini scientific calculator',
      'Clean numeric keypad designed for quick one-handed use',
    ],
    permissions: [
      'Network (optional to update daily international currency exchange rates)',
    ],
    playStoreUrl: '',
    privacyPolicy: 'No personal data collected or stored.',
    supportEmail: 'support@khbenterprise.com',
    websiteUrl: 'https://khbenterprise.com/apps/unit-currency-converter',
    faq: [],
    featured: false,
    published: false,
    displayOrder: 8,
    createdAt: '2026-08-15T15:00:00.000Z',
    updatedAt: '2026-08-30T12:00:00.000Z',
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
