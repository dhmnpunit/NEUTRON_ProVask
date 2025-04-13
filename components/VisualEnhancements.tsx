import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { spacing, radius, shadows } from '@/constants/design';

interface AccentLineProps {
  color: string;
  style?: ViewStyle;
}

export const AccentLine: React.FC<AccentLineProps> = ({ color, style }) => {
  return (
    <View style={[styles.accentLine, { backgroundColor: color }, style]} />
  );
};

interface DividerProps {
  style?: ViewStyle;
  color?: string;
}

export const Divider: React.FC<DividerProps> = ({ style, color = colors.divider }) => {
  return (
    <View style={[styles.divider, { backgroundColor: color }, style]} />
  );
};

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  startColor?: string;
  endColor?: string;
  colorStart?: string;
  colorEnd?: string;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  style,
  startColor,
  endColor,
  colorStart,
  colorEnd,
}) => {
  const start = startColor || colorStart || `${colors.primaryLight}30`;
  const end = endColor || colorEnd || colors.card;
  
  return (
    <LinearGradient
      colors={[start, end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientCard, style]}
    >
      {children}
    </LinearGradient>
  );
};

interface CardPatternProps {
  patternColor?: string;
  style?: ViewStyle;
}

export const CardPattern: React.FC<CardPatternProps> = ({
  patternColor = `${colors.primary}10`,
  style
}) => {
  return (
    <View style={[styles.patternContainer, style]}>
      <View style={[styles.patternCircle, { backgroundColor: patternColor }, styles.circle1]} />
      <View style={[styles.patternCircle, { backgroundColor: patternColor }, styles.circle2]} />
      <View style={[styles.patternCircle, { backgroundColor: patternColor }, styles.circle3]} />
    </View>
  );
};

const styles = StyleSheet.create({
  accentLine: {
    width: 4,
    height: '100%',
    borderRadius: radius.small / 2,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: spacing.sm,
    backgroundColor: colors.divider,
  },
  gradientCard: {
    borderRadius: radius.medium,
    overflow: 'hidden',
    ...shadows.small,
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    opacity: 0.8,
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: radius.circle,
  },
  circle1: {
    width: 80,
    height: 80,
    top: -20,
    right: -20,
  },
  circle2: {
    width: 60,
    height: 60,
    bottom: -15,
    right: 20,
  },
  circle3: {
    width: 40,
    height: 40,
    top: 20,
    right: 50,
  },
}); 