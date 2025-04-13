import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { Info, Trophy, Flame, Calendar } from 'lucide-react-native';
import { spacing, radius, shadows, iconSizes, fonts, typography } from '@/constants/design';
import { GradientCard, CardPattern } from './VisualEnhancements';
import { differenceInDays, isToday, parseISO, format } from 'date-fns';

interface StreakCardProps {
  streak: number;
  description?: string;
  lastActivityDate?: string;
  onPress?: () => void;
  showDetails?: boolean;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streak = 0,
  description = "days with good health habits",
  lastActivityDate,
  onPress,
  showDetails = false,
}) => {
  // Create animations for the streak card
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  
  // Streak status calculation
  const [streakStatus, setStreakStatus] = useState<'active' | 'at-risk' | 'broken'>('active');
  const [daysSinceActivity, setDaysSinceActivity] = useState(0);
  
  useEffect(() => {
    // Calculate streak status based on last activity
    if (lastActivityDate) {
      const lastActivity = parseISO(lastActivityDate);
      const today = new Date();
      const dayDiff = differenceInDays(today, lastActivity);
      
      setDaysSinceActivity(dayDiff);
      
      if (isToday(lastActivity)) {
        // Activity today - streak is active
        setStreakStatus('active');
      } else if (dayDiff === 1) {
        // Activity was yesterday - streak is at risk
        setStreakStatus('at-risk');
      } else if (dayDiff > 1) {
        // More than a day since last activity - streak is broken
        setStreakStatus('broken');
      }
    } else {
      // No last activity date recorded - prompt user to start
      setStreakStatus('broken');
    }
  }, [lastActivityDate]);

  // Set up animations
  useEffect(() => {
    // Pulse animation for the streak number
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
    
    // Trophy shake animation on mount
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 0.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: -0.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Rotation interpolation for the trophy
  const rotate = rotateAnim.interpolate({
    inputRange: [-0.1, 0.1],
    outputRange: ['-10deg', '10deg'],
  });

  // Get streak icon and color based on status
  const getStreakStatusInfo = () => {
    switch (streakStatus) {
      case 'active':
        return {
          color: colors.success,
          icon: <Flame size={iconSizes.medium} color={colors.success} />,
          message: 'Streak is active today!'
        };
      case 'at-risk':
        return {
          color: colors.warning,
          icon: <Flame size={iconSizes.medium} color={colors.warning} />,
          message: 'Complete an activity today to maintain your streak'
        };
      case 'broken':
        return {
          color: colors.danger,
          icon: <Calendar size={iconSizes.medium} color={colors.danger} />,
          message: `Streak broken. It's been ${daysSinceActivity} days since your last activity`
        };
      default:
        return {
          color: colors.primary,
          icon: <Flame size={iconSizes.medium} color={colors.primary} />,
          message: 'Start your streak by completing an activity today'
        };
    }
  };
  
  const { color, icon, message } = getStreakStatusInfo();

  return (
    <Pressable onPress={onPress}>
      <GradientCard
        startColor={`${color}20`}
        endColor={`${color}05`}
        style={styles.container}
      >
        <CardPattern patternColor={`${color}15`} />
        
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color }]}>health streak</Text>
              <TouchableOpacity 
                onPress={() => setShowStreakInfo(!showStreakInfo)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Info size={iconSizes.small} color={color} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.description}>{description}</Text>
            
            {showStreakInfo && (
              <View style={styles.streakInfoContainer}>
                <Text style={styles.streakInfoText}>{message}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.rightContent}>
            <View style={styles.iconContainer}>
              <Animated.View style={{ transform: [{ rotate }] }}>
                {icon}
              </Animated.View>
            </View>
            
            <Animated.Text 
              style={[
                styles.streakNumber, 
                { transform: [{ scale: pulseAnim }], color }
              ]}
            >
              {streak}
            </Animated.Text>
            
            <Text style={styles.daysText}>days</Text>
          </View>
        </View>
        
        {showDetails && (
          <View style={styles.detailsContainer}>
            <View style={styles.streakIndicatorContainer}>
              {[...Array(Math.min(7, streak))].map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.streakDot, 
                    { backgroundColor: color }
                  ]} 
                />
              ))}
              {[...Array(Math.max(0, 7 - streak))].map((_, index) => (
                <View 
                  key={index + streak} 
                  style={[
                    styles.streakDot, 
                    styles.inactiveStreakDot
                  ]} 
                />
              ))}
            </View>
            
            <Text style={styles.streakGoalText}>
              {streak >= 7 
                ? 'Amazing! You\'ve maintained a strong streak!' 
                : `${7 - streak} more days to reach your next streak goal`}
            </Text>
          </View>
        )}
      </GradientCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.medium,
    padding: 0,
    borderWidth: 1,
    borderColor: `${colors.primary}15`,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
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
    fontFamily: fonts.semiBold,
    fontSize: typography.h3.fontSize,
    color: colors.primary,
    marginRight: spacing.sm,
    letterSpacing: -0.5,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    maxWidth: '90%',
    letterSpacing: 0.2,
  },
  rightContent: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xs,
  },
  streakNumber: {
    fontFamily: fonts.bold,
    fontSize: 42,
    color: colors.primary,
    marginVertical: -spacing.xs,
  },
  daysText: {
    fontFamily: fonts.regular,
    fontSize: typography.bodySmall.fontSize,
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  streakInfoContainer: {
    backgroundColor: `${colors.background}90`,
    padding: spacing.sm,
    borderRadius: radius.small,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: `${colors.primary}15`,
  },
  streakInfoText: {
    fontFamily: fonts.regular,
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: `${colors.border}50`,
    padding: spacing.md,
  },
  streakIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  streakDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  inactiveStreakDot: {
    backgroundColor: `${colors.border}80`,
  },
  streakGoalText: {
    fontFamily: fonts.regular,
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});