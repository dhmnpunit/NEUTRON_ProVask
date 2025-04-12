import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Achievement } from '@/types/health';
import { Award, Check } from 'lucide-react-native';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
}) => {
  const isCompleted = achievement.progress === 100;
  
  return (
    <View style={[
      styles.container, 
      isCompleted ? styles.completedContainer : {}
    ]}>
      <View style={styles.header}>
        <View style={[
          styles.iconContainer,
          isCompleted ? styles.completedIconContainer : {}
        ]}>
          {isCompleted ? (
            <Check size={20} color="#fff" />
          ) : (
            <Award size={20} color={colors.primary} />
          )}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{achievement.title}</Text>
          <Text style={styles.description}>{achievement.description}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar,
              { width: `${achievement.progress}%` },
              isCompleted ? styles.completedProgressBar : {}
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{achievement.progress}%</Text>
      </View>
      
      {isCompleted && achievement.unlockedAt && (
        <Text style={styles.unlockedText}>
          Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedContainer: {
    borderColor: colors.success,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completedIconContainer: {
    backgroundColor: colors.success,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: colors.divider,
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  completedProgressBar: {
    backgroundColor: colors.success,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    width: 36,
    textAlign: 'right',
  },
  unlockedText: {
    fontSize: 12,
    color: colors.success,
    marginTop: 8,
  },
});