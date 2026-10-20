import { AppItem, ContactMessage, SupportRequest, SiteSettings, PageContent, AdminUser, AdminStats } from '../types.ts';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('khb_admin_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  // Public Apps
  async getPublicApps(params?: { category?: string; status?: string; search?: string; featured?: boolean }): Promise<{ success: boolean; apps: AppItem[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.featured) query.set('featured', 'true');
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; apps: AppItem[]; count: number }>(`/apps${qs}`);
  },

  async getAppBySlug(slug: string): Promise<{ success: boolean; app: AppItem }> {
    return request<{ success: boolean; app: AppItem }>(`/apps/${encodeURIComponent(slug)}`);
  },

  // Public Settings & Content
  async getSettings(): Promise<{ success: boolean; settings: SiteSettings }> {
    return request<{ success: boolean; settings: SiteSettings }>('/organization');
  },

  async getPageContent(): Promise<{ success: boolean; content: PageContent }> {
    return request<{ success: boolean; content: PageContent }>('/content');
  },

  // Public Inquiries
  async submitContact(data: { name: string; email: string; app?: string; subject: string; message: string }): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async submitSupport(data: { name: string; email: string; app: string; type: string; subject: string; message: string }): Promise<{ success: boolean; message: string; ticketId: string }> {
    return request<{ success: boolean; message: string; ticketId: string }>('/support', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Admin Auth
  async adminLogin(email: string, password: string): Promise<{ success: boolean; token: string; user: AdminUser }> {
    return request<{ success: boolean; token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async adminLogout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('khb_admin_token');
      localStorage.removeItem('khb_admin_user');
    }
  },

  async adminGetMe(): Promise<{ success: boolean; user: AdminUser }> {
    return request<{ success: boolean; user: AdminUser }>('/auth/me');
  },

  // Admin Stats & Apps
  async adminGetStats(): Promise<{ success: boolean; stats: AdminStats }> {
    return request<{ success: boolean; stats: AdminStats }>('/admin/stats');
  },

  async adminGetApps(params?: { category?: string; status?: string; search?: string; featured?: boolean }): Promise<{ success: boolean; apps: AppItem[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; apps: AppItem[]; count: number }>(`/admin/apps${qs}`);
  },

  async adminGetAppById(id: string): Promise<{ success: boolean; app: AppItem }> {
    return request<{ success: boolean; app: AppItem }>(`/admin/apps/${encodeURIComponent(id)}`);
  },

  async adminCreateApp(data: Partial<AppItem>): Promise<{ success: boolean; message: string; app: AppItem }> {
    return request<{ success: boolean; message: string; app: AppItem }>('/admin/apps', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async adminUpdateApp(id: string, data: Partial<AppItem>): Promise<{ success: boolean; message: string; app: AppItem }> {
    return request<{ success: boolean; message: string; app: AppItem }>(`/admin/apps/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async adminDeleteApp(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/admin/apps/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async adminToggleAppStatus(id: string, status: string): Promise<{ success: boolean; app: AppItem }> {
    return request<{ success: boolean; app: AppItem }>(`/admin/apps/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async adminToggleAppFeatured(id: string, featured: boolean): Promise<{ success: boolean; app: AppItem }> {
    return request<{ success: boolean; app: AppItem }>(`/admin/apps/${encodeURIComponent(id)}/featured`, {
      method: 'PATCH',
      body: JSON.stringify({ featured }),
    });
  },

  // Admin Messages & Support
  async adminGetMessages(params?: { status?: string; search?: string }): Promise<{ success: boolean; messages: ContactMessage[] }> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; messages: ContactMessage[] }>(`/admin/messages${qs}`);
  },

  async adminUpdateMessageStatus(id: string, status: string): Promise<{ success: boolean; data: ContactMessage }> {
    return request<{ success: boolean; data: ContactMessage }>(`/admin/messages/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async adminDeleteMessage(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/admin/messages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async adminGetSupport(params?: { status?: string; app?: string }): Promise<{ success: boolean; requests: SupportRequest[] }> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.app) query.set('app', params.app);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; requests: SupportRequest[] }>(`/admin/support${qs}`);
  },

  async adminUpdateSupportStatus(id: string, status: string): Promise<{ success: boolean; data: SupportRequest }> {
    return request<{ success: boolean; data: SupportRequest }>(`/admin/support/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async adminDeleteSupport(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/admin/support/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // Admin Settings & Content
  async adminUpdateSettings(data: Partial<SiteSettings>): Promise<{ success: boolean; settings: SiteSettings }> {
    return request<{ success: boolean; settings: SiteSettings }>('/admin/organization', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async adminUpdateContent(data: Partial<PageContent>): Promise<{ success: boolean; content: PageContent }> {
    return request<{ success: boolean; content: PageContent }>('/admin/content', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async adminResetContent(): Promise<{ success: boolean; message: string; content: PageContent }> {
    return request<{ success: boolean; message: string; content: PageContent }>('/admin/content/reset', {
      method: 'POST',
    });
  },

  async adminUploadImage(imageBase64: string, filename?: string): Promise<{ success: boolean; url: string; filename: string }> {
    return request<{ success: boolean; url: string; filename: string }>('/admin/upload', {
      method: 'POST',
      body: JSON.stringify({ imageBase64, filename }),
    });
  },

  // Media Library
  async adminGetMedia(): Promise<{ success: boolean; items: any[] }> {
    return request<{ success: boolean; items: any[] }>('/admin/media');
  },

  async adminAddMedia(item: { name: string; url: string; category: string; size?: number; type?: string }): Promise<{ success: boolean; items: any[] }> {
    return request<{ success: boolean; items: any[] }>('/admin/media', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  async adminDeleteMedia(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/admin/media/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // Backup & Restore
  async adminGetBackup(): Promise<{ success: boolean; backup: any }> {
    return request<{ success: boolean; backup: any }>('/admin/backup');
  },

  async adminRestoreBackup(data: any): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/admin/backup/restore', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Email Test
  async adminSendTestEmail(toEmail: string): Promise<{ success: boolean; provider: string; delivered: boolean; message: string; log: any }> {
    return request<{ success: boolean; provider: string; delivered: boolean; message: string; log: any }>('/admin/test-email', {
      method: 'POST',
      body: JSON.stringify({ toEmail }),
    });
  },

  // app-ads.txt Publish
  async adminPublishAppAds(data: { content: string; admobPublisherId?: string; authorizedSellers?: any[] }): Promise<{ success: boolean; message: string; url: string; lastUpdated: string; content: string }> {
    return request<{ success: boolean; message: string; url: string; lastUpdated: string; content: string }>('/admin/app-ads/publish', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
