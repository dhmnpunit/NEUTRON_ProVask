import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, shadows, iconSizes } from '@/constants/design';
import { GradientCard, CardPattern } from './VisualEnhancements';

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  lightColor: string;
  onPress?: () => void;
  subtitle?: string;
}

export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  icon,
  color,
  lightColor,
  onPress,
  subtitle
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <GradientCard 
        style={styles.card}
        startColor={`${lightColor}90`}
        endColor={`${lightColor}50`}
      >
        <CardPattern patternColor={`${color}15`} />
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            {icon}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={[styles.value, { color }]}>{value}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      </GradientCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    borderRadius: radius.medium,
    ...shadows.small,
  },
  card: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    width: spacing.xl + spacing.md,
    height: spacing.xl + spacing.md,
    borderRadius: radius.small,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    ...shadows.small,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: typography.caption.color,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
    marginVertical: spacing.xs / 2,
  },
  subtitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
});