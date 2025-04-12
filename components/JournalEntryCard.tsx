import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { format } from 'date-fns';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, fonts } from '@/constants/design';
import { GradientCard, AccentLine, CardPattern } from './VisualEnhancements';

export interface JournalEntryCardProps {
  date: Date;
  title: string;
  content: string;
  mood?: string;
  moodEmoji?: string;
  onPress?: () => void;
}

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  date,
  title,
  content,
  mood,
  moodEmoji,
  onPress,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const formatDate = (date: Date) => {
    return {
      day: format(date, 'd'),
      month: format(date, 'MMM'),
    };
  };

  const getMoodColor = (mood?: string) => {
    if (!mood) return colors.neutral;
    
    switch(mood.toLowerCase()) {
      case 'happy':
      case 'excited':
      case 'joyful':
        return colors.success;
      case 'sad':
      case 'depressed':
      case 'down':
        return colors.warning;
      case 'angry':
      case 'frustrated':
      case 'annoyed':
        return colors.error;
      case 'calm':
      case 'peaceful':
      case 'relaxed':
        return colors.info;
      default:
        return colors.accent;
    }
  };

  const { day, month } = formatDate(date);
  const moodColor = getMoodColor(mood);
  
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <GradientCard style={styles.card}>
        <CardPattern />
        <View style={styles.contentContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.month}>{month}</Text>
          </View>
          
          <View style={styles.divider}>
            <AccentLine color={moodColor} style={styles.accentLine} />
          </View>
          
          <View style={styles.textContent}>
            <View style={styles.headerRow}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {moodEmoji && (
                <Text style={styles.moodEmoji}>{moodEmoji}</Text>
              )}
            </View>
            
            <Text style={styles.preview} numberOfLines={2}>
              {content}
            </Text>
            
            {mood && (
              <View style={[styles.moodTag, { backgroundColor: `${moodColor}20` }]}>
                <Text style={[styles.moodText, { color: moodColor }]}>
                  {mood}
                </Text>
              </View>
            )}
          </View>
        </View>
      </GradientCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    width: 60,
    backgroundColor: `${colors.primary}10`,
  },
  day: {
    ...typography.h3,
    color: colors.text,
    fontWeight: 'bold',
    fontFamily: fonts.headingBold,
  },
  month: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  divider: {
    marginVertical: spacing.sm,
  },
  accentLine: {
    height: '90%',
    alignSelf: 'center',
    borderRadius: radius.pill,
  },
  textContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
    flex: 1,
    color: colors.text,
    fontWeight: 'bold',
    fontFamily: fonts.headingBold,
  },
  moodEmoji: {
    fontSize: 18,
    marginLeft: spacing.xs,
  },
  preview: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  moodTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.pill,
  },
  moodText: {
    ...typography.caption,
    fontWeight: '500',
  },
});