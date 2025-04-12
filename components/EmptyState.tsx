import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, radius } from '@/constants/design';
import { PrimaryButton } from './PrimaryButton';
import { GradientCard } from './VisualEnhancements';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  image?: ImageSourcePropType;
  action?: {
    title: string;
    onPress: () => void;
  };
  secondaryAction?: {
    title: string;
    onPress: () => void;
  };
  centered?: boolean;
  gradient?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  image,
  action,
  secondaryAction,
  centered = true,
  gradient = false,
}) => {
  const Container = gradient ? GradientCard : View;
  const containerProps = gradient ? {
    startColor: `${colors.primary}10`,
    endColor: `${colors.background}60`,
  } : {};

  const content = (
    <>
      {image && (
        <Image
          source={image}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      
      {action && (
        <View style={styles.actionsContainer}>
          <PrimaryButton
            title={action.title}
            onPress={action.onPress}
            variant="primary"
            size="medium"
            style={styles.primaryAction}
            animateOnMount
          />
          
          {secondaryAction && (
            <PrimaryButton
              title={secondaryAction.title}
              onPress={secondaryAction.onPress}
              variant="outline"
              size="medium"
              style={styles.secondaryAction}
            />
          )}
        </View>
      )}
    </>
  );

  return (
    <Container 
      style={[
        styles.container, 
        centered && styles.centered,
        gradient && styles.gradientContainer
      ]}
      {...containerProps}
    >
      {content}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: 'center',
    borderRadius: radius.medium,
  },
  gradientContainer: {
    borderWidth: 1,
    borderColor: `${colors.border}60`,
  },
  centered: {
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.circle,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
    maxWidth: 300,
  },
  actionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 280,
  },
  primaryAction: {
    marginBottom: spacing.md,
    width: '100%',
  },
  secondaryAction: {
    width: '100%',
  },
}); 