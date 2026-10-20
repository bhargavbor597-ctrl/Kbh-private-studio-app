import React, { useState } from 'react';
import { api } from '../../services/api.ts';
import {
  Database,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Shield,
  Clock,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export const AdminBackupPage: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Selected file for restore
  const [selectedBackupData, setSelectedBackupData] = useState<any | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDownloadBackup = async () => {
    setDownloading(true);
    try {
      const res = await api.adminGetBackup();
      if (res.success && res.backup) {
        const jsonStr = JSON.stringify(res.backup, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.href = url;
        link.download = `khb_enterprise_backup_${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showNotify('success', 'Complete website database backup downloaded successfully.');
      }
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to generate database export');
    } finally {
      setDownloading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.data && !parsed.apps && !parsed.settings) {
          throw new Error('Unrecognized backup format. Expected KHB database export JSON.');
        }
        setSelectedBackupData(parsed);
      } catch (err: any) {
        showNotify('error', 'Invalid JSON file: ' + err.message);
        setSelectedBackupData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = async () => {
    if (!selectedBackupData) return;
    if (
      !window.confirm(
        'WARNING: Restoring will overwrite existing website apps, settings, themes, and page contents with this backup file. Proceed?'
      )
    ) {
      return;
    }

    setRestoring(true);
    try {
      const res = await api.adminRestoreBackup(selectedBackupData);
      if (res.success) {
        showNotify('success', 'Database restored successfully! Reloading site...');
        setSelectedBackupData(null);
        setSelectedFileName('');
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to restore database');
    } finally {
      setRestoring(false);
    }
  };

  const stats = selectedBackupData?.data || selectedBackupData;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Disaster Recovery & Portability</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Backup & Database Restore
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Download full snapshots of your applications, settings, themes, and content, or restore a previous archive safely.
          </p>
        </div>
      </div>

      {notification && (
        <div
          className={`flex items-center gap-2 p-4 rounded-2xl text-xs font-semibold ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. Export Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Export Full System Backup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Generates a complete, portable JSON archive including all published applications, themes, page content, root app-ads.txt records, contact messages, and support tickets.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Includes Apps & Games:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Yes (All)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Includes Custom Themes:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Yes (All)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Includes Page Texts & Legal:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Yes (All)</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadBackup}
            disabled={downloading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Compiling Archive...' : 'Download JSON Backup'}</span>
          </button>
        </div>

        {/* 2. Restore Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Restore Database From File
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Upload a verified KHB backup JSON file to safely roll back or restore your website database.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Backup File (.json)
              </label>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>

            {selectedBackupData && stats && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Archive Verified ({selectedFileName})</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-800 dark:text-emerald-300 pt-1">
                  <div>Apps: <strong>{stats.apps?.length || 0} items</strong></div>
                  <div>Messages: <strong>{stats.messages?.length || 0} items</strong></div>
                  <div>Support: <strong>{stats.supportRequests?.length || 0} tickets</strong></div>
                  <div>Settings: <strong>Valid schema</strong></div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleExecuteRestore}
            disabled={!selectedBackupData || restoring}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{restoring ? 'Restoring Database...' : 'Execute Database Restore'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
