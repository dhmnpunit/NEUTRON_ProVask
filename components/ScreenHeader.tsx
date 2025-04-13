import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, shadows, iconSizes, fonts } from '@/constants/design';
import { GradientCard } from './VisualEnhancements';

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightActions?: React.ReactNode;
  subtitle?: string;
  onBack?: () => void;
  elevated?: boolean;
  isDark?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBackButton = false,
  rightActions,
  subtitle,
  onBack,
  elevated = false,
  isDark = false,
}) => {
  const router = useRouter();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const textColor = isDark ? '#FFFFFF' : colors.text;
  const bgColor = isDark ? 
    `${colors.primary}E0` : 
    elevated ? colors.card : colors.background;

  return (
    <View style={[
      styles.container,
      { backgroundColor: bgColor },
      elevated && styles.elevated
    ]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent 
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity 
              style={[
                styles.backButton,
                isDark && styles.backButtonDark
              ]}
              onPress={handleBack}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <ChevronLeft 
                size={iconSizes.medium} 
                color={isDark ? '#FFFFFF' : colors.text} 
              />
            </TouchableOpacity>
          )}
          
          <View style={styles.titleContainer}>
            <Text 
              style={[
                styles.title,
                isDark && { color: '#FFFFFF' },
                showBackButton && styles.titleWithBack
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            
            {subtitle && (
              <Text 
                style={[
                  styles.subtitle,
                  isDark && { color: 'rgba(255, 255, 255, 0.8)' }
                ]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        {rightActions && (
          <View style={styles.rightContainer}>
            {rightActions}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 44,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.border}80`,
  },
  elevated: {
    ...shadows.small,
    borderBottomWidth: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: radius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${colors.border}40`,
    marginRight: spacing.sm,
  },
  backButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    fontWeight: '700',
    fontFamily: fonts.headingBold,
  },
  titleWithBack: {
    marginLeft: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 