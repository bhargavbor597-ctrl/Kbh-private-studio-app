import React from 'react';
import { ButtonConfig } from '../../types.ts';
import { Eye, EyeOff, Link as LinkIcon } from 'lucide-react';

interface ButtonEditorProps {
  label: string;
  config: ButtonConfig;
  onChange: (updated: ButtonConfig) => void;
  defaultUrl?: string;
}

export const ButtonEditor: React.FC<ButtonEditorProps> = ({
  label,
  config,
  onChange,
  defaultUrl,
}) => {
  return (
    <div className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 dark:text-white">
          {label}
        </span>
        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
          <input
            type="checkbox"
            checked={config.visible}
            onChange={(e) => onChange({ ...config, visible: e.target.checked })}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
          <span className={config.visible ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
            {config.visible ? (
              <span className="inline-flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Visible</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hidden</span>
              </span>
            )}
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Button Label
          </label>
          <input
            type="text"
            value={config.text}
            onChange={(e) => onChange({ ...config, text: e.target.value })}
            placeholder="e.g. Explore Our Apps"
            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Destination URL / Route
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.url}
              onChange={(e) => onChange({ ...config, url: e.target.value })}
              placeholder={defaultUrl || 'e.g. /apps or https://...'}
              className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
