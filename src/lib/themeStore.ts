export type BgPattern = "grid" | "dots" | "none";
export type BgIntensity = "low" | "medium" | "high";

export interface ThemeSettings {
  pattern: BgPattern;
  intensity: BgIntensity;
  glowEnabled: boolean;
}

const STORAGE_KEY = "theme_settings";

const defaults: ThemeSettings = {
  pattern: "grid",
  intensity: "low",
  glowEnabled: true,
};

export const getThemeSettings = (): ThemeSettings => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
};

export const saveThemeSettings = (settings: ThemeSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

const intensityMap: Record<BgIntensity, number> = {
  low: 0.03,
  medium: 0.07,
  high: 0.12,
};

const glowIntensityMap: Record<BgIntensity, number> = {
  low: 0.03,
  medium: 0.06,
  high: 0.1,
};

export const getPatternOpacity = (settings: ThemeSettings) => intensityMap[settings.intensity];
export const getGlowOpacity = (settings: ThemeSettings) => glowIntensityMap[settings.intensity];
