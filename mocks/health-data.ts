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
    LeaderboardEntry
  } from '@/types/health';
  
  // Helper to generate dates for the last n days
  const getDateString = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };
  
  // Sleep data for the last 7 days
  export const sleepData: SleepData[] = [
    { date: getDateString(6), hoursSlept: 7.5, quality: 8, bedTime: '23:30', wakeTime: '07:00' },
    { date: getDateString(5), hoursSlept: 6.2, quality: 6, bedTime: '00:15', wakeTime: '06:30' },
    { date: getDateString(4), hoursSlept: 8.0, quality: 9, bedTime: '22:45', wakeTime: '06:45' },
    { date: getDateString(3), hoursSlept: 7.8, quality: 8, bedTime: '23:00', wakeTime: '06:45' },
    { date: getDateString(2), hoursSlept: 5.5, quality: 4, bedTime: '01:30', wakeTime: '07:00' },
    { date: getDateString(1), hoursSlept: 7.2, quality: 7, bedTime: '23:15', wakeTime: '06:30' },
    { date: getDateString(0), hoursSlept: 8.5, quality: 9, bedTime: '22:30', wakeTime: '07:00' },
  ];
  
  // Water intake data for the last 7 days
  export const waterData: WaterData[] = [
    { date: getDateString(6), glasses: 5, target: 8 },
    { date: getDateString(5), glasses: 6, target: 8 },
    { date: getDateString(4), glasses: 8, target: 8 },
    { date: getDateString(3), glasses: 7, target: 8 },
    { date: getDateString(2), glasses: 4, target: 8 },
    { date: getDateString(1), glasses: 6, target: 8 },
    { date: getDateString(0), glasses: 3, target: 8 },
  ];
  
  // Mood data for the last 7 days
  export const moodData: MoodData[] = [
    { date: getDateString(6), mood: 'good', notes: 'Productive day at work' },
    { date: getDateString(5), mood: 'neutral', notes: 'Feeling a bit tired' },
    { date: getDateString(4), mood: 'great', notes: 'Amazing day outdoors' },
    { date: getDateString(3), mood: 'good', notes: 'Good progress on project' },
    { date: getDateString(2), mood: 'bad', notes: 'Stressed about deadline' },
    { date: getDateString(1), mood: 'neutral', notes: 'Average day' },
    { date: getDateString(0), mood: 'good', notes: 'Feeling optimistic' },
  ];
  
  // Activity data for the last 7 days
  export const activityData: ActivityData[] = [
    { 
      date: getDateString(6), 
      steps: 8500, 
      activeMinutes: 45, 
      workouts: [{ type: 'Running', duration: 30 }] 
    },
    { 
      date: getDateString(5), 
      steps: 5200, 
      activeMinutes: 20, 
      workouts: [] 
    },
    { 
      date: getDateString(4), 
      steps: 12000, 
      activeMinutes: 75, 
      workouts: [{ type: 'Hiking', duration: 60 }, { type: 'Yoga', duration: 15 }] 
    },
    { 
      date: getDateString(3), 
      steps: 7800, 
      activeMinutes: 35, 
      workouts: [{ type: 'Cycling', duration: 25 }] 
    },
    { 
      date: getDateString(2), 
      steps: 3500, 
      activeMinutes: 15, 
      workouts: [] 
    },
    { 
      date: getDateString(1), 
      steps: 9200, 
      activeMinutes: 50, 
      workouts: [{ type: 'Swimming', duration: 40 }] 
    },
    { 
      date: getDateString(0), 
      steps: 6700, 
      activeMinutes: 30, 
      workouts: [{ type: 'Strength Training', duration: 25 }] 
    },
  ];
  
  // Journal entries
  export const journalEntries: JournalEntry[] = [
    {
      id: '1',
      date: getDateString(0),
      content: "Today was a good day overall. I managed to drink enough water and got a good workout in. Feeling positive about my progress.",
      tags: ['workout', 'hydration', 'positive'],
      mood: 'good'
    },
    {
      id: '2',
      date: getDateString(1),
      content: "Feeling a bit tired today. Didn't sleep well last night. Need to focus on better sleep hygiene.",
      tags: ['tired', 'sleep'],
      mood: 'neutral'
    },
    {
      id: '3',
      date: getDateString(2),
      content: "Stressful day at work. Missed my workout and didn't drink enough water. Tomorrow will be better.",
      tags: ['stress', 'work'],
      mood: 'bad'
    },
    {
      id: '4',
      date: getDateString(3),
      content: "Great progress on my fitness goals today! Completed a full workout and ate healthy meals.",
      tags: ['workout', 'nutrition', 'progress'],
      mood: 'great'
    },
    {
      id: '5',
      date: getDateString(4),
      content: "Amazing day outdoors. Went hiking with friends and enjoyed the fresh air. Feeling energized!",
      tags: ['outdoors', 'friends', 'active'],
      mood: 'great'
    },
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
      category: 'fitness',
      title: 'Do 20 jumping jacks',
      description: 'A quick exercise to get your heart rate up',
      difficulty: 'easy'
    },
    {
      id: '2',
      category: 'mental',
      title: 'Meditate for 5 minutes',
      description: 'Take a moment to clear your mind and focus on your breathing',
      difficulty: 'easy'
    },
    {
      id: '3',
      category: 'nutrition',
      title: 'Drink a glass of water',
      description: "Hydration is important! Let's have a glass of water right now",
      difficulty: 'easy'
    },
    {
      id: '4',
      category: 'sleep',
      title: 'No screens 30 minutes before bed',
      description: 'Improve your sleep quality by avoiding blue light before bedtime',
      difficulty: 'medium'
    },
    {
      id: '5',
      category: 'fitness',
      title: 'Take a 15-minute walk',
      description: 'Get some fresh air and move your body with a short walk',
      difficulty: 'medium'
    },
    {
      id: '6',
      category: 'mental',
      title: 'Write down 3 things you are grateful for',
      description: 'Practicing gratitude can improve your mental wellbeing',
      difficulty: 'easy'
    },
    {
      id: '7',
      category: 'nutrition',
      title: 'Eat a fruit or vegetable with your next meal',
      description: 'Add some nutrients to your diet with a healthy addition',
      difficulty: 'easy'
    },
    {
      id: '8',
      category: 'fitness',
      title: 'Do 10 push-ups',
      description: 'Build upper body strength with this classic exercise',
      difficulty: 'medium'
    },
    {
      id: '9',
      category: 'mental',
      title: 'Take a digital detox for 1 hour',
      description: 'Step away from all screens and do something offline',
      difficulty: 'medium'
    },
    {
      id: '10',
      category: 'sleep',
      title: 'Go to bed 30 minutes earlier tonight',
      description: 'Get some extra rest by turning in a bit earlier',
      difficulty: 'medium'
    },
    {
      id: '11',
      category: 'nutrition',
      title: 'No added sugar for the rest of the day',
      description: 'Cut out added sugars from your diet temporarily',
      difficulty: 'hard'
    },
    {
      id: '12',
      category: 'fitness',
      title: 'Hold a plank for 1 minute',
      description: 'Challenge your core strength with this exercise',
      difficulty: 'hard'
    },
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
    joinedAt: '2023-01-15'
  };
  
  // Leaderboard data
  export const leaderboardData: LeaderboardEntry[] = [
    {
      userId: '2',
      name: 'Sarah Miller',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      score: 8750,
      rank: 1,
      streak: 12,
      level: 9
    },
    {
      userId: '3',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      score: 7900,
      rank: 2,
      streak: 8,
      level: 8
    },
    {
      userId: '1', // Current user
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      score: 7200,
      rank: 3,
      streak: 5,
      level: 7
    },
    {
      userId: '4',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      score: 6800,
      rank: 4,
      streak: 3,
      level: 6
    },
    {
      userId: '5',
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      score: 6200,
      rank: 5,
      streak: 4,
      level: 6
    },
    {
      userId: '6',
      name: 'Olivia Garcia',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      score: 5900,
      rank: 6,
      streak: 2,
      level: 5
    },
    {
      userId: '7',
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      score: 5500,
      rank: 7,
      streak: 1,
      level: 5
    },
  ];