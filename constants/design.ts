import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors } from './colors';

// Typography
export const typography = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.4,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 20,
    letterSpacing: 0.15,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.15,
  },
});

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Radius
export const radius = {
  small: 8,
  medium: 12,
  large: 16,
  circle: 999,
};

// Shadows
export const shadows = StyleSheet.create({
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  focused: {
    shadowColor: `${colors.primary}80`,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
});

// Common component styles
export const componentStyles = StyleSheet.create({
  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.medium,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  } as ViewStyle,
  
  // Headers
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  } as ViewStyle,
  
  // Buttons
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.medium,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  secondaryButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.medium,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  // Tags
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.small,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  } as ViewStyle,
  
  // Inputs
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.medium,
    padding: spacing.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  } as ViewStyle,
  
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  } as ViewStyle,
});

// Icon sizes
export const iconSizes = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 32,
};

// Recommended icon library
export const recommendedIconLib = 'lucide-react-native'; 