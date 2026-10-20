import React, { useEffect, useState } from 'react';
import { AppItem, AppStatus } from '../../types.ts';
import { api } from '../../services/api.ts';
import { Link, useRouter } from '../../context/RouterContext.tsx';
import {
  Gamepad2,
  Plus,
  Search,
  Sparkles,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  Play,
  ArrowUpDown,
} from 'lucide-react';

export const AdminGamesListPage: React.FC = () => {
  const { navigate } = useRouter();
  const [games, setGames] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AppStatus>('All');

  // Deletion modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadGames = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetApps();
      if (res.success) {
        // Filter items that are Games
        const gameList = res.apps.filter(
          (a) => a.category.toLowerCase() === 'games' || a.appType.toLowerCase().includes('game')
        );
        setGames(gameList);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load games catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await api.adminToggleAppFeatured(id, !current);
      setGames((prev) =>
        prev.map((g) => (g.id === id ? { ...g, featured: !current } : g))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update featured status');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: AppStatus) => {
    const nextStatus: AppStatus = currentStatus === 'Published' ? 'Coming Soon' : 'Published';
    try {
      await api.adminToggleAppStatus(id, nextStatus);
      setGames((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status: nextStatus, published: nextStatus === 'Published' } : g))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update game publication status');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await api.adminDeleteApp(deleteId);
      if (res.success) {
        setGames((prev) => prev.filter((g) => g.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete game record');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredGames = games
    .filter((g) => {
      const matchesSearch =
        !search ||
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.shortDescription.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

  const totalGames = games.length;
  const publishedCount = games.filter((g) => g.status === 'Published').length;
  const comingSoonCount = games.filter((g) => g.status === 'Coming Soon').length;
  const featuredCount = games.filter((g) => g.featured).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Mobile Games Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Games Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your published mobile game catalog, Google Play store releases, offline casual gameplay, and game trailers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/apps/new"
            id="admin-add-game-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Game</span>
          </Link>
          <Link
            to="/apps?category=Games"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
          >
            <span>Live Games</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Total Mobile Games
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalGames}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
            Published Live
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {publishedCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mb-1">
            Coming Soon Pipeline
          </span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {comingSoonCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block mb-1">
            Featured on Homepage
          </span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {featuredCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search games by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Published', 'Coming Soon', 'Draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Games Table / List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading mobile games catalog...</div>
        ) : filteredGames.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Gamepad2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              No games found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search
                ? 'No games match your search keyword. Clear the search bar to see all titles.'
                : 'Click "Add New Game" above to publish your first mobile game.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <img
                    src={game.icon}
                    alt={game.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=160&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        {game.name}
                      </h3>
                      {game.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200">
                          <Sparkles className="w-2.5 h-2.5" />
                          Featured
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          game.status === 'Published'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                        }`}
                      >
                        {game.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xl">
                      {game.shortDescription}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                      <span>v{game.version}</span>
                      <span>•</span>
                      <span>Order: #{game.displayOrder}</span>
                      {game.playStoreUrl && (
                        <>
                          <span>•</span>
                          <span className="text-purple-600 dark:text-purple-400 font-medium">Google Play Linked</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleToggleFeatured(game.id, game.featured)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      game.featured
                        ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {game.featured ? 'Unfeature' : 'Feature'}
                  </button>

                  <button
                    onClick={() => handleToggleStatus(game.id, game.status)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {game.status === 'Published' ? 'Set Coming Soon' : 'Publish'}
                  </button>

                  <Link
                    to={`/apps/${game.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="View public page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/admin/apps/edit/${game.id}`}
                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                    title="Edit game details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => {
                      setDeleteId(game.id);
                      setDeleteName(game.name);
                    }}
                    className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Delete game record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Delete Game Record
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete <strong>"{deleteName}"</strong> from your website?
              <br /><br />
              <strong>Note:</strong> Deleting this item from the website will NOT delete or affect the actual app on Google Play Console, Apple App Store, or users' mobile devices.
            </p>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
