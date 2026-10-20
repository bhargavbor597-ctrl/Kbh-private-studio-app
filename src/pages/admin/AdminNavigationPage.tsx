import React, { useEffect, useState } from 'react';
import { SiteSettings, NavigationSettings, NavMenuItem } from '../../types.ts';
import { api } from '../../services/api.ts';
import {
  Menu,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const AdminNavigationPage: React.FC = () => {
  const [nav, setNav] = useState<NavigationSettings>({
    headerMenuItems: [],
    footerQuickLinks: [],
    footerCategoryLinks: [],
    footerLegalLinks: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadNav();
  }, []);

  const loadNav = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.settings.navigation) {
        setNav(res.settings.navigation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.adminUpdateSettings({ navigation: nav });
      if (res.success) {
        showNotify('success', 'Navigation menus updated successfully! Live website menus synchronized.');
      }
    } catch (err: any) {
      showNotify('error', err.message || 'Failed to update navigation');
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = (section: keyof NavigationSettings) => {
    const list = [...nav[section]];
    const newItem: NavMenuItem = {
      id: `item-${Date.now()}`,
      label: 'New Link',
      href: '/',
      visible: true,
      displayOrder: list.length + 1,
    };
    setNav({ ...nav, [section]: [...list, newItem] });
  };

  const handleRemoveItem = (section: keyof NavigationSettings, id: string) => {
    setNav({
      ...nav,
      [section]: nav[section].filter((item) => item.id !== id),
    });
  };

  const handleUpdateItem = (
    section: keyof NavigationSettings,
    id: string,
    field: keyof NavMenuItem,
    val: any
  ) => {
    setNav({
      ...nav,
      [section]: nav[section].map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    });
  };

  const handleMove = (section: keyof NavigationSettings, index: number, direction: 'up' | 'down') => {
    const list = [...nav[section]];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setNav({ ...nav, [section]: list });
  };

  const renderSectionEditor = (
    section: keyof NavigationSettings,
    title: string,
    desc: string
  ) => {
    const items = nav[section] || [];
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </div>
          <button
            onClick={() => handleAddItem(section)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Menu Item</span>
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">No menu items configured.</p>
        ) : (
          <div className="space-y-2.5 pt-2">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  <div>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateItem(section, item.id, 'label', e.target.value)}
                      placeholder="Link Label"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => handleUpdateItem(section, item.id, 'href', e.target.value)}
                      placeholder="Destination URL (e.g. /apps, /about)"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleMove(section, idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Move Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(section, idx, 'down')}
                    disabled={idx === items.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleUpdateItem(section, item.id, 'visible', !item.visible)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.visible ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-400'
                    }`}
                    title={item.visible ? 'Item is visible' : 'Item is hidden'}
                  >
                    {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleRemoveItem(section, item.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading navigation menus...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 mb-2">
            <Menu className="w-3.5 h-3.5" />
            <span>Navigation Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Navigation & Menu Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize header navigation menus, footer link categories, reorder items, and manage link visibility.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Navigation'}</span>
        </button>
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

      <div className="space-y-6">
        {renderSectionEditor(
          'headerMenuItems',
          'Header Navigation Menu',
          'Links rendered in the top desktop navigation bar and mobile drawer menu.'
        )}

        {renderSectionEditor(
          'footerQuickLinks',
          'Footer Quick Links Column',
          'Direct navigation links shown in the primary footer column.'
        )}

        {renderSectionEditor(
          'footerCategoryLinks',
          'Footer Categories Column',
          'Productivity, Games, and Utilities category filter shortcuts in the footer.'
        )}

        {renderSectionEditor(
          'footerLegalLinks',
          'Footer Legal & Compliance Column',
          'Privacy Policy, Terms of Service, and app-ads.txt links.'
        )}
      </div>
    </div>
  );
};
