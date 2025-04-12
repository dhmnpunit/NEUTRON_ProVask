import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Image
} from 'react-native';
import { colors } from '@/constants/colors';
import { leaderboardData } from '@/mocks/health-data';
import { useHealthStore } from '@/store/health-store';
import { LeaderboardItem } from '@/components/LeaderboardItem';
import { AchievementCard } from '@/components/AchievementCard';
import { Trophy, Users, Award, ChevronRight } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/ScreenWrapper';

type LeaderboardTab = 'global' | 'friends' | 'achievements';

export default function LeaderboardScreen() {
  const { userProfile, achievements } = useHealthStore();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('global');
  
  return (
    <ScreenWrapper>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'global' ? styles.activeTab : {}
          ]}
          onPress={() => setActiveTab('global')}
        >
          <Trophy 
            size={16} 
            color={activeTab === 'global' ? colors.primary : colors.textSecondary} 
            style={styles.tabIcon}
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'global' ? styles.activeTabText : {}
            ]}
          >
            Global
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'friends' ? styles.activeTab : {}
          ]}
          onPress={() => setActiveTab('friends')}
        >
          <Users 
            size={16} 
            color={activeTab === 'friends' ? colors.primary : colors.textSecondary} 
            style={styles.tabIcon}
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'friends' ? styles.activeTabText : {}
            ]}
          >
            Friends
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'achievements' ? styles.activeTab : {}
          ]}
          onPress={() => setActiveTab('achievements')}
        >
          <Award 
            size={16} 
            color={activeTab === 'achievements' ? colors.primary : colors.textSecondary} 
            style={styles.tabIcon}
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'achievements' ? styles.activeTabText : {}
            ]}
          >
            Achievements
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'global' && (
          <>
            <View style={styles.userRankCard}>
              <View style={styles.userRankHeader}>
                <Text style={styles.userRankTitle}>Your Ranking</Text>
                <View style={styles.leagueBadge}>
                  <Text style={styles.leagueText}>Wellness Warrior</Text>
                </View>
              </View>
              
              <View style={styles.userRankContent}>
                <Image 
                  source={{ uri: userProfile.avatar }} 
                  style={styles.userAvatar} 
                />
                
                <View style={styles.userRankInfo}>
                  <Text style={styles.userName}>{userProfile.name}</Text>
                  <Text style={styles.userRank}>
                    Rank <Text style={styles.rankNumber}>#3</Text> of 156 users
                  </Text>
                </View>
                
                <View style={styles.userScore}>
                  <Text style={styles.scoreValue}>7,200</Text>
                  <Text style={styles.scoreLabel}>points</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Global Leaderboard</Text>
            
            {leaderboardData.map((entry) => (
              <LeaderboardItem
                key={entry.userId}
                entry={entry}
                isCurrentUser={entry.userId === userProfile.id}
              />
            ))}
            
            <TouchableOpacity style={styles.viewMoreButton}>
              <Text style={styles.viewMoreText}>View More</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </>
        )}
        
        {activeTab === 'friends' && (
          <>
            <View style={styles.friendsHeader}>
              <Text style={styles.friendsTitle}>Friends Leaderboard</Text>
              <TouchableOpacity style={styles.inviteButton}>
                <Text style={styles.inviteButtonText}>Invite Friends</Text>
              </TouchableOpacity>
            </View>
            
            {leaderboardData.slice(0, 3).map((entry) => (
              <LeaderboardItem
                key={entry.userId}
                entry={entry}
                isCurrentUser={entry.userId === userProfile.id}
              />
            ))}
            
            <View style={styles.emptyFriends}>
              <Text style={styles.emptyFriendsTitle}>Invite more friends</Text>
              <Text style={styles.emptyFriendsText}>
                Compete with your friends to stay motivated on your health journey
              </Text>
            </View>
          </>
        )}
        
        {activeTab === 'achievements' && (
          <>
            <View style={styles.achievementsHeader}>
              <Text style={styles.achievementsTitle}>Your Achievements</Text>
              <View style={styles.achievementsSummary}>
                <Text style={styles.achievementsCompleted}>
                  {achievements.filter(a => a.progress === 100).length} completed
                </Text>
                <Text style={styles.achievementsTotal}>
                  / {achievements.length} total
                </Text>
              </View>
            </View>
            
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
              />
            ))}
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userRankCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userRankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userRankTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  leagueBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  leagueText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  userRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userRankInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userRank: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rankNumber: {
    color: colors.primary,
    fontWeight: '600',
  },
  userScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginVertical: 8,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
  friendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  inviteButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  inviteButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  emptyFriends: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  emptyFriendsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyFriendsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  achievementsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementsCompleted: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  achievementsTotal: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});