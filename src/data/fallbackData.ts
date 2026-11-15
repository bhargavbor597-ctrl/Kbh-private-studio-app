import { AppItem, PageContent, SiteSettings } from '../types.ts';

export const AUTO_CLICKER_FALLBACK_PRIVACY_HTML = `<!DOCTYPE html>
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

export const FALLBACK_APPS: AppItem[] = [
  {
    id: 'app-auto-clicker',
    name: 'Auto Clicker',
    slug: 'auto-clicker',
    packageName: 'com.kbh.precisionautoclicker',
    shortDescription:
      'Personal-purpose software testing, UI verification, and accessibility automation utility with 100% local privacy.',
    fullDescription:
      'Auto Clicker (com.kbh.precisionautoclicker) is a software testing, UI verification, and accessibility automation utility engineered with a strict zero-collection architecture. Execute automated touch testing and repetitive click workflows using the Android AccessibilityService API, control sessions with floating widgets (Start, Pause, Stop, Add Target) and draggable target markers, and save automation profiles, coordinates, timing intervals, and hold durations 100% locally on your device.',
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
    privacyPolicy:
      'Auto Clicker operates 100% locally on your device. We do not collect, track, sell, or transmit personal data, screen content, keystrokes, or usage telemetry to external servers.',
    privacyPolicyHtml: AUTO_CLICKER_FALLBACK_PRIVACY_HTML,
    supportEmail: 'bhargavbor597@gmail.com',
    websiteUrl: 'https://kbh-private-studio-app.vercel.app/apps/auto-clicker',
    faq: [
      {
        question: 'Does Auto Clicker collect or transmit personal data?',
        answer:
          'No. Auto Clicker operates 100% locally on your device with a strict zero-collection architecture. No personal data, screen content, keystrokes, or telemetry are ever sent to external servers.',
      },
      {
        question: 'Why does Auto Clicker use the Android AccessibilityService API?',
        answer:
          'The AccessibilityService API is used strictly to dispatch touch gestures (taps and timed holds via dispatchGesture()) at your configured screen coordinates and inspect active window transition status for real-click test diagnostics.',
      },
      {
        question: 'Why is Display Over Other Apps (SYSTEM_ALERT_WINDOW) required?',
        answer:
          'It is used solely to display floating control widgets (Start, Pause, Stop, Add Target) and draggable target markers over other applications during testing or automation sessions.',
      },
    ],
    featured: true,
    published: true,
    displayOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-11-15T00:00:00.000Z',
  },
];

export const FALLBACK_SETTINGS: SiteSettings = {
  organizationName: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED',
  brandName: 'KHB Private Limited',
  tagline: 'Building Useful Apps and Digital Experiences',
  description:
    'We create useful mobile applications and engaging games designed to provide simple, practical and enjoyable digital experiences.',
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
  appAdsTxtContent:
    '# KHB Private Limited - Google AdMob Authorized Digital Sellers\ngoogle.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n',
};

export const FALLBACK_PAGE_CONTENT: PageContent = {
  privacyPolicy: '',
  termsConditions: '',
  aboutContent: {
    intro:
      'KHB Private Limited (KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED) is a modern technology company focused on designing and engineering reliable mobile applications, utility tools, and interactive digital experiences.',
    whoWeAre:
      'We are an agile software engineering team passionate about creating fast, privacy-respecting, and purposeful software for millions of Android smartphone users globally.',
    whatWeBuild:
      'Our portfolio spans smart daily utilities, personal productivity systems, offline calculations, and casual mobile games built with clean user interfaces and smooth performance.',
    ourPurpose:
      'We believe mobile software should be intuitive, lightweight, and respectful of user attention. We eliminate unnecessary friction to deliver practical value.',
    ourApproach:
      'We craft software through rigorous testing, minimal permission footprints, responsive modern styling, and continuous user-driven iterations.',
    vision:
      'To continuously expand our library of dependable digital products on Google Play that empower users in their daily personal and professional routines.',
  },
  privacyLastUpdated: 'September 1, 2026',
  termsLastUpdated: 'September 1, 2026',
  homeContent: {
    hero: {
      badge: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED',
      heading: 'Building Useful Apps and Digital Experiences',
      subtitle: 'Official Android Publishing & Software Studio',
      description:
        'We create useful mobile applications and engaging games designed to provide simple, practical and enjoyable digital experiences.',
      heroImage: '',
      primaryButton: { text: 'Explore Our Apps', url: '/apps', visible: true },
      secondaryButton: { text: 'Contact Support', url: '/support', visible: true },
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
      viewAllButton: { text: 'View All Apps', url: '/apps', visible: true },
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
      viewAllButton: { text: 'See Complete Directory', url: '/apps', visible: true },
    },
    whyChooseSection: {
      enabled: true,
      title: 'Why Users Choose Our Apps',
      subtitle: 'We design mobile software with a laser focus on speed, user privacy, and dependable utility.',
      items: [
        {
          title: 'Privacy By Design',
          description: 'Zero intrusive personal tracking. Our apps store your presets and settings safely on your physical device.',
          icon: 'Lock',
        },
        {
          title: 'Lightweight & Fast',
          description: 'Optimized APK sizes and rapid launch times engineered to run smoothly on all Android devices.',
          icon: 'Zap',
        },
        {
          title: '100% Offline Capable',
          description: 'Core features work seamlessly without an active internet connection.',
          icon: 'Smartphone',
        },
        {
          title: 'Minimal Permissions',
          description: 'We only request permissions essential to the application’s explicit features.',
          icon: 'ShieldCheck',
        },
      ],
    },
    aboutSummarySection: {
      enabled: true,
      badge: 'About Organization',
      title: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED',
      description:
        'Operating under the consumer brand KHB Private Limited, our engineering organization is dedicated to creating accessible mobile tools, productivity software, and interactive games.',
      bannerImage: '',
      primaryButton: { text: 'Read Full Company Profile', url: '/about', visible: true },
      secondaryButton: { text: 'Help & Support Center', url: '/support', visible: true },
    },
    ctaSection: {
      enabled: true,
      title: 'Have a question or need technical support?',
      subtitle: 'Whether you need help with an app or want to suggest a new feature, our support team is here to assist you.',
      primaryButton: { text: 'Submit Support Request', url: '/support', visible: true },
      secondaryButton: { text: 'Contact Us', url: '/contact', visible: true },
    },
  },
  aboutPage: {
    badge: 'About Our Organization',
    title: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED',
    subtitle: 'Publishing Brand: KHB Private Limited',
    heroImage: '',
    intro: 'KHB Private Limited is a software engineering company dedicated to designing and publishing useful mobile applications and utility tools.',
    whoWeAre: 'We are an agile software engineering team passionate about creating fast, privacy-respecting software.',
    whatWeBuild: 'Our portfolio spans smart daily utilities and productivity systems built with clean user interfaces.',
    ourPurpose: 'We believe mobile software should be intuitive, lightweight, and respectful of user attention.',
    ourApproach: 'We craft software through rigorous testing, minimal permission footprints, and continuous user-driven iterations.',
    vision: 'To continuously expand our library of dependable digital products on Google Play.',
    mission: 'To build intuitive digital utilities that solve daily practical problems while keeping user data private and safe.',
    pillars: [],
    ctaTitle: 'Connect With Our Team',
    ctaSubtitle: 'Have an inquiry or feedback regarding any of our published software products?',
    ctaButton: { text: 'Send Official Message', url: '/contact', visible: true },
  },
  ourAppsPage: {
    title: 'Our Applications & Games',
    subtitle: 'Explore our complete directory of mobile software and daily utilities.',
    searchPlaceholder: 'Search apps by title, feature, or keyword...',
    categoryFilterLabel: 'Category',
    statusFilterLabel: 'Status',
    sortLabel: 'Sort By',
    noAppsFoundMessage: 'No applications match your selected filters.',
    headerBanner: '',
  },
  appDetailPage: {
    backButtonText: 'Back to All Apps',
    featuresTitle: 'Key Features & Capabilities',
    screenshotsTitle: 'App Preview & Screenshots',
    faqTitle: 'Frequently Asked Questions',
    permissionsTitle: 'Device Permissions & Security',
    supportSectionTitle: 'Need Assistance With This App?',
    supportSectionDescription: 'Have questions or want to suggest a new feature? Our support desk responds promptly.',
    playStoreButtonLabel: 'Get it on Google Play',
    disclaimerText: 'Google Play and the Google Play logo are trademarks of Google LLC.',
  },
  supportPage: {
    badge: 'Support & Helpdesk',
    title: 'How Can We Help You?',
    subtitle: 'Find quick answers to common questions or submit a ticket directly to our technical support team.',
    formTitle: 'Submit a Support Ticket',
    formSubtitle: 'Our support team reviews inquiries within 24 to 48 business hours.',
    responseTimeNotice: 'Expected response time: 24 to 48 hours',
    directEmailTitle: 'Direct Email Support',
    directEmailSubtitle: 'Prefer sending an email directly? Reach our desks at:',
    faqSectionTitle: 'Common Questions & Answers',
    faqSectionSubtitle: 'Quick solutions to common questions.',
    faqs: [],
  },
  contactPage: {
    title: 'Contact & Official Inquiries',
    subtitle: 'Get in touch with the team at KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED.',
    formTitle: 'Send Us a Message',
    formSubtitle: 'Fill out the form below to reach our administration desk.',
    responseTimeText: 'Standard response turnaround: 1 to 2 business days.',
    officeLocationTitle: 'Registered Corporate Information',
    officeLocationText: 'KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED is a registered corporate enterprise in India.',
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
  },
};
