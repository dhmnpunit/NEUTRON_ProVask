import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { LeaderboardEntry } from '@/types/health';
import { Award, Flame } from 'lucide-react-native';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  entry,
  isCurrentUser,
}) => {
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : {}
    ]}>
      <View style={styles.rankContainer}>
        {entry.rank <= 3 ? (
          <View style={[styles.medalContainer, getMedalStyle(entry.rank)]}>
            <Award size={16} color="#fff" />
          </View>
        ) : (
          <Text style={styles.rankText}>{entry.rank}</Text>
        )}
      </View>
      
      <Image 
        source={{ uri: entry.avatar }} 
        style={styles.avatar} 
      />
      
      <View style={styles.userInfo}>
        <Text style={[
          styles.userName,
          isCurrentUser ? styles.currentUserText : {}
        ]}>
          {entry.name}
          {isCurrentUser && <Text style={styles.youText}> (You)</Text>}
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Flame size={12} color={colors.mood} style={styles.statIcon} />
            <Text style={styles.statText}>{entry.streak} day streak</Text>
          </View>
          
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lvl {entry.level}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{entry.score}</Text>
        <Text style={styles.scoreLabel}>points</Text>
      </View>
    </View>
  );
};

const getMedalStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return styles.goldMedal;
    case 2:
      return styles.silverMedal;
    case 3:
      return styles.bronzeMedal;
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserContainer: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: colors.primaryLight + '40',
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medalContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldMedal: {
    backgroundColor: '#FFD700',
  },
  silverMedal: {
    backgroundColor: '#C0C0C0',
  },
  bronzeMedal: {
    backgroundColor: '#CD7F32',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  currentUserText: {
    color: colors.primary,
  },
  youText: {
    fontWeight: '400',
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  statIcon: {
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  levelBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.textTertiary,
  },
});