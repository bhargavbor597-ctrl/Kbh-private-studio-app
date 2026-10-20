import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { AppItem, ContactMessage, SupportRequest, SiteSettings, PageContent, AdminUser } from '../types.js';
import { initialSettings, initialPageContent, sampleApps, createInitialAdminUser } from './seedData.js';

interface DatabaseSchema {
  adminUsers: AdminUser[];
  apps: AppItem[];
  settings: SiteSettings;
  pageContent: PageContent;
  messages: ContactMessage[];
  supportRequests: SupportRequest[];
}

class StorageEngine {
  private dataDir: string;
  private dbFilePath: string;
  private db: DatabaseSchema | null = null;
  private isInitialized = false;

  constructor() {
    this.dataDir = path.resolve(process.cwd(), 'data');
    this.dbFilePath = path.join(this.dataDir, 'db.json');
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'bhargavbor597@gmail.com').toLowerCase().trim();
      const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'bhargav1616m';
      const initialAdmin = await createInitialAdminUser(defaultAdminEmail, defaultAdminPassword);

      if (fs.existsSync(this.dbFilePath)) {
        const fileContent = fs.readFileSync(this.dbFilePath, 'utf-8');
        this.db = JSON.parse(fileContent);

        // Ensure all required top-level collections exist
        if (!this.db!.adminUsers || this.db!.adminUsers.length === 0) {
          this.db!.adminUsers = [initialAdmin];
        } else {
          // Sync or add configured admin user
          const adminIdx = this.db!.adminUsers.findIndex(
            (u) => u.email.toLowerCase() === defaultAdminEmail
          );
          if (adminIdx === -1) {
            this.db!.adminUsers.push(initialAdmin);
          } else {
            const isMatch = await bcrypt.compare(defaultAdminPassword, this.db!.adminUsers[adminIdx].passwordHash);
            if (!isMatch) {
              this.db!.adminUsers[adminIdx].passwordHash = initialAdmin.passwordHash;
            }
          }
        }
        if (!this.db!.apps) this.db!.apps = [...sampleApps];
        if (!this.db!.settings) {
          this.db!.settings = { ...initialSettings };
        } else {
          this.db!.settings = {
            ...initialSettings,
            ...this.db!.settings,
            theme: {
              ...initialSettings.theme!,
              ...(this.db!.settings.theme || {}),
              colors: {
                ...initialSettings.theme!.colors,
                ...(this.db!.settings.theme?.colors || {}),
              },
            },
            contactInfo: {
              ...initialSettings.contactInfo!,
              ...(this.db!.settings.contactInfo || {}),
              formLabels: {
                ...initialSettings.contactInfo!.formLabels,
                ...(this.db!.settings.contactInfo?.formLabels || {}),
              },
              emailServiceConfig: {
                ...initialSettings.contactInfo!.emailServiceConfig,
                ...(this.db!.settings.contactInfo?.emailServiceConfig || {}),
              },
            },
            appAds: {
              ...initialSettings.appAds!,
              ...(this.db!.settings.appAds || {}),
            },
            seo: {
              ...initialSettings.seo!,
              ...(this.db!.settings.seo || {}),
            },
            navigation: {
              ...initialSettings.navigation!,
              ...(this.db!.settings.navigation || {}),
            },
            mediaLibrary: this.db!.settings.mediaLibrary || initialSettings.mediaLibrary || [],
          };
        }

        // Ensure public/app-ads.txt is written
        this.syncAppAdsFile(this.db!.settings.appAdsTxtContent || initialSettings.appAdsTxtContent);
        if (!this.db!.pageContent) {
          this.db!.pageContent = { ...initialPageContent };
        } else {
          // Merge top-level and sub-objects to guarantee newly introduced sections exist
          this.db!.pageContent = {
            ...initialPageContent,
            ...this.db!.pageContent,
            aboutContent: {
              ...initialPageContent.aboutContent,
              ...(this.db!.pageContent.aboutContent || {}),
            },
            homeContent: {
              ...initialPageContent.homeContent,
              ...(this.db!.pageContent.homeContent || {}),
              hero: {
                ...initialPageContent.homeContent.hero,
                ...(this.db!.pageContent.homeContent?.hero || {}),
              },
              stats: {
                ...initialPageContent.homeContent.stats,
                ...(this.db!.pageContent.homeContent?.stats || {}),
              },
              featuredSection: {
                ...initialPageContent.homeContent.featuredSection,
                ...(this.db!.pageContent.homeContent?.featuredSection || {}),
              },
              categoriesSection: {
                ...initialPageContent.homeContent.categoriesSection,
                ...(this.db!.pageContent.homeContent?.categoriesSection || {}),
              },
              latestSection: {
                ...initialPageContent.homeContent.latestSection,
                ...(this.db!.pageContent.homeContent?.latestSection || {}),
              },
              whyChooseSection: {
                ...initialPageContent.homeContent.whyChooseSection,
                ...(this.db!.pageContent.homeContent?.whyChooseSection || {}),
              },
              aboutSummarySection: {
                ...initialPageContent.homeContent.aboutSummarySection,
                ...(this.db!.pageContent.homeContent?.aboutSummarySection || {}),
              },
              ctaSection: {
                ...initialPageContent.homeContent.ctaSection,
                ...(this.db!.pageContent.homeContent?.ctaSection || {}),
              },
            },
            aboutPage: {
              ...initialPageContent.aboutPage,
              ...(this.db!.pageContent.aboutPage || {}),
            },
            ourAppsPage: {
              ...initialPageContent.ourAppsPage,
              ...(this.db!.pageContent.ourAppsPage || {}),
            },
            appDetailPage: {
              ...initialPageContent.appDetailPage,
              ...(this.db!.pageContent.appDetailPage || {}),
            },
            supportPage: {
              ...initialPageContent.supportPage,
              ...(this.db!.pageContent.supportPage || {}),
            },
            contactPage: {
              ...initialPageContent.contactPage,
              ...(this.db!.pageContent.contactPage || {}),
            },
            footerContent: {
              ...initialPageContent.footerContent,
              ...(this.db!.pageContent.footerContent || {}),
            },
          };
        }
        if (!this.db!.messages) this.db!.messages = [];
        if (!this.db!.supportRequests) this.db!.supportRequests = [];
      } else {
        // Initial bootstrap
        this.db = {
          adminUsers: [initialAdmin],
          apps: [...sampleApps],
          settings: { ...initialSettings },
          pageContent: { ...initialPageContent },
          messages: [
            {
              id: 'msg-sample-1',
              name: 'Rahul Sharma',
              email: 'rahul.s@example.com',
              app: 'Expense Manager',
              subject: 'Feedback regarding CSV export',
              message: 'Loving the Expense Manager app! Could you add an option to choose custom date ranges for the monthly report export? Thanks for the clean privacy focus.',
              status: 'unread',
              createdAt: '2026-08-28T14:20:00.000Z',
            },
            {
              id: 'msg-sample-2',
              name: 'Elena Rostova',
              email: 'elena@example.com',
              app: 'QR Utility',
              subject: 'Enterprise batch scanning inquiry',
              message: 'Hello, our team uses your QR scanner for cataloging warehouse supplies. We would like to know if batch scan export to Google Sheets is planned.',
              status: 'read',
              createdAt: '2026-08-25T09:15:00.000Z',
            },
          ],
          supportRequests: [
            {
              id: 'sup-sample-1',
              name: 'Michael Chen',
              email: 'mchen@example.com',
              app: 'Chess Master 3D',
              type: 'feature',
              subject: 'Request: Dark board wooden theme',
              message: 'Could you add a dark mahogany or walnut wood texture board theme? The current light pine board is great, but dark wood would be awesome for night play.',
              status: 'in-progress',
              createdAt: '2026-08-27T11:45:00.000Z',
            },
          ],
        };
        await this.persist();
      }

      this.isInitialized = true;
    } catch (err) {
      console.error('Failed to initialize database storage:', err);
      // Fallback in-memory state
      const fallbackEmail = (process.env.ADMIN_EMAIL || 'bhargavbor597@gmail.com').toLowerCase().trim();
      const fallbackPassword = process.env.ADMIN_PASSWORD || 'bhargav1616m';
      const initialAdmin = await createInitialAdminUser(fallbackEmail, fallbackPassword);
      this.db = {
        adminUsers: [initialAdmin],
        apps: [...sampleApps],
        settings: { ...initialSettings },
        pageContent: { ...initialPageContent },
        messages: [],
        supportRequests: [],
      };
      this.isInitialized = true;
    }
  }

  private async persist(): Promise<void> {
    if (!this.db) return;
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.dbFilePath, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database to disk:', err);
    }
  }

  // --- Apps ---
  public async getApps(filter?: { status?: string; category?: string; search?: string; featured?: boolean }): Promise<AppItem[]> {
    await this.init();
    let list = [...(this.db?.apps || [])];

    if (filter?.status && filter.status !== 'All') {
      list = list.filter((a) => a.status === filter.status);
    }
    if (filter?.category && filter.category !== 'All') {
      list = list.filter((a) => a.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.featured !== undefined) {
      list = list.filter((a) => a.featured === filter.featured);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  }

  public async getPublicApps(): Promise<AppItem[]> {
    await this.init();
    // Only published and coming soon apps appear publicly; draft apps are hidden
    const list = (this.db?.apps || []).filter((a) => a.status === 'Published' || a.status === 'Coming Soon');
    return list.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
  }

  public async getAppBySlug(slug: string): Promise<AppItem | null> {
    await this.init();
    const app = this.db?.apps.find((a) => a.slug === slug);
    return app || null;
  }

  public async getAppById(id: string): Promise<AppItem | null> {
    await this.init();
    const app = this.db?.apps.find((a) => a.id === id);
    return app || null;
  }

  public async createApp(data: Partial<AppItem>): Promise<AppItem> {
    await this.init();
    const newId = 'app-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const slug = (data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || newId);

    // Verify slug uniqueness
    let finalSlug = slug;
    let counter = 1;
    while (this.db?.apps.some((a) => a.slug === finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const newApp: AppItem = {
      id: newId,
      name: data.name || 'Untitled App',
      slug: finalSlug,
      shortDescription: data.shortDescription || '',
      fullDescription: data.fullDescription || '',
      icon: data.icon || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
      screenshots: Array.isArray(data.screenshots) ? data.screenshots : [],
      category: data.category || 'Utilities',
      appType: data.appType || 'Utility App',
      platform: data.platform || 'Android / Google Play',
      status: data.status || 'Draft',
      version: data.version || '1.0.0',
      features: Array.isArray(data.features) ? data.features : [],
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
      playStoreUrl: data.playStoreUrl || '',
      privacyPolicy: data.privacyPolicy || '',
      supportEmail: data.supportEmail || 'support@khbenterprise.com',
      websiteUrl: data.websiteUrl || '',
      faq: Array.isArray(data.faq) ? data.faq : [],
      featured: Boolean(data.featured),
      published: data.status === 'Published',
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : (this.db?.apps.length || 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db?.apps.push(newApp);
    await this.persist();
    return newApp;
  }

  public async updateApp(id: string, updates: Partial<AppItem>): Promise<AppItem | null> {
    await this.init();
    const index = this.db?.apps.findIndex((a) => a.id === id);
    if (index === undefined || index === -1 || !this.db) return null;

    const existing = this.db.apps[index];
    
    // If slug is changed, ensure uniqueness
    let finalSlug = updates.slug || existing.slug;
    if (updates.slug && updates.slug !== existing.slug) {
      let counter = 1;
      while (this.db.apps.some((a) => a.slug === finalSlug && a.id !== id)) {
        finalSlug = `${updates.slug}-${counter}`;
        counter++;
      }
    }

    const updatedApp: AppItem = {
      ...existing,
      ...updates,
      slug: finalSlug,
      published: updates.status ? updates.status === 'Published' : existing.published,
      updatedAt: new Date().toISOString(),
    };

    this.db.apps[index] = updatedApp;
    await this.persist();
    return updatedApp;
  }

  public async deleteApp(id: string): Promise<boolean> {
    await this.init();
    if (!this.db) return false;
    const initialLen = this.db.apps.length;
    this.db.apps = this.db.apps.filter((a) => a.id !== id);
    if (this.db.apps.length !== initialLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  // --- Utility to keep public/app-ads.txt in sync ---
  public syncAppAdsFile(content: string): void {
    try {
      const publicDir = path.resolve(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const appAdsPath = path.join(publicDir, 'app-ads.txt');
      fs.writeFileSync(appAdsPath, content, 'utf-8');
    } catch (err) {
      console.warn('[Storage] Could not write public/app-ads.txt file:', err);
    }
  }

  // --- Site Settings ---
  public async getSettings(): Promise<SiteSettings> {
    await this.init();
    return this.db?.settings || { ...initialSettings };
  }

  public async updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    await this.init();
    if (!this.db) return { ...initialSettings };

    const current = this.db.settings;

    // Harmonize email and app-ads sync
    const finalContactEmail =
      updates.contactInfo?.publicContactEmail || updates.contactEmail || current.contactEmail;
    const finalSupportEmail =
      updates.contactInfo?.customerSupportEmail || updates.supportEmail || current.supportEmail;
    const finalAppAdsTxt =
      updates.appAds?.content || updates.appAdsTxtContent || current.appAdsTxtContent;

    this.db.settings = {
      ...current,
      ...updates,
      contactEmail: finalContactEmail,
      supportEmail: finalSupportEmail,
      appAdsTxtContent: finalAppAdsTxt,
      theme: updates.theme
        ? {
            ...current.theme!,
            ...updates.theme,
            colors: {
              ...current.theme!.colors,
              ...(updates.theme.colors || {}),
            },
          }
        : current.theme,
      contactInfo: updates.contactInfo
        ? {
            ...current.contactInfo!,
            ...updates.contactInfo,
            publicContactEmail: finalContactEmail,
            customerSupportEmail: finalSupportEmail,
            formLabels: {
              ...current.contactInfo!.formLabels,
              ...(updates.contactInfo.formLabels || {}),
            },
            emailServiceConfig: {
              ...current.contactInfo!.emailServiceConfig,
              ...(updates.contactInfo.emailServiceConfig || {}),
            },
          }
        : current.contactInfo,
      appAds: updates.appAds
        ? {
            ...current.appAds!,
            ...updates.appAds,
            content: finalAppAdsTxt,
            admobPublisherId: updates.admobPublisherId || updates.appAds.admobPublisherId || current.admobPublisherId,
          }
        : current.appAds,
      seo: updates.seo
        ? {
            ...current.seo!,
            ...updates.seo,
          }
        : current.seo,
      navigation: updates.navigation
        ? {
            ...current.navigation!,
            ...updates.navigation,
          }
        : current.navigation,
      mediaLibrary: updates.mediaLibrary || current.mediaLibrary || [],
    };

    if (finalAppAdsTxt) {
      this.syncAppAdsFile(finalAppAdsTxt);
    }

    await this.persist();
    return this.db.settings;
  }

  // --- Media Library ---
  public async getMediaItems(): Promise<any[]> {
    await this.init();
    return this.db?.settings?.mediaLibrary || [];
  }

  public async addMediaItem(item: any): Promise<any[]> {
    await this.init();
    if (!this.db || !this.db.settings) return [];
    if (!this.db.settings.mediaLibrary) {
      this.db.settings.mediaLibrary = [];
    }
    const newItem = {
      id: 'med-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      uploadedAt: new Date().toISOString(),
      ...item,
    };
    this.db.settings.mediaLibrary.unshift(newItem);
    await this.persist();
    return this.db.settings.mediaLibrary;
  }

  public async deleteMediaItem(id: string): Promise<boolean> {
    await this.init();
    if (!this.db || !this.db.settings || !this.db.settings.mediaLibrary) return false;
    const initialLen = this.db.settings.mediaLibrary.length;
    this.db.settings.mediaLibrary = this.db.settings.mediaLibrary.filter((m) => m.id !== id);
    if (this.db.settings.mediaLibrary.length !== initialLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  // --- Full Database Backup & Restore ---
  public async exportDatabase(): Promise<any> {
    await this.init();
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        apps: this.db?.apps || [],
        settings: this.db?.settings || initialSettings,
        pageContent: this.db?.pageContent || initialPageContent,
        messages: this.db?.messages || [],
        supportRequests: this.db?.supportRequests || [],
      },
    };
  }

  public async importDatabase(backup: any): Promise<{ success: boolean; message: string }> {
    await this.init();
    if (!backup || !backup.data) {
      throw new Error('Invalid backup file structure: missing "data" property.');
    }

    const { apps, settings, pageContent, messages, supportRequests } = backup.data;

    if (!Array.isArray(apps) && !settings && !pageContent) {
      throw new Error('Backup file does not contain valid website data collections.');
    }

    if (apps && Array.isArray(apps)) {
      this.db!.apps = apps;
    }
    if (settings && typeof settings === 'object') {
      this.db!.settings = { ...initialSettings, ...settings };
      if (this.db!.settings.appAdsTxtContent) {
        this.syncAppAdsFile(this.db!.settings.appAdsTxtContent);
      }
    }
    if (pageContent && typeof pageContent === 'object') {
      this.db!.pageContent = { ...initialPageContent, ...pageContent };
    }
    if (messages && Array.isArray(messages)) {
      this.db!.messages = messages;
    }
    if (supportRequests && Array.isArray(supportRequests)) {
      this.db!.supportRequests = supportRequests;
    }

    await this.persist();
    return { success: true, message: 'Database restored successfully from backup.' };
  }

  // --- Page Content ---
  public async getPageContent(): Promise<PageContent> {
    await this.init();
    return this.db?.pageContent || { ...initialPageContent };
  }

  public async updatePageContent(updates: Partial<PageContent>): Promise<PageContent> {
    await this.init();
    if (!this.db) return { ...initialPageContent };

    const current = this.db.pageContent;
    this.db.pageContent = {
      ...current,
      ...updates,
      privacyPolicy: updates.privacyPolicy !== undefined ? updates.privacyPolicy : current.privacyPolicy,
      termsConditions: updates.termsConditions !== undefined ? updates.termsConditions : current.termsConditions,
      privacyLastUpdated: updates.privacyLastUpdated !== undefined ? updates.privacyLastUpdated : current.privacyLastUpdated,
      termsLastUpdated: updates.termsLastUpdated !== undefined ? updates.termsLastUpdated : current.termsLastUpdated,
      aboutContent: updates.aboutContent
        ? { ...current.aboutContent, ...updates.aboutContent }
        : current.aboutContent,
      homeContent: updates.homeContent
        ? {
            ...current.homeContent,
            ...updates.homeContent,
            hero: updates.homeContent.hero ? { ...current.homeContent.hero, ...updates.homeContent.hero } : current.homeContent.hero,
            stats: updates.homeContent.stats ? { ...current.homeContent.stats, ...updates.homeContent.stats } : current.homeContent.stats,
            featuredSection: updates.homeContent.featuredSection ? { ...current.homeContent.featuredSection, ...updates.homeContent.featuredSection } : current.homeContent.featuredSection,
            categoriesSection: updates.homeContent.categoriesSection ? { ...current.homeContent.categoriesSection, ...updates.homeContent.categoriesSection } : current.homeContent.categoriesSection,
            latestSection: updates.homeContent.latestSection ? { ...current.homeContent.latestSection, ...updates.homeContent.latestSection } : current.homeContent.latestSection,
            whyChooseSection: updates.homeContent.whyChooseSection ? { ...current.homeContent.whyChooseSection, ...updates.homeContent.whyChooseSection } : current.homeContent.whyChooseSection,
            aboutSummarySection: updates.homeContent.aboutSummarySection ? { ...current.homeContent.aboutSummarySection, ...updates.homeContent.aboutSummarySection } : current.homeContent.aboutSummarySection,
            ctaSection: updates.homeContent.ctaSection ? { ...current.homeContent.ctaSection, ...updates.homeContent.ctaSection } : current.homeContent.ctaSection,
          }
        : current.homeContent,
      aboutPage: updates.aboutPage
        ? { ...current.aboutPage, ...updates.aboutPage }
        : current.aboutPage,
      ourAppsPage: updates.ourAppsPage
        ? { ...current.ourAppsPage, ...updates.ourAppsPage }
        : current.ourAppsPage,
      appDetailPage: updates.appDetailPage
        ? { ...current.appDetailPage, ...updates.appDetailPage }
        : current.appDetailPage,
      supportPage: updates.supportPage
        ? { ...current.supportPage, ...updates.supportPage }
        : current.supportPage,
      contactPage: updates.contactPage
        ? { ...current.contactPage, ...updates.contactPage }
        : current.contactPage,
      footerContent: updates.footerContent
        ? { ...current.footerContent, ...updates.footerContent }
        : current.footerContent,
    };
    await this.persist();
    return this.db.pageContent;
  }

  // --- Contact Messages ---
  public async getMessages(filter?: { status?: string; search?: string }): Promise<ContactMessage[]> {
    await this.init();
    let list = [...(this.db?.messages || [])];
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((m) => m.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async createContactMessage(data: Partial<ContactMessage>): Promise<ContactMessage> {
    await this.init();
    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: data.name?.trim() || 'Anonymous',
      email: data.email?.trim() || '',
      app: data.app?.trim() || 'General',
      subject: data.subject?.trim() || 'No Subject',
      message: data.message?.trim() || '',
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    this.db?.messages.unshift(newMsg);
    await this.persist();
    return newMsg;
  }

  public async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage | null> {
    await this.init();
    const msg = this.db?.messages.find((m) => m.id === id);
    if (!msg) return null;
    msg.status = status;
    await this.persist();
    return msg;
  }

  public async deleteMessage(id: string): Promise<boolean> {
    await this.init();
    if (!this.db) return false;
    const initialLen = this.db.messages.length;
    this.db.messages = this.db.messages.filter((m) => m.id !== id);
    if (this.db.messages.length !== initialLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  // --- Support Requests ---
  public async getSupportRequests(filter?: { status?: string; app?: string }): Promise<SupportRequest[]> {
    await this.init();
    let list = [...(this.db?.supportRequests || [])];
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((s) => s.status === filter.status);
    }
    if (filter?.app && filter.app !== 'all') {
      list = list.filter((s) => s.app.toLowerCase() === filter.app!.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async createSupportRequest(data: Partial<SupportRequest>): Promise<SupportRequest> {
    await this.init();
    const newReq: SupportRequest = {
      id: 'sup-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: data.name?.trim() || 'Anonymous',
      email: data.email?.trim() || '',
      app: data.app?.trim() || 'General Support',
      type: data.type || 'general',
      subject: data.subject?.trim() || 'Support Request',
      message: data.message?.trim() || '',
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    this.db?.supportRequests.unshift(newReq);
    await this.persist();
    return newReq;
  }

  public async updateSupportStatus(id: string, status: SupportRequest['status']): Promise<SupportRequest | null> {
    await this.init();
    const req = this.db?.supportRequests.find((s) => s.id === id);
    if (!req) return null;
    req.status = status;
    await this.persist();
    return req;
  }

  public async deleteSupportRequest(id: string): Promise<boolean> {
    await this.init();
    if (!this.db) return false;
    const initialLen = this.db.supportRequests.length;
    this.db.supportRequests = this.db.supportRequests.filter((s) => s.id !== id);
    if (this.db.supportRequests.length !== initialLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  // --- Admin Authentication & Stats ---
  public async findAdminByEmail(email: string): Promise<AdminUser | null> {
    await this.init();
    const cleanEmail = email.toLowerCase().trim();
    let user = this.db?.adminUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    const configuredEmail = (process.env.ADMIN_EMAIL || 'bhargavbor597@gmail.com').toLowerCase().trim();
    const configuredPassword = process.env.ADMIN_PASSWORD || 'bhargav1616m';

    if (cleanEmail === configuredEmail) {
      if (!user) {
        user = await createInitialAdminUser(configuredEmail, configuredPassword);
        this.db?.adminUsers.push(user);
        await this.persist();
      } else {
        const isMatch = await bcrypt.compare(configuredPassword, user.passwordHash);
        if (!isMatch) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(configuredPassword, salt);
          await this.persist();
        }
      }
    }

    return user || null;
  }

  public async getAdminStats(): Promise<{
    totalApps: number;
    publishedApps: number;
    comingSoonApps: number;
    draftApps: number;
    featuredApps: number;
    totalMessages: number;
    unreadMessages: number;
    totalSupportRequests: number;
    openSupportRequests: number;
  }> {
    await this.init();
    const apps = this.db?.apps || [];
    const messages = this.db?.messages || [];
    const support = this.db?.supportRequests || [];

    return {
      totalApps: apps.length,
      publishedApps: apps.filter((a) => a.status === 'Published').length,
      comingSoonApps: apps.filter((a) => a.status === 'Coming Soon').length,
      draftApps: apps.filter((a) => a.status === 'Draft').length,
      featuredApps: apps.filter((a) => a.featured).length,
      totalMessages: messages.length,
      unreadMessages: messages.filter((m) => m.status === 'unread').length,
      totalSupportRequests: support.length,
      openSupportRequests: support.filter((s) => s.status === 'open' || s.status === 'in-progress').length,
    };
  }
}

export const storage = new StorageEngine();
