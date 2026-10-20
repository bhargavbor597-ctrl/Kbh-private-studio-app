import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SiteThemeSettings, PresetThemeId, CustomThemePreset, ThemeColors } from '../types.ts';
import { THEME_PRESETS, DEFAULT_THEME_SETTINGS } from '../constants/themePresets.ts';
import { api } from '../services/api.ts';

interface ThemeContextType {
  themeSettings: SiteThemeSettings;
  effectiveSettings: SiteThemeSettings;
  isDark: boolean;
  isPreviewing: boolean;
  toggleTheme: () => void;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  selectPreset: (presetId: PresetThemeId) => void;
  setPreview: (settings: SiteThemeSettings | null) => void;
  saveTheme: (settings: SiteThemeSettings) => Promise<boolean>;
  resetToDefault: () => Promise<boolean>;
  saveCustomPreset: (preset: CustomThemePreset) => Promise<boolean>;
  deleteCustomPreset: (presetId: string) => Promise<boolean>;
  duplicateCustomPreset: (presetId: string) => Promise<boolean>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState<SiteThemeSettings>(() => {
    try {
      const cached = localStorage.getItem('khb_theme_settings');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_THEME_SETTINGS;
  });

  const [previewSettings, setPreviewSettings] = useState<SiteThemeSettings | null>(null);
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Effective theme currently applied (preview overrides saved settings)
  const effectiveSettings = previewSettings || themeSettings;

  // Compute dark state
  const isDark =
    effectiveSettings.mode === 'dark' ||
    (effectiveSettings.mode === 'system' && systemIsDark);

  // Load latest theme from backend on startup
  useEffect(() => {
    let isMounted = true;
    api
      .getSettings()
      .then((res) => {
        if (isMounted && res.success && res.settings.theme) {
          setThemeSettings(res.settings.theme);
          try {
            localStorage.setItem('khb_theme_settings', JSON.stringify(res.settings.theme));
          } catch (e) {
            // ignore
          }
        }
      })
      .catch(() => {});

    // Listen for system color scheme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => {
        isMounted = false;
        mediaQuery.removeEventListener('change', listener);
      };
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // Apply CSS custom variables and classes to the DOM
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const { colors, borderRadius, fontFamily } = effectiveSettings;

    // Radius mapping
    const radiusMap: Record<string, string> = {
      none: '0px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      full: '9999px',
    };

    const radiusVal = radiusMap[borderRadius] || '16px';

    // Inject CSS variables
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-theme-bg', colors.background);
    root.style.setProperty('--color-theme-surface', colors.surface);
    root.style.setProperty('--color-theme-text', colors.textMain);
    root.style.setProperty('--color-theme-muted', colors.textMuted);
    root.style.setProperty('--color-theme-border', colors.border);
    root.style.setProperty('--color-theme-header', colors.headerBg);
    root.style.setProperty('--color-theme-footer', colors.footerBg);
    root.style.setProperty('--color-theme-card', colors.cardBg);
    root.style.setProperty('--theme-border-radius', radiusVal);

    if (fontFamily && fontFamily !== 'System') {
      root.style.setProperty('--font-family-theme', `"${fontFamily}", sans-serif`);
    } else {
      root.style.setProperty('--font-family-theme', 'inherit');
    }
  }, [effectiveSettings, isDark]);

  const toggleTheme = useCallback(() => {
    setThemeSettings((prev) => {
      const newMode = isDark ? 'light' : 'dark';
      const updated: SiteThemeSettings = { ...prev, mode: newMode };
      localStorage.setItem('khb_theme_settings', JSON.stringify(updated));
      api.adminUpdateSettings({ theme: updated }).catch(() => {});
      return updated;
    });
  }, [isDark]);

  const setMode = useCallback((mode: 'light' | 'dark' | 'system') => {
    setThemeSettings((prev) => {
      const updated: SiteThemeSettings = { ...prev, mode };
      localStorage.setItem('khb_theme_settings', JSON.stringify(updated));
      api.adminUpdateSettings({ theme: updated }).catch(() => {});
      return updated;
    });
  }, []);

  const selectPreset = useCallback((presetId: PresetThemeId) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setPreviewSettings((prev) => {
      const base = prev || themeSettings;
      return {
        ...base,
        activeThemeId: presetId,
        colors: { ...preset.colors },
        fontFamily: preset.fontFamily,
        borderRadius: preset.borderRadius,
        buttonStyle: preset.buttonStyle,
        shadows: preset.shadows,
        mode: preset.mode,
      };
    });
  }, [themeSettings]);

  const setPreview = useCallback((settings: SiteThemeSettings | null) => {
    setPreviewSettings(settings);
  }, []);

  const saveTheme = useCallback(async (settings: SiteThemeSettings): Promise<boolean> => {
    try {
      const res = await api.adminUpdateSettings({ theme: settings });
      if (res.success) {
        setThemeSettings(settings);
        setPreviewSettings(null);
        localStorage.setItem('khb_theme_settings', JSON.stringify(settings));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to save theme settings:', e);
      return false;
    }
  }, []);

  const resetToDefault = useCallback(async (): Promise<boolean> => {
    try {
      const res = await api.adminUpdateSettings({ theme: DEFAULT_THEME_SETTINGS });
      if (res.success) {
        setThemeSettings(DEFAULT_THEME_SETTINGS);
        setPreviewSettings(null);
        localStorage.setItem('khb_theme_settings', JSON.stringify(DEFAULT_THEME_SETTINGS));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to reset theme:', e);
      return false;
    }
  }, []);

  const saveCustomPreset = useCallback(async (customPreset: CustomThemePreset): Promise<boolean> => {
    const existingList = themeSettings.customThemes || [];
    const idx = existingList.findIndex((p) => p.id === customPreset.id);
    let updatedList: CustomThemePreset[];
    if (idx >= 0) {
      updatedList = [...existingList];
      updatedList[idx] = customPreset;
    } else {
      updatedList = [...existingList, customPreset];
    }

    const updatedSettings: SiteThemeSettings = {
      ...themeSettings,
      activeThemeId: 'custom',
      colors: customPreset.colors,
      fontFamily: customPreset.fontFamily,
      borderRadius: customPreset.borderRadius,
      buttonStyle: customPreset.buttonStyle,
      shadows: customPreset.shadows,
      mode: customPreset.mode,
      customThemes: updatedList,
    };

    return saveTheme(updatedSettings);
  }, [themeSettings, saveTheme]);

  const deleteCustomPreset = useCallback(async (presetId: string): Promise<boolean> => {
    const existingList = themeSettings.customThemes || [];
    const updatedList = existingList.filter((p) => p.id !== presetId);
    const updatedSettings: SiteThemeSettings = {
      ...themeSettings,
      customThemes: updatedList,
      activeThemeId: themeSettings.activeThemeId === 'custom' ? 'modern-blue' : themeSettings.activeThemeId,
    };
    return saveTheme(updatedSettings);
  }, [themeSettings, saveTheme]);

  const duplicateCustomPreset = useCallback(async (presetId: string): Promise<boolean> => {
    const existingList = themeSettings.customThemes || [];
    const target = existingList.find((p) => p.id === presetId);
    if (!target) return false;

    const duplicated: CustomThemePreset = {
      ...target,
      id: 'custom-' + Date.now(),
      name: `${target.name} (Copy)`,
    };

    return saveCustomPreset(duplicated);
  }, [themeSettings, saveCustomPreset]);

  return (
    <ThemeContext.Provider
      value={{
        themeSettings,
        effectiveSettings,
        isDark,
        isPreviewing: previewSettings !== null,
        toggleTheme,
        setMode,
        selectPreset,
        setPreview,
        saveTheme,
        resetToDefault,
        saveCustomPreset,
        deleteCustomPreset,
        duplicateCustomPreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
