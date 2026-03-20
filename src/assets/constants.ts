export interface DifficultySetting {
  min: number;
  max: number;
  operations: string[];
  timer: number;
  rewardMultiplier: number;
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  hasLives: boolean;
  maxLives?: number;
  hasTimer: boolean;
  sessionTime?: number;
  timerPerQuestion?: number;
}

export const DIFFICULTY_SETTINGS: Record<string, DifficultySetting> = {
  EASY: {
    min: 1,
    max: 10,
    operations: ['add', 'subtract'],
    timer: 15,
    rewardMultiplier: 1,
  },
  MEDIUM: {
    min: 1,
    max: 50,
    operations: ['add', 'subtract', 'multiply'],
    timer: 10,
    rewardMultiplier: 1.5,
  },
  HARD: {
    min: 1,
    max: 100,
    operations: ['add', 'subtract', 'multiply', 'divide'],
    timer: 7,
    rewardMultiplier: 2.5,
  },
  EXPERT: {
    min: 10,
    max: 200,
    operations: ['add', 'subtract', 'multiply', 'divide'],
    timer: 5,
    rewardMultiplier: 5,
  },
};

export const GAME_MODES: Record<string, GameMode> = {
  CLASSIC: {
    id: 'classic',
    name: 'Classic',
    description: 'Endless fun with increasing difficulty.',
    hasLives: true,
    hasTimer: false,
  },
  TIME_ATTACK: {
    id: 'time_attack',
    name: 'Time Attack',
    description: 'Solve as many as you can before time runs out!',
    hasLives: false,
    hasTimer: true,
    sessionTime: 60,
  },
  PRACTICE: {
    id: 'practice',
    name: 'Practice',
    description: 'No pressure, just learn.',
    hasLives: false,
    hasTimer: false,
  },
  SURVIVAL: {
    id: 'survival',
    name: 'Survival',
    description: 'One mistake and it is game over!',
    hasLives: true,
    maxLives: 1,
    hasTimer: true,
    timerPerQuestion: 5,
  },
};

export const THEMES = {
  DEFAULT: {
    id: 'default',
    name: 'Classic Blue',
    bg: 'bg-blue-50',
    primary: 'bg-blue-600',
    secondary: 'bg-blue-400',
    accent: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    card: 'bg-white shadow-lg rounded-3xl',
  },
  NEON: {
    id: 'neon',
    name: 'Neon Night',
    bg: 'bg-slate-900',
    primary: 'bg-purple-600',
    secondary: 'bg-pink-500',
    accent: 'text-purple-400',
    button: 'bg-purple-600 hover:bg-purple-700 text-white shadow-neon',
    card: 'bg-slate-800 shadow-xl rounded-3xl border border-purple-500/30',
  },
  GALAXY: {
    id: 'galaxy',
    name: 'Cosmic Voyage',
    bg: 'bg-indigo-950',
    primary: 'bg-indigo-500',
    secondary: 'bg-cyan-400',
    accent: 'text-cyan-300',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/50',
    card: 'bg-slate-900/80 backdrop-blur-md shadow-2xl rounded-3xl border border-indigo-500/50',
  },
  CANDY: {
    id: 'candy',
    name: 'Sweet Math',
    bg: 'bg-rose-50',
    primary: 'bg-rose-400',
    secondary: 'bg-amber-300',
    accent: 'text-rose-500',
    button: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200',
    card: 'bg-white shadow-xl rounded-[2.5rem] border-4 border-rose-100',
  },
};
