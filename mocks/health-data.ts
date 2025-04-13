import { 
    SleepData, 
    WaterData, 
    MoodData, 
    ActivityData, 
    JournalEntry, 
    HealthGoal, 
    Achievement,
    HealthChallenge,
    UserProfile,
} from '@/types/health';
  
  // Helper to generate dates for the last n days
  const getDateString = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };
  
  // Sleep data for only 3 days (today, 2 days ago, and 4 days ago)
  export const sleepData: SleepData[] = [
    { date: getDateString(0), hoursSlept: 8.5, quality: 9, bedTime: '22:30', wakeTime: '07:00' },
    { date: getDateString(2), hoursSlept: 5.5, quality: 4, bedTime: '01:30', wakeTime: '07:00' },
    { date: getDateString(4), hoursSlept: 8.0, quality: 9, bedTime: '22:45', wakeTime: '06:45' },
  ];
  
  // Water intake data for the same 3 days
  export const waterData: WaterData[] = [
    { date: getDateString(0), glasses: 3, target: 8 },
    { date: getDateString(2), glasses: 4, target: 8 },
    { date: getDateString(4), glasses: 8, target: 8 },
  ];
  
  // Mood data for the same 3 days
  export const moodData: MoodData[] = [
    { date: getDateString(0), mood: 'good', notes: 'Feeling optimistic' },
    { date: getDateString(2), mood: 'bad', notes: 'Stressed about deadline' },
    { date: getDateString(4), mood: 'great', notes: 'Amazing day outdoors' },
  ];
  
  // Activity data for the same 3 days
  export const activityData: ActivityData[] = [
    { 
      date: getDateString(0), 
      steps: 6700, 
      activeMinutes: 30, 
      workouts: [{ type: 'Strength Training', duration: 25 }] 
    },
    { 
      date: getDateString(2), 
      steps: 3500, 
      activeMinutes: 15, 
      workouts: [] 
    },
    { 
      date: getDateString(4), 
      steps: 12000, 
      activeMinutes: 75, 
      workouts: [{ type: 'Hiking', duration: 60 }, { type: 'Yoga', duration: 15 }] 
    },
  ];
  
  // Journal entries mock data
  export const mockJournalEntries: JournalEntry[] = [
    {
      id: '1',
      user_id: '1',
      content: 'Had a great workout session today! Feeling energized.',
      mood: 'great',
      health_metrics: {
        sleep_quality: 8,
        mental_clarity: 9,
        energy_level: 9,
        exercise_minutes: 60,
        water_glasses: 8
      },
      tags: ['workout', 'energy'],
      symptoms: [],
      created_at: '2024-03-15T10:00:00Z',
      updated_at: '2024-03-15T10:00:00Z'
    },
    // ... other journal entries with similar structure
  ];
  
  // Health goals
  export const healthGoals: HealthGoal[] = [
    {
      id: '1',
      type: 'sleep',
      target: 8,
      current: 7.2,
      unit: 'hours',
      title: 'Sleep 8 hours per night'
    },
    {
      id: '2',
      type: 'water',
      target: 8,
      current: 5,
      unit: 'glasses',
      title: 'Drink 8 glasses of water'
    },
    {
      id: '3',
      type: 'activity',
      target: 10000,
      current: 6700,
      unit: 'steps',
      title: 'Walk 10,000 steps daily'
    },
    {
      id: '4',
      type: 'nutrition',
      target: 2000,
      current: 1850,
      unit: 'calories',
      title: 'Stay under 2000 calories'
    },
  ];
  
  // Achievements
  export const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Early Bird',
      description: 'Wake up before 7 AM for 5 consecutive days',
      icon: 'sunrise',
      unlockedAt: getDateString(10),
      progress: 100
    },
    {
      id: '2',
      title: 'Hydration Hero',
      description: 'Drink 8 glasses of water for 7 consecutive days',
      icon: 'droplet',
      progress: 70
    },
    {
      id: '3',
      title: 'Step Master',
      description: 'Reach 10,000 steps for 10 consecutive days',
      icon: 'footprints',
      progress: 40
    },
    {
      id: '4',
      title: 'Zen Master',
      description: 'Meditate for 10 minutes daily for 14 days',
      icon: 'brain',
      progress: 20
    },
    {
      id: '5',
      title: 'Journal Keeper',
      description: 'Write in your journal for 30 consecutive days',
      icon: 'book',
      progress: 60
    },
  ];
  
  // Health challenges
  export const healthChallenges: HealthChallenge[] = [
    {
      id: '1',
      category: 'activity',
      title: '30-minute cardio workout',
      description: 'Complete a cardio session to boost your energy',
      difficulty: 'medium'
    },
    {
      id: '2',
      category: 'mood',
      title: '10-minute meditation',
      description: 'Take a moment to clear your mind',
      difficulty: 'easy'
    },
    {
      id: '3',
      category: 'sleep',
      title: 'Go to bed 30 minutes earlier',
      description: 'Get some extra rest by turning in a bit earlier',
      difficulty: 'medium'
    },
    {
      id: '4',
      category: 'nutrition',
      title: 'No added sugar today',
      description: 'Cut out added sugars from your diet temporarily',
      difficulty: 'hard'
    },
    {
      id: '5',
      category: 'water',
      title: 'Drink 8 glasses of water',
      description: 'Stay hydrated throughout the day',
      difficulty: 'medium'
    },
    {
      id: '6',
      category: 'activity',
      title: 'Take a 15-minute walk',
      description: 'Get some light exercise and fresh air',
      difficulty: 'easy'
    },
    {
      id: '7',
      category: 'mood',
      title: 'Write down 3 things you are grateful for',
      description: 'Practicing gratitude can improve your mental wellbeing',
      difficulty: 'easy'
    },
    {
      id: '8',
      category: 'activity',
      title: 'Hold a plank for 1 minute',
      description: 'Challenge your core strength with this exercise',
      difficulty: 'hard'
    }
  ];
  
  // User profile
  export const userProfile: UserProfile = {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    streak: 5,
    level: 7,
    experience: 3500,
    healthCoins: 240,
    joinedAt: '2023-01-15',
    lastActivityDate: new Date(Date.now() - 86400000).toISOString().split('T')[0] // yesterday's date
  };