export type MoodType = 'terrible' | 'bad' | 'neutral' | 'good' | 'great';

export interface SleepData {
  date: string;
  hoursSlept: number;
  quality: number; // 1-10
  bedTime: string;
  wakeTime: string;
}

export interface WaterData {
  date: string;
  glasses: number;
  target: number;
}

export interface MoodData {
  date: string;
  mood: MoodType;
  notes?: string;
}

export interface ActivityData {
  date: string;
  steps: number;
  activeMinutes: number;
  workouts: {
    type: string;
    duration: number; // minutes
  }[];
}

export interface NutritionData {
  date: string;
  meals: {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    calories?: number;
    description?: string;
  }[];
  calories: {
    consumed: number;
    target: number;
  };
  water: number; // glasses
}

export interface HealthMetrics {
  sleepQuality: number;
  mentalClarity: number;
  energyLevel: number;
  exerciseMinutes: number;
  waterGlasses: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  tags: string[];
  mood?: MoodType;
  healthMetrics: HealthMetrics;
  symptoms: string[];
}

export interface HealthGoal {
  id: string;
  type: 'sleep' | 'water' | 'activity' | 'nutrition' | 'mood';
  target: number;
  current: number;
  unit: string;
  title: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0-100
}

export interface HealthChallenge {
  id: string;
  category: 'fitness' | 'mental' | 'nutrition' | 'sleep';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  streak: number;
  level: number;
  experience: number;
  healthCoins: number;
  joinedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  rank: number;
  streak: number;
  level: number;
}