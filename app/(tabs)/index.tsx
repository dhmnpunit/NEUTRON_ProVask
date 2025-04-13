import React, { useState, useEffect } from 'react';
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
import { useHealthStore } from '@/store/health-store';
import { StreakCard } from '@/components/StreakCard';
import { HealthTrends } from '@/components/HealthTrends';
import { ActionButton } from '@/components/ActionButton';
import { 
  PlusIcon, 
  Cog6ToothIcon,
  MoonIcon,
  ChevronRightIcon
} from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { getJournalEntries } from '@/services/journalService';
import { JournalEntry, SleepData, WaterData, MoodData, ActivityData } from '@/types/health';
import { format, parseISO } from 'date-fns';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { userProfile } = useHealthStore();
  
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Derived state from journal entries
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [waterData, setWaterData] = useState<WaterData[]>([]);
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  
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
      >
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
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Loading health data...</Text>
          </View>
        ) : (
          <HealthTrends 
            sleepData={sleepData}
            waterData={waterData}
            moodData={moodData}
            activityData={activityData}
          />
        )}
        
        <View style={styles.recommendationsContainer}>
          <View style={styles.recommendationHeader}>
            <Text style={styles.recommendationTitle}>recommended for you</Text>
          </View>
          
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
          
          <TouchableOpacity style={styles.recommendationItem}>
            <View style={styles.recommendationContent}>
              <MoonIcon size={20} color={colors.sleep} style={styles.recommendationIcon} />
              <View>
                <Text style={styles.recommendationText}>Go to bed 30 minutes earlier tonight</Text>
                <Text style={styles.recommendationSubtext}>Improve your sleep quality</Text>
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
  loadingContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  recommendationsContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  recommendationHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
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
});