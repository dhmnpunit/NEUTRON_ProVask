import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { JournalEntry, MoodType } from '@/types/health';
import { Calendar, Tag } from 'lucide-react-native';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress: (entry: JournalEntry) => void;
}

const getMoodColor = (mood?: MoodType): string => {
  switch (mood) {
    case 'great':
      return colors.success;
    case 'good':
      return colors.info;
    case 'neutral':
      return colors.textTertiary;
    case 'bad':
      return colors.warning;
    case 'terrible':
      return colors.danger;
    default:
      return colors.textTertiary;
  }
};

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
  onPress,
}) => {
  const moodColor = getMoodColor(entry.mood);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(entry)}
      activeOpacity={0.7}
    >
      <View style={[styles.moodIndicator, { backgroundColor: moodColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={styles.date}>{formatDate(entry.date)}</Text>
          </View>
          {entry.mood && (
            <View style={[styles.moodBadge, { backgroundColor: moodColor + '20' }]}>
              <Text style={[styles.moodText, { color: moodColor }]}>
                {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.contentText} numberOfLines={3}>
          {entry.content}
        </Text>
        
        {entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Tag size={14} color={colors.textSecondary} style={styles.tagIcon} />
            <View style={styles.tags}>
              {entry.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodIndicator: {
    width: 4,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  moodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  tagIcon: {
    marginRight: 6,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  tag: {
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});