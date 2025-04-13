import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, shadows } from '@/constants/design';

interface RatingSelectorProps {
  title: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const RatingSelector: React.FC<RatingSelectorProps> = ({
  title,
  description,
  value,
  onChange,
  min = 1,
  max = 7
}) => {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              value === option ? styles.selectedOption : {}
            ]}
            onPress={() => onChange(option)}
          >
            <Text 
              style={[
                styles.optionText,
                value === option ? styles.selectedOptionText : {}
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: typography.body.color,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.bodySmall.fontSize,
    color: typography.caption.color,
    marginBottom: spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    width: 40,
    height: 40,
    borderRadius: radius.circle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.small,
  },
  optionText: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});