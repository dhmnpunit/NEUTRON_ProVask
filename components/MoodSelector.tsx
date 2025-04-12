import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { MoodType } from '@/types/health';

interface MoodSelectorProps {
  value?: MoodType;
  onChange: (mood: MoodType) => void;
}

const moods: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: 'terrible', emoji: '😫', label: 'Terrible', color: colors.danger },
  { type: 'bad', emoji: '🙁', label: 'Bad', color: colors.warning },
  { type: 'neutral', emoji: '😐', label: 'Neutral', color: colors.textSecondary },
  { type: 'good', emoji: '🙂', label: 'Good', color: colors.info },
  { type: 'great', emoji: '😄', label: 'Great', color: colors.success },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>how do you feel?</Text>
      
      <View style={styles.moodsContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.type}
            style={[
              styles.moodButton,
              value === mood.type ? { backgroundColor: mood.color + '20' } : {}
            ]}
            onPress={() => onChange(mood.type)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text 
              style={[
                styles.moodLabel,
                value === mood.type ? { color: mood.color, fontWeight: '500' } : {}
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 16,
  },
  moodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    width: 64,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});