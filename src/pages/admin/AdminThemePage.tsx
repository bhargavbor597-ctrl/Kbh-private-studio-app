import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext.tsx';
import { THEME_PRESETS } from '../../constants/themePresets.ts';
import { PresetThemeId, SiteThemeSettings, ThemeColors, CustomThemePreset } from '../../types.ts';
import {
  Palette,
  Sparkles,
  Check,
  RotateCcw,
  Save,
  Eye,
  X,
  Plus,
  Copy,
  Trash2,
  Sliders,
  Type,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const AdminThemePage: React.FC = () => {
  const {
    themeSettings,
    effectiveSettings,
    isPreviewing,
    selectPreset,
    setPreview,
    saveTheme,
    resetToDefault,
    saveCustomPreset,
    deleteCustomPreset,
    duplicateCustomPreset,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'presets' | 'customizer' | 'typography' | 'custom-themes'>('presets');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Editable temporary colors when fine-tuning
  const [editingColors, setEditingColors] = useState<ThemeColors>(effectiveSettings.colors);
  const [editingRadius, setEditingRadius] = useState<SiteThemeSettings['borderRadius']>(effectiveSettings.borderRadius);
  const [editingFont, setEditingFont] = useState<string>(effectiveSettings.fontFamily);
  const [editingButtonStyle, setEditingButtonStyle] = useState<SiteThemeSettings['buttonStyle']>(effectiveSettings.buttonStyle);
  const [editingMode, setEditingMode] = useState<SiteThemeSettings['mode']>(effectiveSettings.mode);

  // New Custom Theme Modal / Form
  const [newCustomName, setNewCustomName] = useState('');
  const [showNewCustomDialog, setShowNewCustomDialog] = useState(false);

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApplyColorChange = (key: keyof ThemeColors, value: string) => {
    const updated = { ...editingColors, [key]: value };
    setEditingColors(updated);
    setPreview({
      ...effectiveSettings,
      activeThemeId: 'custom',
      colors: updated,
    });
  };

  const handleRadiusChange = (radius: SiteThemeSettings['borderRadius']) => {
    setEditingRadius(radius);
    setPreview({
      ...effectiveSettings,
      borderRadius: radius,
    });
  };

  const handleFontChange = (font: string) => {
    setEditingFont(font);
    setPreview({
      ...effectiveSettings,
      fontFamily: font,
    });
  };

  const handleModeChange = (mode: SiteThemeSettings['mode']) => {
    setEditingMode(mode);
    setPreview({
      ...effectiveSettings,
      mode,
    });
  };

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    const success = await saveTheme(effectiveSettings);
    setIsSaving(false);
    if (success) {
      showNotify('success', 'Theme and appearance settings published successfully across the entire website!');
    } else {
      showNotify('error', 'Failed to publish theme settings. Please try again.');
    }
  };

  const handleCancelPreview = () => {
    setPreview(null);
    setEditingColors(themeSettings.colors);
    setEditingRadius(themeSettings.borderRadius);
    setEditingFont(themeSettings.fontFamily);
    setEditingMode(themeSettings.mode);
    showNotify('success', 'Preview cancelled. Restored previous published theme.');
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all website theme settings and colors to Modern Blue default?')) return;
    setIsSaving(true);
    const success = await resetToDefault();
    setIsSaving(false);
    if (success) {
      showNotify('success', 'Restored default theme settings successfully.');
    } else {
      showNotify('error', 'Failed to reset theme.');
    }
  };

  const handleCreateCustomTheme = async () => {
    if (!newCustomName.trim()) return;
    const newPreset: CustomThemePreset = {
      id: 'custom-' + Date.now(),
      name: newCustomName.trim(),
      description: 'Custom theme created in Theme Manager',
      colors: { ...effectiveSettings.colors },
      fontFamily: effectiveSettings.fontFamily,
      borderRadius: effectiveSettings.borderRadius,
      buttonStyle: effectiveSettings.buttonStyle,
      shadows: effectiveSettings.shadows,
      mode: effectiveSettings.mode,
    };

    const ok = await saveCustomPreset(newPreset);
    if (ok) {
      setShowNewCustomDialog(false);
      setNewCustomName('');
      showNotify('success', `Custom theme "${newPreset.name}" created and saved!`);
    } else {
      showNotify('error', 'Failed to save custom theme preset.');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Appearance Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Website Theme & Appearance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose from ready-made themes, customize full color palettes, typography, shapes, and preview before publishing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isPreviewing && (
            <button
              onClick={handleCancelPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Preview</span>
            </button>
          )}

          <button
            onClick={handleResetDefaults}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            onClick={handleSaveAndPublish}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish Theme'}</span>
          </button>
        </div>
      </div>

      {/* Preview Alert Banner */}
      {isPreviewing && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Live Preview Active:</strong> You are currently previewing <strong>{effectiveSettings.activeThemeId}</strong>. Visitors will not see changes until you click <strong>Save & Publish Theme</strong>.
            </span>
          </div>
          <button
            onClick={handleSaveAndPublish}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0"
          >
            Publish Now
          </button>
        </div>
      )}

      {/* Notification Banner */}
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

      {/* Main Grid: Controls (Left) & Real-Time Live Component Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Theme Management Tabs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-800/80 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'presets'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Ready-Made Themes</span>
            </button>

            <button
              onClick={() => setActiveTab('customizer')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'customizer'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Color Customizer</span>
            </button>

            <button
              onClick={() => setActiveTab('typography')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'typography'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Fonts & Shapes</span>
            </button>

            <button
              onClick={() => setActiveTab('custom-themes')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'custom-themes'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Saved Presets</span>
            </button>
          </div>

          {/* TAB 1: READY-MADE THEMES */}
          {activeTab === 'presets' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Curated Theme Presets
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Click any theme to preview its color palette, contrast ratio, and typography immediately.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = effectiveSettings.activeThemeId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        selectPreset(preset.id);
                        setEditingColors(preset.colors);
                        setEditingRadius(preset.borderRadius);
                        setEditingFont(preset.fontFamily);
                      }}
                      className={`group relative p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${preset.previewGradient} shadow-xs`} />
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                              {preset.name}
                            </h3>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                              {preset.mode === 'dark' ? 'Dark Palette' : 'Light Palette'}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                        {preset.description}
                      </p>

                      {/* Color Palette Swatches */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div
                          className="w-5 h-5 rounded-md border border-black/10 shadow-xs"
                          style={{ backgroundColor: preset.colors.primary }}
                          title={`Primary: ${preset.colors.primary}`}
                        />
                        <div
                          className="w-5 h-5 rounded-md border border-black/10 shadow-xs"
                          style={{ backgroundColor: preset.colors.secondary }}
                          title={`Secondary: ${preset.colors.secondary}`}
                        />
                        <div
                          className="w-5 h-5 rounded-md border border-black/10 shadow-xs"
                          style={{ backgroundColor: preset.colors.accent }}
                          title={`Accent: ${preset.colors.accent}`}
                        />
                        <div
                          className="w-5 h-5 rounded-md border border-black/10 shadow-xs"
                          style={{ backgroundColor: preset.colors.background }}
                          title={`Background: ${preset.colors.background}`}
                        />
                        <div
                          className="w-5 h-5 rounded-md border border-black/10 shadow-xs"
                          style={{ backgroundColor: preset.colors.textMain }}
                          title={`Text: ${preset.colors.textMain}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: COLOR CUSTOMIZER */}
          {activeTab === 'customizer' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Detailed Color Palette Customizer
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Fine-tune exact HEX colors for every UI component. Changes apply live to the preview.
                  </p>
                </div>

                <button
                  onClick={() => setShowNewCustomDialog(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save as Custom Theme</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'primary' as keyof ThemeColors, label: 'Primary Brand Color', desc: 'Main buttons, links, accents' },
                  { key: 'primaryHover' as keyof ThemeColors, label: 'Primary Hover Color', desc: 'Interactive state on buttons' },
                  { key: 'secondary' as keyof ThemeColors, label: 'Secondary / Dark Contrast', desc: 'Footer headers, secondary badges' },
                  { key: 'accent' as keyof ThemeColors, label: 'Accent Highlight', desc: 'Feature highlights, badges, tags' },
                  { key: 'background' as keyof ThemeColors, label: 'Page Background', desc: 'Body canvas backdrop' },
                  { key: 'surface' as keyof ThemeColors, label: 'Surface / Containers', desc: 'Cards, modals, input backgrounds' },
                  { key: 'textMain' as keyof ThemeColors, label: 'Primary Text', desc: 'Headings and high-contrast copy' },
                  { key: 'textMuted' as keyof ThemeColors, label: 'Muted Text', desc: 'Descriptions, metadata, captions' },
                  { key: 'border' as keyof ThemeColors, label: 'Border & Divider', desc: 'Card outlines, tables, separators' },
                  { key: 'headerBg' as keyof ThemeColors, label: 'Header Navigation Bar', desc: 'Top navigation bar background' },
                  { key: 'footerBg' as keyof ThemeColors, label: 'Footer Background', desc: 'Main bottom footer canvas' },
                  { key: 'cardBg' as keyof ThemeColors, label: 'App Cards Background', desc: 'Listing item cards and panels' },
                ].map(({ key, label, desc }) => {
                  const val = editingColors[key] || '#4f46e5';
                  return (
                    <div
                      key={key}
                      className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {label}
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">{val}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{desc}</p>
                      <div className="flex items-center gap-3 pt-1">
                        <input
                          type="color"
                          value={val.startsWith('#') && val.length === 7 ? val : '#4f46e5'}
                          onChange={(e) => handleApplyColorChange(key, e.target.value)}
                          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 cursor-pointer bg-white"
                        />
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleApplyColorChange(key, e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY & SHAPES */}
          {activeTab === 'typography' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Typography, Shapes & Appearance Modes
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure corporate fonts, button corner styling, and color appearance modes.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Appearance Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Light Mode', icon: Sun },
                    { id: 'dark', label: 'Dark Mode', icon: Moon },
                    { id: 'system', label: 'System Auto', icon: Laptop },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleModeChange(id as any)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-semibold transition-all ${
                        editingMode === id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Typography Font Family
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['Plus Jakarta Sans', 'Inter', 'Roboto', 'Outfit'].map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() => handleFontChange(font)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                        editingFont === font
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Border Corner Radius
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'none', label: 'Sharp (0px)' },
                    { id: 'sm', label: 'Small (4px)' },
                    { id: 'md', label: 'Medium (8px)' },
                    { id: 'lg', label: 'Large (12px)' },
                    { id: 'xl', label: 'Curved (16px)' },
                    { id: 'full', label: 'Pill Round' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleRadiusChange(id as any)}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-medium text-center transition-all ${
                        editingRadius === id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SAVED CUSTOM PRESETS */}
          {activeTab === 'custom-themes' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Custom Saved Theme Presets
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage your personal brand presets, duplicate color combinations, or delete older styles.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewCustomDialog(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Preset</span>
                </button>
              </div>

              {(!themeSettings.customThemes || themeSettings.customThemes.length === 0) ? (
                <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <Palette className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    No custom presets created yet.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Customize your colors in the Color Customizer and click "Save as Custom Theme".
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {themeSettings.customThemes.map((preset) => (
                    <div
                      key={preset.id}
                      className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div
                            className="w-4 h-4 rounded-md border border-black/10"
                            style={{ backgroundColor: preset.colors.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded-md border border-black/10"
                            style={{ backgroundColor: preset.colors.secondary }}
                          />
                          <div
                            className="w-4 h-4 rounded-md border border-black/10"
                            style={{ backgroundColor: preset.colors.accent }}
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                            {preset.name}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {preset.fontFamily} • {preset.borderRadius} radius
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setPreview({
                              ...effectiveSettings,
                              activeThemeId: 'custom',
                              colors: preset.colors,
                              fontFamily: preset.fontFamily,
                              borderRadius: preset.borderRadius,
                              buttonStyle: preset.buttonStyle,
                              shadows: preset.shadows,
                              mode: preset.mode,
                            });
                            showNotify('success', `Previewing custom preset "${preset.name}"`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => duplicateCustomPreset(preset.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete custom theme "${preset.name}"?`)) {
                              deleteCustomPreset(preset.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Visual Component Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Live UI Preview
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Active: <strong className="text-indigo-600 uppercase">{effectiveSettings.activeThemeId}</strong>
                  </p>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: effectiveSettings.colors.primary }}
                >
                  Primary Sample
                </div>
              </div>

              {/* Sample 1: Mini Hero Mockup */}
              <div
                className="p-5 rounded-2xl border shadow-xs space-y-3"
                style={{
                  backgroundColor: effectiveSettings.colors.background,
                  borderColor: effectiveSettings.colors.border,
                }}
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>KHB Private Limited</span>
                </div>

                <h3
                  className="font-extrabold text-base leading-tight"
                  style={{
                    color: effectiveSettings.colors.textMain,
                    fontFamily: effectiveSettings.fontFamily,
                  }}
                >
                  We Build Simple & Useful Android Apps
                </h3>

                <p
                  className="text-xs leading-relaxed"
                  style={{ color: effectiveSettings.colors.textMuted }}
                >
                  High-performance utilities and engaging mobile games on Google Play.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    className="px-3.5 py-2 text-xs font-bold text-white shadow-xs"
                    style={{
                      backgroundColor: effectiveSettings.colors.primary,
                      borderRadius:
                        effectiveSettings.borderRadius === 'full'
                          ? '9999px'
                          : effectiveSettings.borderRadius === 'none'
                          ? '0px'
                          : '12px',
                    }}
                  >
                    Explore Apps
                  </button>

                  <button
                    className="px-3.5 py-2 text-xs font-semibold border shadow-xs"
                    style={{
                      backgroundColor: effectiveSettings.colors.surface,
                      borderColor: effectiveSettings.colors.border,
                      color: effectiveSettings.colors.textMain,
                      borderRadius:
                        effectiveSettings.borderRadius === 'full'
                          ? '9999px'
                          : effectiveSettings.borderRadius === 'none'
                          ? '0px'
                          : '12px',
                    }}
                  >
                    Contact Us
                  </button>
                </div>
              </div>

              {/* Sample 2: Mini App Card Mockup */}
              <div
                className="p-4 rounded-2xl border shadow-xs space-y-3"
                style={{
                  backgroundColor: effectiveSettings.colors.cardBg || effectiveSettings.colors.surface,
                  borderColor: effectiveSettings.colors.border,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs"
                    style={{ backgroundColor: effectiveSettings.colors.primary }}
                  >
                    EM
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-bold text-xs truncate"
                      style={{ color: effectiveSettings.colors.textMain }}
                    >
                      Expense Manager & Budget
                    </h4>
                    <span
                      className="text-[10px]"
                      style={{ color: effectiveSettings.colors.accent }}
                    >
                      Utilities • Offline 100%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span style={{ color: effectiveSettings.colors.textMuted }}>Google Play</span>
                  <span
                    className="font-bold"
                    style={{ color: effectiveSettings.colors.primary }}
                  >
                    Get on Store →
                  </span>
                </div>
              </div>

              {/* Sample 3: Navigation Mockup */}
              <div
                className="p-3 rounded-xl border flex items-center justify-between text-xs"
                style={{
                  backgroundColor: effectiveSettings.colors.headerBg,
                  borderColor: effectiveSettings.colors.border,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white"
                    style={{ backgroundColor: effectiveSettings.colors.primary }}
                  >
                    K
                  </div>
                  <span
                    className="font-bold"
                    style={{ color: effectiveSettings.colors.textMain }}
                  >
                    KHB Brand
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span style={{ color: effectiveSettings.colors.primary }} className="font-bold">
                    Home
                  </span>
                  <span style={{ color: effectiveSettings.colors.textMuted }}>Apps</span>
                  <span style={{ color: effectiveSettings.colors.textMuted }}>About</span>
                </div>
              </div>

              {/* Sample 4: Footer Mockup */}
              <div
                className="p-4 rounded-xl text-xs space-y-2 text-white"
                style={{ backgroundColor: effectiveSettings.colors.footerBg }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">KHB Private Limited</span>
                  <span className="text-[10px] opacity-70">© 2026</span>
                </div>
                <p className="text-[10px] opacity-70 leading-relaxed">
                  KAMBARIYA-HB ENTERPRISE PRIVATE LIMITED. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Custom Theme Modal */}
      {showNewCustomDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Save Custom Theme Preset
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter a name for this customized theme palette. It will be saved to your database and can be applied or duplicated anytime.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Theme Name
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Midnight Emerald, Royal Cyan"
                value={newCustomName}
                onChange={(e) => setNewCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowNewCustomDialog(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomTheme}
                disabled={!newCustomName.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                Save Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
