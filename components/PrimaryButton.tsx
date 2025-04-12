import React, { useRef, useEffect } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View, 
  Animated, 
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, shadows } from '@/constants/design';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  animateOnMount?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  animateOnMount = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(animateOnMount ? 0.95 : 1)).current;
  const fadeAnim = useRef(new Animated.Value(animateOnMount ? 0 : 1)).current;
  
  useEffect(() => {
    if (animateOnMount) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);
  
  const getButtonStyles = () => {
    const baseStyles = [
      styles.button,
      styles[`${size}Button`],
      fullWidth && styles.fullWidth,
      {
        transform: [{ scale: scaleAnim }],
        opacity: disabled ? 0.6 : fadeAnim,
      },
    ];
    
    if (variant === 'primary') {
      baseStyles.push(styles.primaryButton);
    } else if (variant === 'secondary') {
      baseStyles.push(styles.secondaryButton);
    } else if (variant === 'outline') {
      baseStyles.push(styles.outlineButton);
    } else if (variant === 'danger') {
      baseStyles.push(styles.dangerButton);
    }
    
    return baseStyles;
  };
  
  const getTextStyles = () => {
    const baseStyles = [
      styles.text,
      styles[`${size}Text`],
    ];
    
    if (variant === 'primary') {
      baseStyles.push(styles.primaryText);
    } else if (variant === 'secondary') {
      baseStyles.push(styles.secondaryText);
    } else if (variant === 'outline') {
      baseStyles.push(styles.outlineText);
    } else if (variant === 'danger') {
      baseStyles.push(styles.dangerText);
    }
    
    return baseStyles;
  };
  
  return (
    <Animated.View style={getButtonStyles()}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.touchable, style]}
      >
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator 
              color={variant === 'outline' ? colors.primary : '#FFFFFF'} 
              size="small" 
              style={styles.loader}
            />
          ) : (
            <>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Text style={[...getTextStyles(), textStyle]}>
                {title}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.medium,
    overflow: 'hidden',
    ...shadows.small,
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    height: '100%',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.primaryLight,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.danger,
  },
  smallButton: {
    height: 36,
    borderRadius: radius.small,
  },
  mediumButton: {
    height: 44,
  },
  largeButton: {
    height: 52,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  smallText: {
    ...typography.caption,
    fontSize: 14,
  },
  mediumText: {
    ...typography.body,
  },
  largeText: {
    ...typography.body,
    fontSize: 18,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  loader: {
    marginHorizontal: spacing.xs,
  },
}); 