export type ThemeId = 'ivory' | 'forest' | 'obsidian' | 'nordic' | 'sunset' | 'amber';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  category: 'nature' | 'dark' | 'vibrant' | 'light';
  previewColors: {
    bg: string;
    surface: string;
    accent: string;
    sceneryOverlay: string;
  };
  sceneryFilter: string;
}

export interface VectorAvatarOption {
  id: string;
  name: string;
  bg: string;
  accent: string;
  emoji: string;
  description: string;
}

export const VECTOR_AVATARS: VectorAvatarOption[] = [
  {
    id: 'lotus',
    name: 'Zen Lotus',
    bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    accent: '#10B981',
    emoji: '🪷',
    description: 'Calm and steady mindful balance',
  },
  {
    id: 'shield',
    name: 'Cyber Sentinel',
    bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
    accent: '#06B6D4',
    emoji: '🛡️',
    description: 'Zero-trust protection and precision',
  },
  {
    id: 'leaf',
    name: 'Forest Sage',
    bg: 'bg-teal-500/15 border-teal-500/30 text-teal-400',
    accent: '#14B8A6',
    emoji: '🌿',
    description: 'Organic wealth growth and clarity',
  },
  {
    id: 'star',
    name: 'Golden Sparkle',
    bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    accent: '#F59E0B',
    emoji: '✨',
    description: 'Bright financial prosperity and goals',
  },
  {
    id: 'compass',
    name: 'Wealth Navigator',
    bg: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
    accent: '#0284C7',
    emoji: '🧭',
    description: 'Strategic lifelong financial roadmap',
  },
  {
    id: 'heart',
    name: 'Peaceful Heart',
    bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
    accent: '#F43F5E',
    emoji: '🤍',
    description: 'Stress-free abundance and wellbeing',
  },
];

export interface UserPreferences {
  theme: ThemeId;
  userName: string;
  dateOfBirth?: string;
  job?: string;
  avatarId?: string;
  workspacePassword?: string;
  greetingStyle: 'serene' | 'professional' | 'minimal';
  timeFormat: '12h' | '24h';
  showSceneryAnimation: boolean;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: 'ivory',
    name: 'Ivory Daylight',
    tagline: 'Clean bright daylight, crisp alpine mist & pristine white surface',
    category: 'light',
    previewColors: {
      bg: '#F5F7F6',
      surface: '#FFFFFF',
      accent: '#059669',
      sceneryOverlay: 'rgba(255, 255, 255, 0.45)',
    },
    sceneryFilter: 'brightness(1.1) contrast(1.02) saturate(1.1)',
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
