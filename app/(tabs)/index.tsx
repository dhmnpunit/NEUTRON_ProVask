import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
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
import { HealthAssistantButton } from '@/components/HealthAssistantButton';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    sleepData, 
    waterData, 
    moodData, 
    activityData,
    userProfile,
  } = useHealthStore();
  
  // Get the latest data
  const latestSleep = sleepData[0];
  const latestWater = waterData[0];
  const latestMood = moodData[0];
  const latestActivity = activityData[0];
  
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
        
        <HealthTrends entries={[]} />
        
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
      
      <HealthAssistantButton showLabel size="medium" />
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