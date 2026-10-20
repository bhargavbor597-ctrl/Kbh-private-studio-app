import React, { useEffect, useState } from 'react';
import { AdminStats, AppItem, ContactMessage, SupportRequest } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Link, useRouter } from '../../context/RouterContext.tsx';
import {
  Smartphone,
  CheckCircle2,
  Clock,
  MessageSquare,
  LifeBuoy,
  Plus,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Eye,
  Sliders,
  Palette,
  Gamepad2,
  Mail,
  ShieldCheck,
  Image as ImageIcon,
  Database,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentApps, setRecentApps] = useState<AppItem[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [recentSupport, setRecentSupport] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [statsRes, appsRes, msgsRes, supRes] = await Promise.all([
        api.adminGetStats(),
        api.adminGetApps(),
        api.adminGetMessages(),
        api.adminGetSupport(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (appsRes.success) setRecentApps(appsRes.apps.slice(0, 5));
      if (msgsRes.success) setRecentMessages(msgsRes.messages.slice(0, 4));
      if (supRes.success) setRecentSupport(supRes.requests.slice(0, 4));
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await api.adminToggleAppFeatured(id, !current);
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Published' ? 'Coming Soon' : 'Published';
    try {
      await api.adminToggleAppStatus(id, nextStatus);
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your published Google Play applications, consumer support requests, and organization profile.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/content"
            id="admin-website-content-btn"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Website Content</span>
          </Link>
          <Link
            to="/admin/apps/new"
            id="admin-add-app-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New App</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Apps</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats?.totalApps ?? '-'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Published</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats?.publishedApps ?? '-'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Coming Soon</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {stats?.comingSoonApps ?? '-'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Messages</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalMessages ?? '-'}
            </span>
            {stats?.unreadMessages ? (
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                ({stats.unreadMessages} unread)
              </span>
            ) : null}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Support</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <LifeBuoy className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalSupportRequests ?? '-'}
            </span>
            {stats?.openSupportRequests ? (
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                ({stats.openSupportRequests} open)
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Advanced Control Hub Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Administration & Publishing Suite
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quick shortcuts to all website control centers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/admin/theme"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-500 hover:shadow-xs transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-900 dark:text-white block">Theme & Colors</span>
            <span className="text-[10px] text-slate-400 mt-0.5">8 Presets + Custom</span>
          </Link>

          <Link
            to="/admin/games"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-purple-500 hover:shadow-xs transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-900 dark:text-white block">Games Catalog</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Mobile Game Manager</span>
          </Link>

          <Link
            to="/admin/app-ads"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500 hover:shadow-xs transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-900 dark:text-white block">app-ads.txt</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Root File & AdMob</span>
          </Link>

          <Link
            to="/admin/contact-info"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-500 hover:shadow-xs transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-900 dark:text-white block">Contact & Email</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Support & Dispatch</span>
          </Link>

          <Link
            to="/admin/media"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-amber-500 hover:shadow-xs transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-900 dark:text-white block">Media Library</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Cloudinary Assets</span>
          </Link>

          <Link
            to="/admin/backup"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-rose-500 hover:shadow-xs transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-slate-900 dark:text-white block">Backup & Restore</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Full JSON Export</span>
          </Link>
        </div>
      </div>

      {/* Quick Apps Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Applications Directory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Published apps automatically display on the public website.
            </p>
          </div>
          <Link
            to="/admin/apps"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({recentApps.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.icon}
                        alt=""
                        className="w-9 h-9 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {app.name}
                        </span>
                        <span className="text-[11px] text-slate-400">{app.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {app.category}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(app.id, app.status)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        app.status === 'Published'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60'
                      }`}
                      title="Click to toggle status"
                    >
                      {app.status}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleFeatured(app.id, !!app.featured)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        app.featured
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-300'
                          : 'text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-600'
                      }`}
                      title="Toggle featured showcase on home page"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      to={`/apps/${app.slug}`}
                      target="_blank"
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white inline-block"
                      title="View on public site"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/apps/edit/${app.id}`}
                      className="p-1.5 text-indigo-600 hover:text-indigo-800 inline-block font-semibold"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Columns: Recent Inquiries & Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Recent Contact Inquiries</span>
            </h3>
            <Link to="/admin/messages" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{msg.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium truncate mb-1">
                    {msg.subject}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No messages yet.</p>
          )}
        </div>

        {/* Recent Support Requests */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-amber-600" />
              <span>Recent Support Tickets</span>
            </h3>
            <Link to="/admin/support" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          {recentSupport.length > 0 ? (
            <div className="space-y-3">
              {recentSupport.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{req.app}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        req.status === 'open'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium truncate mb-1">
                    {req.subject}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{req.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No support tickets yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
