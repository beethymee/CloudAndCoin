export type ThemeId = 'bkash' | 'forest' | 'obsidian' | 'nordic' | 'sunset' | 'amber';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  category: 'nature' | 'dark' | 'vibrant';
  previewColors: {
    bg: string;
    surface: string;
    accent: string;
    sceneryOverlay: string;
  };
  sceneryFilter: string;
}

export interface UserPreferences {
  theme: ThemeId;
  userName: string;
  dateOfBirth?: string;
  job?: string;
  workspacePassword?: string;
  greetingStyle: 'serene' | 'professional' | 'minimal';
  timeFormat: '12h' | '24h';
  showSceneryAnimation: boolean;
  currencySymbol: '৳' | '$';
}

export const THEMES: ThemeDefinition[] = [
  {
    id: 'bkash',
    name: 'bKash Ruby',
    tagline: 'Iconic bKash magenta & ultra-clean mobile banking aesthetic',
    category: 'vibrant',
    previewColors: {
      bg: '#D11467',
      surface: '#FFFFFF',
      accent: '#E2136E',
      sceneryOverlay: 'rgba(209, 20, 103, 0.45)',
    },
    sceneryFilter: 'hue-rotate(290deg) saturate(1.4) brightness(0.95)',
  },
  {
    id: 'forest',
    name: 'Serene Forest',
    tagline: 'Misty pine ridges, calming sage & alpine lake peace',
    category: 'nature',
    previewColors: {
      bg: '#0F1A15',
      surface: '#182C23',
      accent: '#34D399',
      sceneryOverlay: 'rgba(15, 26, 21, 0.4)',
    },
    sceneryFilter: 'hue-rotate(0deg) saturate(1.05)',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Vault',
    tagline: 'Deep dark cybersecurity vault with emerald neon',
    category: 'dark',
    previewColors: {
      bg: '#07090E',
      surface: '#0F172A',
      accent: '#10B981',
      sceneryOverlay: 'rgba(7, 9, 14, 0.65)',
    },
    sceneryFilter: 'hue-rotate(190deg) contrast(1.15) brightness(0.75)',
  },
  {
    id: 'nordic',
    name: 'Nordic Glacier',
    tagline: 'Arctic blue waters, misty fjord peaks & cyan tranquility',
    category: 'nature',
    previewColors: {
      bg: '#091524',
      surface: '#13233A',
      accent: '#38BDF8',
      sceneryOverlay: 'rgba(9, 21, 36, 0.45)',
    },
    sceneryFilter: 'hue-rotate(160deg) saturate(1.2) brightness(0.95)',
  },
  {
    id: 'sunset',
    name: 'Sunset Horizon',
    tagline: 'Warm terracotta hills, glowing dusk sun & peach tranquility',
    category: 'vibrant',
    previewColors: {
      bg: '#1A1215',
      surface: '#2C1B20',
      accent: '#FB7185',
      sceneryOverlay: 'rgba(26, 18, 21, 0.4)',
    },
    sceneryFilter: 'hue-rotate(310deg) saturate(1.25) brightness(0.95)',
  },
  {
    id: 'amber',
    name: 'Golden Hour',
    tagline: 'Sunburst mountain ridge, warm gold & rich prosperity',
    category: 'vibrant',
    previewColors: {
      bg: '#18140B',
      surface: '#2A2213',
      accent: '#F59E0B',
      sceneryOverlay: 'rgba(24, 20, 11, 0.45)',
    },
    sceneryFilter: 'hue-rotate(345deg) saturate(1.3) brightness(1.0)',
  },
];
