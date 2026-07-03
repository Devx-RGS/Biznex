import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'biznex_settings';

export const DEFAULT_SETTINGS = {
  theme: 'dark',
  enquiryAlerts: true,
  eventReminders: true,
  referralUpdates: false,
  profileVisible: true,
  secureChatLock: true,
  onlineStatus: true,
  digest: 'Daily',
  language: 'English',
};

const THEMES = {
  dark: {
    mode: 'dark',
    primary: '#0A1931',
    accent: '#C9A84C',
    background: '#0A1931',
    surface: '#0F2340',
    card: '#102542',
    text: '#FFFFFF',
    mutedText: '#8A9BB0',
    border: 'rgba(201,168,76,0.14)',
    input: '#FFFFFF',
    inputText: '#0A1931',
  },
  light: {
    mode: 'light',
    primary: '#F6F8FC',
    accent: '#9B7A18',
    background: '#F6F8FC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#0A1931',
    mutedText: '#5E6D82',
    border: 'rgba(10,25,49,0.12)',
    input: '#FFFFFF',
    inputText: '#0A1931',
  },
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedAt, setSavedAt] = useState('Not saved yet');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => {
        if (!mounted) return;
        if (value) {
          const parsed = JSON.parse(value);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
          setSavedAt(parsed.savedAt || 'Saved previously');
        }
      })
      .finally(() => {
        if (mounted) setLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async nextSettings => {
    const settingsToSave = nextSettings || settings;
    const timestamp = new Date().toLocaleString();
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ settings: settingsToSave, savedAt: timestamp })
    );
    setSettings(settingsToSave);
    setSavedAt(timestamp);
  };

  const resetSettings = async () => {
    setSettings(DEFAULT_SETTINGS);
    setSavedAt('Not saved yet');
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const theme = THEMES[settings.theme] || THEMES.dark;

  const value = useMemo(
    () => ({
      loaded,
      settings,
      theme,
      savedAt,
      updateSetting,
      saveSettings,
      resetSettings,
    }),
    [loaded, settings, theme, savedAt]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
