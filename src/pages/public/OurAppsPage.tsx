import React, { useEffect, useState, useMemo } from 'react';
import { AppItem, PageContent } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useRouter } from '../../context/RouterContext.tsx';
import { AppCard } from '../../components/ui/AppCard.tsx';
import { Search, Filter, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const OurAppsPage: React.FC = () => {
  const { query, navigate } = useRouter();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter state initialized from URL query if present
  const [search, setSearch] = useState(query.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(query.get('category') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(query.get('status') || 'All');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'alphabetical'>('featured');

  useEffect(() => {
    async function loadApps() {
      setLoading(true);
      try {
        const [appsRes, contentRes] = await Promise.all([
          api.getPublicApps(),
          api.getPageContent(),
        ]);
        if (appsRes.success) {
          setApps(appsRes.apps);
        }
        if (contentRes.success && contentRes.content) {
          setContent(contentRes.content);
        }
      } catch (err) {
        console.error('Failed to load apps:', err);
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, []);

  // Synchronize when URL query changes
  useEffect(() => {
    if (query.get('category')) setSelectedCategory(query.get('category')!);
    if (query.get('status')) setSelectedStatus(query.get('status')!);
  }, [query]);

  const categories = ['All', 'Productivity', 'Utilities', 'Games', 'Tools', 'Lifestyle'];
  const statuses = ['All', 'Published', 'Coming Soon'];

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => {
        const matchesCategory =
          selectedCategory === 'All' || app.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesStatus =
          selectedStatus === 'All' || app.status === selectedStatus;
        const matchesSearch =
          !search ||
          app.name.toLowerCase().includes(search.toLowerCase()) ||
          app.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
          app.category.toLowerCase().includes(search.toLowerCase()) ||
          app.features.some((f) => f.toLowerCase().includes(search.toLowerCase()));

        return matchesCategory && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (a.displayOrder || 99) - (b.displayOrder || 99);
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'alphabetical') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [apps, search, selectedCategory, selectedStatus, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSortBy('featured');
    navigate('/apps');
  };

  const pageData = content?.ourAppsPage;

  return (
    <div className="min-h-screen py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {pageData?.title || 'Our Applications & Games'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          {pageData?.subtitle ||
            'Explore our complete directory of mobile software, daily utilities, and casual games available on Google Play.'}
        </p>
      </div>

      {pageData?.headerBanner && (
        <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm max-h-56">
          <img
            src={pageData.headerBanner}
            alt={pageData.title || 'Our Apps'}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-8 shadow-xs space-y-4">
        {/* Search bar & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="apps-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={pageData?.searchPlaceholder || 'Search apps by name, feature, or keyword...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              id="apps-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="newest">Sort: Newest Releases</option>
              <option value="alphabetical">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category and Status Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-cat-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Statuses */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
            {statuses.map((stat) => (
              <button
                key={stat}
                id={`filter-stat-${stat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedStatus(stat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedStatus === stat
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Showing <strong className="text-slate-900 dark:text-white">{filteredApps.length}</strong>{' '}
          {filteredApps.length === 1 ? 'application' : 'applications'}
        </p>

        {(search || selectedCategory !== 'All' || selectedStatus !== 'All') && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            No matching applications found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            We could not find any apps matching your current search or category filters.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
