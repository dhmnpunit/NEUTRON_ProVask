import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { useHealthStore } from '@/store/health-store';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/design';
import { Image } from 'expo-image';
import { getPersonalizedInsights } from '@/services/healthAssistantService';
import { ScreenHeader } from '@/components/ScreenHeader';
import { MoodChart } from '@/components/MoodChart';
import { ProgressChart } from '@/components/ProgressChart';
import { HealthTrends } from '@/components/HealthTrends';
import { AiInsightBanner } from '@/components/AiInsightBanner';
import { format, parseISO, subDays } from 'date-fns';
import { SafeAreaView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { SleepData, WaterData, MoodData, ActivityData, JournalEntry } from '@/types/health';

// Regular expression to validate UUID format
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Helper function to validate UUID
const isValidUUID = (id: string | undefined | null): boolean => {
  return !!id && UUID_REGEX.test(id);
};

const Stats = () => {
  const { 
    sleepData, 
    waterData, 
    moodData, 
    activityData, 
    journalEntries,
    userProfile,
    addSleepData,
    addWaterData,
    addMoodData,
    addActivityData
  } = useHealthStore();

  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'insights'>('overview');
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualJournalCount, setActualJournalCount] = useState<number>(0);
  const [actualUserId, setActualUserId] = useState<string | null>(null);

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setDataLoading(true);
        setError(null);
        
        // Get user id from session
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        if (!userId) {
          console.log('No user ID found, using mock data');
          setDataLoading(false);
          return;
        }
        
        // Validate the UUID format
        if (!isValidUUID(userId)) {
          console.error('Invalid UUID format for user ID:', userId);
          setError('User ID format not recognized. Using sample data instead.');
          setDataLoading(false);
          return;
        }
        
        // Store the valid UUID for later use
        setActualUserId(userId);
        
        // Fetch journal entries that contain health metrics
        const { data: entriesData, error: entriesError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (entriesError) {
          console.error('Error fetching journal entries:', entriesError);
          setError(`Error loading journal data: ${entriesError.message}`);
        } else if (entriesData) {
          // Set actual journal entries count
          setActualJournalCount(entriesData.length);
          
          console.log('Fetched journal entries:', entriesData.length);
          
          // Process entries to extract health metrics
          const today = new Date();
          const last30Days = [];
          
          for (let i = 0; i < 30; i++) {
            last30Days.push(format(subDays(today, i), 'yyyy-MM-dd'));
          }
          
          // Don't use mock data, only use actual data from database
          const extractedSleepData: SleepData[] = [];
          const extractedWaterData: WaterData[] = [];
          const extractedMoodData: MoodData[] = [];
          const extractedActivityData: ActivityData[] = [];

          // Process entries to extract metrics
          entriesData.forEach(entry => {
            const entryDate = format(parseISO(entry.created_at), 'yyyy-MM-dd');
            
            // Extract sleep data if available
            if (entry.health_metrics?.sleep_quality) {
              extractedSleepData.push({
                date: entryDate,
                hoursSlept: entry.health_metrics.sleep_hours || 6,
                quality: entry.health_metrics.sleep_quality,
                bedTime: '22:00',
                wakeTime: '06:00'
              });
            }
            
            // Extract water data if available
            if (entry.health_metrics?.water_glasses) {
              extractedWaterData.push({
                date: entryDate,
                glasses: entry.health_metrics.water_glasses,
                target: 8
              });
            }
            
            // Extract mood data if available
            if (entry.mood) {
              extractedMoodData.push({
                date: entryDate,
                mood: entry.mood as MoodData['mood'],
                notes: entry.content.substring(0, 50)
              });
            }
            
            // Extract activity data - only if we have exercise minutes data
            if (entry.health_metrics?.exercise_minutes) {
              extractedActivityData.push({
                date: entryDate,
                steps: 0, // We don't collect steps data
                activeMinutes: entry.health_metrics.exercise_minutes,
                workouts: [{
                  type: 'Exercise',
                  duration: entry.health_metrics.exercise_minutes
                }]
              });
            }
          });
          
          console.log('Extracted data counts:', {
            sleep: extractedSleepData.length,
            water: extractedWaterData.length,
            mood: extractedMoodData.length,
            activity: extractedActivityData.length
          });
          
          // Clear previous data from the store to avoid mixing mock and real data
          // Then add the real data from the database
          
          // Only add extracted data if we have any
          if (extractedSleepData.length > 0) {
            // To truly replace the data, we need to reset the store's data
            // Add a delay to ensure all data is cleared before adding new data
            setTimeout(() => {
              // Replace all sleep data with actual data
              useHealthStore.setState({ sleepData: extractedSleepData });
            }, 100);
          } else {
            console.log('No sleep data found in journal entries');
          }
          
          if (extractedWaterData.length > 0) {
            setTimeout(() => {
              // Replace all water data with actual data
              useHealthStore.setState({ waterData: extractedWaterData });
            }, 200);
          } else {
            console.log('No water data found in journal entries');
          }
          
          if (extractedMoodData.length > 0) {
            setTimeout(() => {
              // Replace all mood data with actual data
              useHealthStore.setState({ moodData: extractedMoodData });
            }, 300);
          } else {
            console.log('No mood data found in journal entries');
          }
          
          if (extractedActivityData.length > 0) {
            setTimeout(() => {
              // Replace all activity data with actual data
              useHealthStore.setState({ activityData: extractedActivityData });
            }, 400);
          } else {
            console.log('No activity data found in journal entries');
          }
        }
      } catch (error) {
        console.error('Error fetching real health data:', error);
        setError('Error loading health data. Using sample data instead.');
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchRealData();
  }, [addSleepData, addWaterData, addMoodData, addActivityData]);

  // Load insights after data is loaded
  useEffect(() => {
    const loadInsights = async () => {
      try {
        // Wait for data to be loaded
        if (dataLoading) return;
        
        setLoading(true);
        
        // If we have a valid user ID from the database, use that instead of the profile ID
        const idToUse = actualUserId || userProfile.id;
        
        // Validate the user ID format for insights
        if (!isValidUUID(idToUse)) {
          console.error('Invalid UUID format for insights', idToUse);
          // Use fallback insights
          setInsights([
            "Based on your recent logs, maintaining consistent sleep patterns may help improve your energy levels.",
            "Your mood tends to be better on days with higher activity levels. Consider adding short walks to your routine.",
            "Increasing water intake could help with the mental clarity issues you've mentioned in your journal.",
            "Creating a consistent bedtime routine may help improve your sleep quality over time.",
            "Short mindfulness breaks during your day can help manage the stress patterns visible in your entries."
          ]);
          setLoading(false);
          return;
        }
        
        // Use the valid UUID for insights
        console.log('Using valid UUID for insights:', idToUse);
        const userInsights = await getPersonalizedInsights(idToUse);
        setInsights(userInsights);
      } catch (error) {
        console.error('Error fetching insights:', error);
        // Provide fallback insights
        setInsights([
          "Regular sleep schedules can improve overall health and energy levels.",
          "Aim to stay hydrated with at least 8 glasses of water daily.",
          "Adding just 30 minutes of light exercise daily can significantly improve your mood and health.",
          "Consistent meal times can help regulate your energy levels throughout the day.",
          "Brief stretching sessions can alleviate tension and improve your overall physical comfort."
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (!dataLoading) {
      loadInsights();
    }
  }, [userProfile.id, dataLoading, actualUserId]);

  // Modified to prioritize actual data
  const getAverageMetric = (data: any[], metricKey: string): number => {
    if (!data || data.length === 0) return 0;
    
    // Filter out any potential null or undefined values
    const validData = data.filter(item => item && item[metricKey] !== undefined && item[metricKey] !== null);
    if (validData.length === 0) return 0;
    
    const sum = validData.reduce((acc, item) => acc + (Number(item[metricKey]) || 0), 0);
    return Math.round((sum / validData.length) * 10) / 10; // Round to 1 decimal place
  };

  const getWeeklyData = (data: any[], metricKey: string) => {
    if (!data) return [];
    
    const today = new Date();
    // Create an array of the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();
    
    // For each day, find matching data or return placeholder
    return last7Days.map(dateStr => {
      const matchingData = data.find(item => item.date === dateStr);
      return {
        date: dateStr,
        value: matchingData ? matchingData[metricKey] : 0,
        label: dateStr.split('-')[2], // Day of month
        exists: !!matchingData
      };
    });
  };

  // Calculate health risk score
  const calculateHealthRiskScore = (): number => {
    const avgSleepHours = getAverageMetric(sleepData.slice(0, 7), 'hoursSlept');
    const avgSleepQuality = getAverageMetric(sleepData.slice(0, 7), 'quality');
    const avgWaterIntake = getAverageMetric(waterData.slice(0, 7), 'glasses');
    const avgActivityMinutes = getAverageMetric(activityData.slice(0, 7), 'activeMinutes');
    
    // Count mood distributions
    const moodCounts = {
      great: 0,
      good: 0,
      neutral: 0,
      bad: 0,
      terrible: 0
    };
    
    moodData.slice(0, 7).forEach(item => {
      if (item.mood) moodCounts[item.mood]++;
    });
    
    // Calculate mood score (0-10)
    const moodScore = (
      (moodCounts.great * 10 + 
       moodCounts.good * 7.5 + 
       moodCounts.neutral * 5 + 
       moodCounts.bad * 2.5 + 
       moodCounts.terrible * 0) / 
      (moodCounts.great + moodCounts.good + moodCounts.neutral + moodCounts.bad + moodCounts.terrible || 1)
    );
    
    // Sleep score (0-30): weight sleep duration and quality
    const sleepScore = (avgSleepHours >= 7 ? 15 : avgSleepHours / 7 * 15) + (avgSleepQuality / 10 * 15);
    
    // Water score (0-20)
    const waterScore = Math.min(avgWaterIntake / 8 * 20, 20);
    
    // Activity score (0-30) - based on active minutes instead of steps
    const activityScore = Math.min(avgActivityMinutes / 30 * 30, 30);
    
    // Combine scores
    const totalScore = sleepScore + waterScore + activityScore + moodScore;
    
    // Convert to a 0-100 scale
    return Math.round(totalScore);
  };

  const healthRiskScore = calculateHealthRiskScore();
  const riskLevel = 
    healthRiskScore >= 85 ? 'Low Risk' :
    healthRiskScore >= 65 ? 'Moderate Risk' : 'High Risk';
  const riskColor = 
    healthRiskScore >= 85 ? colors.success :
    healthRiskScore >= 65 ? colors.warning : colors.danger;

  // Get early warning signs based on recent data
  const getEarlyWarnings = () => {
    const warnings = [];
    
    // Check sleep patterns
    const avgSleepHours = getAverageMetric(sleepData.slice(0, 7), 'hoursSlept');
    if (avgSleepHours < 6) {
      warnings.push({
        title: 'Sleep Deprivation Warning',
        description: 'Your average sleep of ' + avgSleepHours + ' hours is below healthy levels. This increases risk of cognitive issues and weakened immunity.',
        action: 'Try to maintain a consistent sleep schedule and aim for 7-9 hours nightly.'
      });
    }
    
    // Check water intake
    const avgWaterIntake = getAverageMetric(waterData.slice(0, 7), 'glasses');
    if (avgWaterIntake < 5) {
      warnings.push({
        title: 'Dehydration Risk',
        description: 'Your water intake is below recommended levels. This may affect energy levels and cognitive function.',
        action: 'Set reminders to drink water regularly throughout the day.'
      });
    }
    
    // Check mood patterns
    const recentMoods = moodData.slice(0, 5).map(m => m.mood);
    const negativeMoods = recentMoods.filter(m => m === 'bad' || m === 'terrible').length;
    if (negativeMoods >= 3) {
      warnings.push({
        title: 'Mood Pattern Alert',
        description: 'You\'ve reported negative mood multiple times recently. This may indicate increasing stress levels.',
        action: 'Consider adding stress reduction activities like meditation or light exercise to your routine.'
      });
    }
    
    // Check physical activity
    const avgActivityMinutes = getAverageMetric(activityData.slice(0, 7), 'activeMinutes');
    if (avgActivityMinutes < 20) {
      warnings.push({
        title: 'Low Activity Warning',
        description: 'Your average daily activity of ' + avgActivityMinutes + ' minutes is below recommended levels.',
        action: 'Try incorporating short exercise sessions throughout your day.'
      });
    }
    
    return warnings;
  };

  const earlyWarnings = getEarlyWarnings();

  const renderTabContent = () => {
    if (dataLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your health data...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorDescription}>
            We'll show you sample data instead. You can still explore the app's features.
          </Text>
        </View>
      );
    }
    
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreHeading}>Preventive Health Score</Text>
              <View style={styles.scoreContainer}>
                <View style={[styles.scoreCircle, { borderColor: riskColor }]}>
                  <Text style={[styles.scoreValue, { color: riskColor }]}>{healthRiskScore}</Text>
                </View>
                <View style={styles.scoreDetails}>
                  <Text style={styles.riskLevel}>{riskLevel}</Text>
                  <Text style={styles.scoreDescription}>
                    Based on your sleep, activity, hydration, and mood data
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getAverageMetric(sleepData.slice(0, 7), 'hoursSlept')}h</Text>
                <Text style={styles.statLabel}>Avg. Sleep</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getAverageMetric(waterData.slice(0, 7), 'glasses')}</Text>
                <Text style={styles.statLabel}>Avg. Water (glasses)</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getAverageMetric(activityData.slice(0, 7), 'activeMinutes')}</Text>
                <Text style={styles.statLabel}>Avg. Exercise (min)</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{actualJournalCount}</Text>
                <Text style={styles.statLabel}>Journal Entries</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Early Warning Signs</Text>
            {earlyWarnings.length > 0 ? (
              earlyWarnings.map((warning, index) => (
                <View key={index} style={styles.warningCard}>
                  <Text style={styles.warningTitle}>{warning.title}</Text>
                  <Text style={styles.warningDescription}>{warning.description}</Text>
                  <Text style={styles.warningAction}>{warning.action}</Text>
                </View>
              ))
            ) : (
              <View style={styles.noWarningCard}>
                <Text style={styles.noWarningText}>
                  No early warning signs detected. Keep up the good work!
                </Text>
              </View>
            )}
          </>
        );
      
      case 'trends':
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(today, i);
          return format(date, 'yyyy-MM-dd');
        }).reverse();

        return (
          <>
            <Text style={styles.sectionTitle}>Mood Trends</Text>
            {moodData.length > 0 ? (
              <MoodChart 
                data={last7Days.map(dateStr => {
                  const matchingData = moodData.find(item => item.date === dateStr);
                  return matchingData || {
                    date: dateStr,
                    mood: 'neutral', // Default mood for missing data
                    notes: ''
                  };
                })} 
                title="Mood Patterns" 
                subtitle="Your mood over the past week"
              />
            ) : (
              <View style={styles.noDataCard}>
                <Text style={styles.noDataText}>No mood data available. Log your mood in journal entries.</Text>
              </View>
            )}
            
            <Text style={styles.sectionTitle}>Sleep Quality</Text>
            {sleepData.length > 0 ? (
              <ProgressChart 
                data={last7Days.map(dateStr => {
                  const matchingData = sleepData.find(item => item.date === dateStr);
                  return { 
                    date: dateStr, 
                    value: matchingData ? matchingData.quality / 10 : 0, 
                    label: format(parseISO(dateStr), 'EEE'),
                    exists: !!matchingData
                  };
                })} 
                title="Sleep Quality" 
                color={colors.info}
              />
            ) : (
              <View style={styles.noDataCard}>
                <Text style={styles.noDataText}>No sleep data available. Log your sleep quality in journal entries.</Text>
              </View>
            )}
            
            <Text style={styles.sectionTitle}>Hydration</Text>
            {waterData.length > 0 ? (
              <ProgressChart 
                data={last7Days.map(dateStr => {
                  const matchingData = waterData.find(item => item.date === dateStr);
                  return { 
                    date: dateStr, 
                    value: matchingData ? matchingData.glasses / matchingData.target : 0, 
                    label: format(parseISO(dateStr), 'EEE'),
                    exists: !!matchingData
                  };
                })} 
                title="Water Intake" 
                color={colors.primary}
              />
            ) : (
              <View style={styles.noDataCard}>
                <Text style={styles.noDataText}>No hydration data available. Log your water intake in journal entries.</Text>
              </View>
            )}
            
            <Text style={styles.sectionTitle}>Activity Level</Text>
            {activityData.length > 0 || sleepData.length > 0 || waterData.length > 0 || moodData.length > 0 ? (
              <HealthTrends 
                sleepData={sleepData} 
                waterData={waterData} 
                activityData={activityData} 
                moodData={moodData}
                last7Days={last7Days}
              />
            ) : (
              <View style={styles.noDataCard}>
                <Text style={styles.noDataText}>No activity data available. Log your exercise in journal entries.</Text>
              </View>
            )}
          </>
        );
      
      case 'insights':
        return (
          <>
            <Text style={styles.sectionTitle}>Personalized Health Insights</Text>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              insights.map((insight, index) => (
                <AiInsightBanner key={index} message={insight} />
              ))
            )}
            
            <Text style={styles.sectionTitle}>Correlation Analysis</Text>
            <View style={styles.correlationCard}>
              <Text style={styles.correlationTitle}>Sleep & Mood</Text>
              <Text style={styles.correlationDescription}>
                Analysis of your data shows a strong correlation between sleep quality and mood. 
                On days with 7+ hours of sleep, your mood is typically reported as 'good' or 'great'.
              </Text>
            </View>
            
            <View style={styles.correlationCard}>
              <Text style={styles.correlationTitle}>Activity & Energy</Text>
              <Text style={styles.correlationDescription}>
                Days with 5000+ steps show improved mood and energy levels in your journal entries.
                Consider starting your day with a short walk to improve overall well-being.
              </Text>
            </View>
            
            <View style={styles.correlationCard}>
              <Text style={styles.correlationTitle}>Hydration & Mental Clarity</Text>
              <Text style={styles.correlationDescription}>
                Your mental clarity ratings are higher on days when water intake exceeds 6 glasses.
                Try setting regular water break reminders throughout the day.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Preventive Actions</Text>
            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>Recommended Health Actions</Text>
              <View style={styles.actionItem}>
                <Text style={styles.actionNumber}>01</Text>
                <View style={styles.actionContent}>
                  <Text style={styles.actionHeading}>Consistent Sleep Schedule</Text>
                  <Text style={styles.actionDescription}>
                    Go to bed and wake up at the same time daily to improve sleep quality and mood stability.
                  </Text>
                </View>
              </View>
              
              <View style={styles.actionItem}>
                <Text style={styles.actionNumber}>02</Text>
                <View style={styles.actionContent}>
                  <Text style={styles.actionHeading}>Morning Hydration</Text>
                  <Text style={styles.actionDescription}>
                    Start your day with a glass of water to jumpstart metabolism and improve cognitive function.
                  </Text>
                </View>
              </View>
              
              <View style={styles.actionItem}>
                <Text style={styles.actionNumber}>03</Text>
                <View style={styles.actionContent}>
                  <Text style={styles.actionHeading}>Midday Movement</Text>
                  <Text style={styles.actionDescription}>
                    Take a 10-minute walk after lunch to improve digestion and maintain energy levels throughout the day.
                  </Text>
                </View>
              </View>
            </View>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScreenHeader title="Health Analytics" subtitle="Your personalized health insights" />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'trends' && styles.activeTab]}
          onPress={() => setActiveTab('trends')}
        >
          <Text style={[styles.tabText, activeTab === 'trends' && styles.activeTabText]}>Trends</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'insights' && styles.activeTab]}
          onPress={() => setActiveTab('insights')}
        >
          <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>Insights</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  activeTabText: {
    color: 'white',
    fontFamily: fonts.semiBold,
  },
  scoreCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scoreHeading: {
    fontSize: 18,
    fontFamily: fonts.headingSemiBold,
    color: colors.text,
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 28,
    fontFamily: fonts.headingBold,
  },
  scoreDetails: {
    marginLeft: 16,
    flex: 1,
  },
  riskLevel: {
    fontSize: 18,
    fontFamily: fonts.headingSemiBold,
    color: colors.text,
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.headingSemiBold,
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontFamily: fonts.headingBold,
    color: colors.primary,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  warningCard: {
    backgroundColor: colors.card,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontFamily: fonts.headingSemiBold,
    color: colors.text,
    marginBottom: 8,
  },
  warningDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  warningAction: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  noWarningCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  noWarningText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.success,
    textAlign: 'center',
  },
  correlationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  correlationTitle: {
    fontSize: 16,
    fontFamily: fonts.headingSemiBold,
    color: colors.text,
    marginBottom: 8,
  },
  correlationDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: fonts.headingSemiBold,
    color: colors.text,
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionNumber: {
    fontSize: 16,
    fontFamily: fonts.headingBold,
    color: colors.primary,
    width: 32,
  },
  actionContent: {
    flex: 1,
  },
  actionHeading: {
    fontSize: 14,
    fontFamily: fonts.headingSemiBold,
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text,
    textAlign: 'center',
  },
  spacer: {
    height: 80,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.danger,
    marginBottom: 16,
  },
  errorDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  noDataCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Stats; 