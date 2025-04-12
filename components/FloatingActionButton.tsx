import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  Text,
  View,
  Platform,
} from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius, shadows, iconSizes, typography } from '@/constants/design';

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
  label?: string;
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  animateOnMount?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onPress,
  style,
  size = 'medium',
  variant = 'primary',
  label,
  position = 'bottomRight',
  animateOnMount = false,
}) => {
  // Animation references
  const scaleAnim = useRef(new Animated.Value(animateOnMount ? 0 : 1)).current;
  const translateYAnim = useRef(new Animated.Value(animateOnMount ? 100 : 0)).current;
  
  // Animations on mount
  useEffect(() => {
    if (animateOnMount) {
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(translateYAnim, {
            toValue: 0,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, []);
  
  // Press animation
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  // Determine position styles
  const getPositionStyle = () => {
    switch (position) {
      case 'bottomRight':
        return styles.bottomRight;
      case 'bottomLeft':
        return styles.bottomLeft;
      case 'topRight':
        return styles.topRight;
      case 'topLeft':
        return styles.topLeft;
      default:
        return styles.bottomRight;
    }
  };
  
  // Get button size
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };
  
  // Get button color
  const getButtonColor = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary };
      case 'secondary':
        return { backgroundColor: colors.primaryLight };
      default:
        return { backgroundColor: colors.primary };
    }
  };
  
  // Handle animation styles
  const animatedStyles = {
    transform: [
      { scale: scaleAnim },
      { translateY: translateYAnim },
    ],
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        getPositionStyle(),
        animatedStyles,
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[
          styles.button,
          getButtonSize(),
          getButtonColor(),
          label ? styles.buttonWithLabel : null,
        ]}
      >
        {icon}
        
        {label && (
          <Text style={styles.label}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
  bottomRight: {
    bottom: spacing.lg + spacing.md,
    right: spacing.lg,
  },
  bottomLeft: {
    bottom: spacing.lg + spacing.md,
    left: spacing.lg,
  },
  topRight: {
    top: spacing.lg + spacing.md,
    right: spacing.lg,
  },
  topLeft: {
    top: spacing.lg + spacing.md,
    left: spacing.lg,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.circle,
    ...shadows.medium,
    flexDirection: 'row',
    // For Android elevation shadow
    elevation: 8,
    // For iOS shadow
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonWithLabel: {
    paddingHorizontal: spacing.md,
  },
  smallButton: {
    width: 48,
    height: 48,
  },
  mediumButton: {
    width: 56,
    height: 56,
  },
  largeButton: {
    width: 64,
    height: 64,
  },
  label: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
}); 