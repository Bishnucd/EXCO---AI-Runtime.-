/**
 * EXCO Settings Store
 * Manages application settings state
 */

import type React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Settings } from '@shared/types';
import { DEFAULT_SETTINGS } from '@shared/constants';

interface SettingsState {
  settings: Settings;
  initialized: boolean;
  initializeSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      initialized: false,

      initializeSettings: async () => {
        if (get().initialized) return;

        try {
          // Load from main process via IPC
          const stored = await window.exco.settings.get();
          set({ settings: { ...DEFAULT_SETTINGS, ...stored }, initialized: true });
        } catch (error) {
          console.error('Failed to load settings:', error);
          set({ initialized: true });
        }
      },

      updateSettings: async (updates: Partial<Settings>) => {
        const newSettings = { ...get().settings, ...updates };
        set({ settings: newSettings });

        try {
          await window.exco.settings.set(updates);
        } catch (error) {
          console.error('Failed to save settings:', error);
          // Revert on failure
          set({ settings: get().settings });
        }
      },

      resetSettings: async () => {
        set({ settings: DEFAULT_SETTINGS });
        try {
          await window.exco.settings.set(DEFAULT_SETTINGS);
        } catch (error) {
          console.error('Failed to reset settings:', error);
        }
      },
    }),
    {
      name: 'exco:settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings }),
      version: 1,
    }
  )
);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  // Settings are loaded via initializeSettings in App
  return children as React.ReactElement;
};