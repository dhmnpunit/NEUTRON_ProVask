import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/design';
import { useHealthStore } from '@/store/health-store';
import { StreakCard } from '@/components/StreakCard';
import { HealthTrends } from '@/components/HealthTrends';
import { ActionButton } from '@/components/ActionButton';
import { 
  PlusIcon, 
  Cog6ToothIcon,
  MoonIcon,
  ChevronRightIcon,
  CheckIcon
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { getJournalEntries } from '@/services/journalService';
import { JournalEntry, SleepData, WaterData, MoodData, ActivityData } from '@/types/health';
import { format, parseISO } from 'date-fns';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { userProfile, tasks, completeTask } = useHealthStore();
  
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  
  // Derived state from journal entries
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [waterData, setWaterData] = useState<WaterData[]>([]);
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  
  // Get active tasks
  const activeTasks = useMemo(() => {
    return tasks.filter(task => !task.completed);
  }, [tasks]);
  
  // Task completion handler
  const handleCompleteTask = (taskId: string) => {
    setCompletingTaskId(taskId);
    // Add slight delay for animation effect
    setTimeout(() => {
      completeTask(taskId);
      setCompletingTaskId(null);
    }, 500);
  };
  
  // Render right actions for swipeable
  const renderRightActions = (taskId: string) => {
    return (
      <TouchableOpacity 
        style={styles.swipeActionContainer}
        onPress={() => handleCompleteTask(taskId)}
      >
        <CheckIcon size={24} color="#FFFFFF" />
        <Text style={styles.swipeActionText}>Complete</Text>
      </TouchableOpacity>
    );
  };
  
  // Truncate description to a certain length
  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Format date consistently for all health data
  const formatEntryDate = (dateString: string): string => {
    // Parse the ISO date string
    const date = parseISO(dateString);
    // Format as YYYY-MM-DD to match what's expected by HealthTrends
    return format(date, 'yyyy-MM-dd');
  };
  
  // Fetch journal entries when component mounts
  useEffect(() => {
    async function fetchJournalData() {
      if (!user) return;
      
      try {
        setLoading(true);
        const entries = await getJournalEntries(user.id);
        setJournalEntries(entries);
        
        // Process entries to extract health data
        const extractedSleepData: SleepData[] = [];
        const extractedWaterData: WaterData[] = [];
        const extractedMoodData: MoodData[] = [];
        const extractedActivityData: ActivityData[] = [];
        
        entries.forEach(entry => {
          // Use consistent date formatting
          const date = formatEntryDate(entry.created_at);
          
          // Extract sleep data if available
          if (entry.health_metrics.sleep_quality) {
            extractedSleepData.push({
              date,
              hoursSlept: 8, // This is a placeholder since we don't have actual hours slept
              quality: entry.health_metrics.sleep_quality,
              bedTime: '22:00', // Placeholder
              wakeTime: '06:00', // Placeholder
            });
          }
          
          // Extract water data if available
          if (entry.health_metrics.water_glasses) {
            extractedWaterData.push({
              date,
              glasses: entry.health_metrics.water_glasses,
              target: 8, // Default target
            });
          }
          
          // Extract mood data if available
          if (entry.mood) {
            extractedMoodData.push({
              date,
              mood: entry.mood,
              notes: entry.content,
            });
          }
          
          // Extract activity data if available
          if (entry.health_metrics.exercise_minutes) {
            extractedActivityData.push({
              date,
              steps: 6000, // Placeholder since we don't have actual steps
              activeMinutes: entry.health_metrics.exercise_minutes,
              workouts: [],
            });
          }
        });
        
        // Update state with extracted data
        setSleepData(extractedSleepData);
        setWaterData(extractedWaterData);
        setMoodData(extractedMoodData);
        setActivityData(extractedActivityData);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchJournalData();
  }, [user]);
  
  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image 
              source={{ 
                uri: user?.user_metadata?.avatar_url || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.name || 'User')}&background=random`
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{user?.user_metadata?.name || 'your health'}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Cog6ToothIcon size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.mainSection}>
          <StreakCard 
            streak={userProfile.streak} 
            description="days with good health habits"
          />
          
          <View style={styles.logButtonContainer}>
            <ActionButton
              title="Log Today's Health"
              icon={<PlusIcon size={18} color="#FFFFFF" />}
              onPress={() => router.push('/logs/add')}
              primary
              fullWidth
            />
          </View>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Loading health data...</Text>
          </View>
        ) : (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Health Trends</Text>
            <HealthTrends 
              sleepData={sleepData}
              waterData={waterData}
              moodData={moodData}
              activityData={activityData}
            />
          </View>
        )}
        
        {activeTasks.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            
            <GestureHandlerRootView>
              {activeTasks.map(task => (
                <Swipeable
                  key={task.id}
                  renderRightActions={() => renderRightActions(task.id)}
                  overshootRight={false}
                >
                  <View style={styles.taskItem}>
                    <TouchableOpacity 
                      style={styles.taskCheckCircle}
                      onPress={() => handleCompleteTask(task.id)}
                    >
                      {completingTaskId === task.id ? (
                        <CheckCircleIcon size={22} color={colors.primary} />
                      ) : (
                        <View style={styles.emptyCheckCircle} />
                      )}
                    </TouchableOpacity>
                    
                    <View style={styles.taskTextContent}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <Text style={styles.taskDescription} numberOfLines={1}>
                        {truncateDescription(task.description, 60)}
                      </Text>
                    </View>
                    
                    <View style={styles.taskReward}>
                      <Text style={styles.taskRewardText}>+{task.coins}</Text>
                    </View>
                  </View>
                </Swipeable>
              ))}
            </GestureHandlerRootView>
          </View>
        )}
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          
          <TouchableOpacity 
            style={styles.recommendationItem}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <View style={styles.recommendationContent}>
              <MoonIcon size={20} color={colors.sleep} style={styles.recommendationIcon} />
              <View>
                <Text style={styles.recommendationText}>Get personalized health advice</Text>
                <Text style={styles.recommendationSubtext}>Chat with your health assistant</Text>
              </View>
            </View>
            <ChevronRightIcon size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.recommendationItem}
            onPress={() => router.push('/(tabs)/flip-dice')}  
          >
            <View style={styles.recommendationContent}>
              <MoonIcon size={20} color={colors.sleep} style={styles.recommendationIcon} />
              <View>
                <Text style={styles.recommendationText}>Try a new health challenge</Text>
                <Text style={styles.recommendationSubtext}>Flip the dice for random activities</Text>
              </View>
            </View>
            <ChevronRightIcon size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  logButtonContainer: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  mainSection: {
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: fonts.headingSemiBold,
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  recommendationsContainer: {
    marginBottom: 24,
  },
  recommendationHeader: {
    marginBottom: 16,
  },
  recommendationTitle: {
    fontFamily: fonts.headingSemiBold,
    fontSize: 18,
    color: colors.text,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recommendationIcon: {
    marginRight: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  recommendationSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  todayTasksContainer: {
    marginBottom: 24,
  },
  taskItem: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  taskCheckCircle: {
    marginRight: 12,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  taskTextContent: {
    flex: 1,
    paddingRight: 8,
  },
  taskTitle: {
    fontFamily: fonts.headingSemiBold,
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  taskDescription: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  taskReward: {
    backgroundColor: colors.primary + '15', // 15% opacity
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  taskRewardText: {
    fontFamily: fonts.headingSemiBold,
    fontSize: 12,
    color: colors.primary,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: fonts.regular,
    marginTop: 12,
    color: colors.textSecondary,
  },
  swipeActionContainer: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 10,
    flexDirection: 'column',
  },
  swipeActionText: {
    color: '#FFFFFF',
    fontFamily: fonts.medium,
    fontSize: 12,
    marginTop: 4,
  },
});

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'sleep': return colors.sleep || '#6C63FF';
    case 'hydration': return colors.water || '#63C0FF';
    case 'activity': return colors.activity || '#FF6363';
    case 'nutrition': return colors.nutrition || '#63FF7C';
    case 'mental': return colors.mood || '#FFD763';
    default: return colors.primary;
  }
};