import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Info } from 'lucide-react-native';

interface StreakCardProps {
  streak: number;
  description: string;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streak,
  description
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>health streak</Text>
          <Info size={16} color={colors.textSecondary} />
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.streakNumber}>{streak}</Text>
        <Text style={styles.daysText}>days</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leftContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  rightContent: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.primary,
  },
  daysText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});