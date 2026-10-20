import React, { useEffect, useState } from 'react';
import { AppItem } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Link, useRouter } from '../../context/RouterContext.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Eye,
  Sparkles,
  ExternalLink,
  Check,
  AlertCircle,
  Smartphone,
} from 'lucide-react';

export const AdminAppsListPage: React.FC = () => {
  const { navigate } = useRouter();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<AppItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadApps = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetApps();
      if (res.success) setApps(res.apps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleToggleStatus = async (app: AppItem) => {
    const nextStatus = app.status === 'Published' ? 'Coming Soon' : 'Published';
    try {
      await api.adminToggleAppStatus(app.id, nextStatus);
      setApps((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: nextStatus as any } : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFeatured = async (app: AppItem) => {
    try {
      await api.adminToggleAppFeatured(app.id, !app.featured);
      setApps((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, featured: !app.featured } : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const confirmDelete = async () => {
    if (!appToDelete) return;
    setIsDeleting(true);
    try {
      await api.adminDeleteApp(appToDelete.id);
      setApps((prev) => prev.filter((a) => a.id !== appToDelete.id));
      setDeleteModalOpen(false);
      setAppToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = apps.filter((app) => {
    const matchCat = selectedCategory === 'All' || app.category === selectedCategory;
    const matchStat = selectedStatus === 'All' || app.status === selectedStatus;
    const matchSearch =
      !search ||
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.slug.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Application Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add, update, or remove mobile applications and games published on Google Play.
          </p>
        </div>
        <Link
          to="/admin/apps/new"
          id="btn-add-new-app"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Application</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by app name or slug..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Productivity">Productivity</option>
            <option value="Utilities">Utilities</option>
            <option value="Games">Games</option>
            <option value="Tools">Tools</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Coming Soon">Coming Soon</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Apps Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                <th className="py-3.5 px-4">Application</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Version</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.icon}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white block truncate">
                          {app.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          /apps/{app.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {app.category}
                  </td>

                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono">
                    {app.version ? `v${app.version}` : '-'}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(app)}
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
                      onClick={() => handleToggleFeatured(app)}
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

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/apps/${app.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View on public site"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/apps/edit/${app.id}`}
                        id={`edit-app-${app.slug}`}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                        title="Edit app"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        id={`delete-app-${app.slug}`}
                        onClick={() => {
                          setAppToDelete(app);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No applications match your filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete application{' '}
            <strong className="text-slate-900 dark:text-white">{appToDelete?.name}</strong>?
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-900/60">
            This action is permanent and will remove the application from your public website and Google Play app directory.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Application'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
