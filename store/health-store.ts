import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  SleepData, 
  WaterData, 
  MoodData, 
  ActivityData, 
  JournalEntry, 
  HealthGoal, 
  Achievement,
  UserProfile,
  HealthChallenge
} from '@/types/health';
import { 
  sleepData as mockSleepData, 
  waterData as mockWaterData, 
  moodData as mockMoodData, 
  activityData as mockActivityData,
  mockJournalEntries,
  healthGoals as mockHealthGoals,
  achievements as mockAchievements,
  userProfile as mockUserProfile,
  healthChallenges as mockHealthChallenges
} from '@/mocks/health-data';
import { differenceInDays, parseISO } from 'date-fns';

// New Task interface for the flip dice challenges
export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  coins: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

interface HealthState {
  // User data
  userProfile: UserProfile;
  
  // Health metrics
  sleepData: SleepData[];
  waterData: WaterData[];
  moodData: MoodData[];
  activityData: ActivityData[];
  
  // Journal
  journalEntries: JournalEntry[];
  
  // Goals and achievements
  healthGoals: HealthGoal[];
  achievements: Achievement[];
  
  // Challenges
  healthChallenges: HealthChallenge[];
  currentChallenge: HealthChallenge | null;
  
  // Tasks from flip dice
  tasks: Task[];
  
  // Actions
  addSleepData: (data: SleepData) => void;
  addWaterData: (data: WaterData) => void;
  addMoodData: (data: MoodData) => void;
  addActivityData: (data: ActivityData) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  updateGoal: (id: string, updates: Partial<HealthGoal>) => void;
  rollNewChallenge: (category?: string) => void;
  completeChallenge: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // New task functions
  addTask: (task: Omit<Task, 'completedAt'>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateHealthCoins: (amount: number) => void;
  
  // New actions
  checkStreak: () => void;
}

// Fix streak calculation logic
const checkAndUpdateStreak = (state: HealthState) => {
  if (!state.userProfile.lastActivityDate) return 0;
  
  const today = new Date();
  const lastActivity = parseISO(state.userProfile.lastActivityDate);
  const dayDiff = differenceInDays(today, lastActivity);
  
  // Reset streak if more than 1 day has passed
  if (dayDiff > 1) {
    return 0;
  }
  
  // Keep existing streak if activity was today or yesterday
  return state.userProfile.streak;
};

// Helper function to calculate new streak value
const calculateNewStreak = (state: HealthState) => {
  // First check if streak should be reset
  const baseStreak = checkAndUpdateStreak(state);
  
  // Get today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  // Only increment if this is the first activity today
  if (state.userProfile.lastActivityDate !== today) {
    return baseStreak + 1;
  }
  
  // Don't increment if already logged something today
  return baseStreak;
};

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      // Initial state with mock data
      userProfile: mockUserProfile,
      sleepData: mockSleepData,
      waterData: mockWaterData,
      moodData: mockMoodData,
      activityData: mockActivityData,
      journalEntries: mockJournalEntries,
      healthGoals: mockHealthGoals,
      achievements: mockAchievements,
      healthChallenges: mockHealthChallenges,
      currentChallenge: null,
      tasks: [],
      
      // Actions
      addSleepData: (data) => set((state) => ({
        sleepData: [data, ...state.sleepData]
      })),
      
      addWaterData: (data) => set((state) => ({
        waterData: [data, ...state.waterData]
      })),
      
      addMoodData: (data) => set((state) => ({
        moodData: [data, ...state.moodData]
      })),
      
      addActivityData: (data) => set((state) => ({
        activityData: [data, ...state.activityData]
      })),
      
      addJournalEntry: (entry) => set((state) => {
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate new streak value
        const newStreak = calculateNewStreak(state);
        
        return {
          journalEntries: [
            {
              id: Date.now().toString(),
              ...entry
            },
            ...state.journalEntries
          ],
          userProfile: {
            ...state.userProfile,
            streak: newStreak,
            lastActivityDate: today
          }
        };
      }),
      
      updateJournalEntry: (id, updates) => set((state) => ({
        journalEntries: state.journalEntries.map(entry => 
          entry.id === id ? { ...entry, ...updates } : entry
        )
      })),
      
      deleteJournalEntry: (id) => set((state) => ({
        journalEntries: state.journalEntries.filter(entry => entry.id !== id)
      })),
      
      updateGoal: (id, updates) => set((state) => ({
        healthGoals: state.healthGoals.map(goal => 
          goal.id === id ? { ...goal, ...updates } : goal
        )
      })),
      
      rollNewChallenge: (category) => set((state) => {
        const filteredChallenges = category 
          ? state.healthChallenges.filter(c => c.category === category)
          : state.healthChallenges;
          
        const randomIndex = Math.floor(Math.random() * filteredChallenges.length);
        return {
          currentChallenge: filteredChallenges[randomIndex]
        };
      }),
      
      completeChallenge: () => set((state) => {
        if (!state.currentChallenge) return state;
        
        // Add health coins based on difficulty
        const coinsEarned = 
          state.currentChallenge.difficulty === 'easy' ? 10 :
          state.currentChallenge.difficulty === 'medium' ? 20 : 30;
        
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate new streak value
        const newStreak = calculateNewStreak(state);
          
        return {
          currentChallenge: null,
          userProfile: {
            ...state.userProfile,
            healthCoins: state.userProfile.healthCoins + coinsEarned,
            streak: newStreak,
            experience: state.userProfile.experience + (coinsEarned * 5),
            lastActivityDate: today
          }
        };
      }),
      
      updateUserProfile: (updates) => set((state) => ({
        userProfile: {
          ...state.userProfile,
          ...updates
        }
      })),
      
      // New task functions
      addTask: (task) => set((state) => ({
        tasks: [task, ...state.tasks]
      })),
      
      completeTask: (id) => set((state) => {
        const taskToComplete = state.tasks.find(task => task.id === id);
        
        if (!taskToComplete) return state;
        
        const updatedTasks = state.tasks.map(task => 
          task.id === id ? { 
            ...task, 
            completed: true, 
            completedAt: new Date().toISOString() 
          } : task
        );
        
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate new streak value
        const newStreak = calculateNewStreak(state);
        
        return {
          tasks: updatedTasks,
          userProfile: {
            ...state.userProfile,
            healthCoins: state.userProfile.healthCoins + (taskToComplete.coins || 0),
            streak: newStreak,
            experience: state.userProfile.experience + ((taskToComplete.coins || 0) * 5),
            lastActivityDate: today
          }
        };
      }),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),
      
      updateHealthCoins: (amount) => set((state) => ({
        userProfile: {
          ...state.userProfile,
          healthCoins: state.userProfile.healthCoins + amount
        }
      })),
      
      // New actions
      checkStreak: () => set((state) => {
        if (!state.userProfile.lastActivityDate) {
          // If there's no lastActivityDate, reset streak to 0
          return {
            userProfile: {
              ...state.userProfile,
              streak: 0
            }
          };
        }
        
        const today = new Date();
        const lastActivity = parseISO(state.userProfile.lastActivityDate);
        const dayDiff = differenceInDays(today, lastActivity);
        
        if (dayDiff > 1) {
          // If more than a day has passed, reset streak
          return {
            userProfile: {
              ...state.userProfile,
              streak: 0
            }
          };
        }
        
        // Otherwise, keep current streak
        return state;
      }),
    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);