import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '@/constants/colors';
import { Info } from 'lucide-react-native';
import { typography, spacing, radius, shadows, iconSizes } from '@/constants/design';
import { GradientCard, CardPattern } from './VisualEnhancements';

interface StreakCardProps {
  streak: number;
  description: string;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streak,
  description
}) => {
  // Create subtle animation for the streak number
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <GradientCard
      colorStart={`${colors.primaryLight}80`}
      colorEnd={`${colors.primaryLight}30`}
      style={styles.container}
    >
      <CardPattern patternColor={`${colors.primary}15`} />
      <View style={styles.leftContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>health streak</Text>
          <Info size={iconSizes.small} color={colors.primary} />
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.rightContent}>
        <Animated.Text 
          style={[
            styles.streakNumber, 
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          {streak}
        </Animated.Text>
        <Text style={styles.daysText}>days</Text>
      </View>
    </GradientCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.medium,
    padding: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.primary}15`,
  },
  leftContent: {
    flex: 1,
    paddingVertical: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.primary,
    marginRight: spacing.sm,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textSecondary,
    maxWidth: '90%',
    letterSpacing: 0.2,
  },
  rightContent: {
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  streakNumber: {
    fontSize: 46,
    fontWeight: '700',
    color: colors.primary,
  },
  daysText: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
});