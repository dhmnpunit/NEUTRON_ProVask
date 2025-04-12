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
  journalEntries as mockJournalEntries,
  healthGoals as mockHealthGoals,
  achievements as mockAchievements,
  userProfile as mockUserProfile,
  healthChallenges as mockHealthChallenges
} from '@/mocks/health-data';

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
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set) => ({
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
      
      addJournalEntry: (entry) => set((state) => ({
        journalEntries: [
          {
            id: Date.now().toString(),
            ...entry
          },
          ...state.journalEntries
        ]
      })),
      
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
          
        return {
          currentChallenge: null,
          userProfile: {
            ...state.userProfile,
            healthCoins: state.userProfile.healthCoins + coinsEarned,
            streak: state.userProfile.streak + 1,
            experience: state.userProfile.experience + (coinsEarned * 5)
          }
        };
      }),
      
      updateUserProfile: (updates) => set((state) => ({
        userProfile: {
          ...state.userProfile,
          ...updates
        }
      })),
    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);