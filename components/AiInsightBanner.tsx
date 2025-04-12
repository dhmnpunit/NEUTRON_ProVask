import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { Brain, X } from 'lucide-react-native';

interface AiInsightBannerProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export const AiInsightBanner: React.FC<AiInsightBannerProps> = ({
  message,
  actionText,
  onAction,
  onDismiss,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Brain size={20} color={colors.primary} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.message}>{message}</Text>
        {actionText && onAction && (
          <TouchableOpacity onPress={onAction} style={styles.actionButton}>
            <Text style={styles.actionText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <X size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  dismissButton: {
    padding: 4,
  },
});