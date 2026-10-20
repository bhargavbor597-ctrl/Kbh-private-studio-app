import React from 'react';
import { AppItem } from '../../types.ts';
import { Link } from '../../context/RouterContext.tsx';
import { Play, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

interface AppCardProps {
  app: AppItem;
  featuredHighlight?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({ app, featuredHighlight = false }) => {
  const isComingSoon = app.status === 'Coming Soon';

  return (
    <div
      id={`app-card-${app.slug}`}
      className={`group relative flex flex-col bg-white dark:bg-slate-900 border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        featuredHighlight
          ? 'border-indigo-200 dark:border-indigo-900/60 shadow-md ring-1 ring-indigo-500/10'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Badges Row */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {app.category}
        </span>
        <div className="flex items-center gap-1.5">
          {app.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Featured
            </span>
          )}
          {isComingSoon ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
              Coming Soon
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              Published
            </span>
          )}
        </div>
      </div>

      {/* Header: Icon & Title */}
      <div className="flex items-start gap-4 mb-3">
        <div className="relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <img
            src={app.icon}
            alt={`${app.name} icon`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // fallback placeholder icon if broken URL
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <Link to={`/apps/${app.slug}`}>{app.name}</Link>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium flex items-center gap-1.5">
            <span>{app.platform || 'Android'}</span>
            {app.version && (
              <>
                <span>•</span>
                <span>v{app.version}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Short Description */}
      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-6 flex-1">
        {app.shortDescription}
      </p>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 mt-auto">
        <Link
          to={`/apps/${app.slug}`}
          id={`view-details-${app.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {app.playStoreUrl && (
          <a
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            id={`play-store-${app.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
            title="Download on Google Play"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Google Play</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}
      </div>
    </div>
  );
};
