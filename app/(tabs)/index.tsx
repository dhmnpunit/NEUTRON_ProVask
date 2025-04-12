import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import { colors } from '@/constants/colors';
import { useHealthStore } from '@/store/health-store';
import { StreakCard } from '@/components/StreakCard';
import { MoodChart } from '@/components/MoodChart';
import { ActionButton } from '@/components/ActionButton';
import { LogCard } from '@/components/LogCard';
import { 
  Plus, 
  Settings,
  Moon,
  Smile,
  ChevronRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';

export default function DashboardScreen() {
  const router = useRouter();
  const { 
    sleepData, 
    waterData, 
    moodData, 
    activityData,
    userProfile,
    journalEntries
  } = useHealthStore();
  
  // Get the latest data
  const latestSleep = sleepData[0];
  const latestWater = waterData[0];
  const latestMood = moodData[0];
  const latestActivity = activityData[0];
  
  // Get mood emoji
  const getMoodEmoji = (mood: string): string => {
    switch (mood) {
      case 'great': return '😄';
      case 'good': return '🙂';
      case 'neutral': return '😐';
      case 'bad': return '🙁';
      case 'terrible': return '😫';
      default: return '😐';
    }
  };
  
  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' }}
            style={styles.avatar}
          />
          <Text style={styles.headerTitle}>your health</Text>
        </View>
        <TouchableOpacity>
          <Settings size={24} color={colors.text} />
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
            icon={<Plus size={18} color="#FFFFFF" />}
            onPress={() => router.push('/logs/add')}
            primary
            fullWidth
          />
        </View>
        
        <MoodChart
          data={moodData}
          title="7 day mood trends"
          subtitle="How your health choices made you feel"
        />
        
        <View style={styles.recentLogsHeader}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/logs')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {journalEntries.slice(0, 2).map((entry) => (
          <LogCard
            key={entry.id}
            title={entry.date}
            feeling={entry.mood}
            feelingEmoji={getMoodEmoji(entry.mood || 'neutral')}
            notes={entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '')}
            onPress={() => router.push({
              pathname: '/logs/[id]',
              params: { id: entry.id }
            })}
          />
        ))}
        
        <View style={styles.recommendationsContainer}>
          <View style={styles.recommendationHeader}>
            <Text style={styles.recommendationTitle}>recommended for you</Text>
          </View>
          
          <TouchableOpacity style={styles.recommendationItem}>
            <View style={styles.recommendationContent}>
              <Moon size={20} color={colors.sleep} style={styles.recommendationIcon} />
              <View>
                <Text style={styles.recommendationText}>Go to bed 30 minutes earlier tonight</Text>
                <Text style={styles.recommendationSubtext}>Improve your sleep quality</Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  recentLogsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
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