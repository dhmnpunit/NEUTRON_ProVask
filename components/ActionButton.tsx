import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, shadows, iconSizes } from '@/constants/design';

interface ActionButtonProps {
  title: string;
  icon?: React.ReactNode;
  onPress: () => void;
  primary?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  icon,
  onPress,
  primary = false,
  fullWidth = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        primary ? styles.primaryContainer : styles.secondaryContainer,
        fullWidth ? styles.fullWidth : {},
        disabled && styles.disabledContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text 
        style={[
          styles.title,
          primary ? styles.primaryTitle : styles.secondaryTitle,
          disabled && styles.disabledTitle
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.circle,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg - 4,
  },
  primaryContainer: {
    backgroundColor: colors.primary,
    ...shadows.small,
  },
  secondaryContainer: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
  primaryTitle: {
    color: '#FFFFFF',
  },
  secondaryTitle: {
    color: colors.text,
  },
  disabledTitle: {
    opacity: 0.7,
  },
});