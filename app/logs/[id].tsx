import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { PencilIcon, ClockIcon, TagIcon, TrashIcon } from 'react-native-heroicons/outline';
import { getJournalEntryById, deleteJournalEntry } from '@/services/journalService';
import { JournalEntry, MoodType } from '@/types/health';
import { typography, spacing, radius, shadows, iconSizes } from '@/constants/design';

export default function JournalEntryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEntry();
    }
  }, [id]);

  const fetchEntry = async () => {
    try {
      setLoading(true);
      const data = await getJournalEntryById(id as string);
      setEntry(data);
    } catch (error) {
      console.error('Error fetching entry:', error);
      Alert.alert('Error', 'Failed to load journal entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteJournalEntry(id as string);
              router.replace('/logs');
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete journal entry');
            }
          }
        },
      ]
    );
  };

  const getMoodEmoji = (mood?: MoodType): string => {
    switch (mood) {
      case 'great': return '😄';
      case 'good': return '🙂';
      case 'neutral': return '😐';
      case 'bad': return '🙁';
      case 'terrible': return '😫';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const HeaderRight = () => (
    <View style={styles.headerActions}>
      <TouchableOpacity 
        style={styles.headerButton}
        onPress={() => router.push(`/logs/edit/${id}`)}
      >
        <PencilIcon size={iconSizes.medium} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.headerButton}
        onPress={handleDelete}
      >
        <TrashIcon size={iconSizes.medium} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper>
      <Stack.Screen
        options={{
          title: "journal entry",
          headerRight: () => <HeaderRight />,
          headerTitleStyle: styles.headerTitle,
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : entry ? (
        <ScrollView style={styles.container}>
          <View style={styles.dateContainer}>
            <ClockIcon size={iconSizes.small} color={colors.textSecondary} style={styles.dateIcon} />
            <Text style={styles.date}>{formatDate(entry.created_at)}</Text>
          </View>

          {entry.mood && (
            <View style={styles.moodContainer}>
              <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
              <Text style={styles.moodText}>Feeling {entry.mood}</Text>
            </View>
          )}

          <View style={styles.contentContainer}>
            <Text style={styles.content}>{entry.content}</Text>
          </View>

          {entry.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {entry.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <TagIcon size={iconSizes.small} color={colors.primary} style={styles.tagIcon} />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {entry.symptoms.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Symptoms</Text>
              <View style={styles.tagsContainer}>
                {entry.symptoms.map((symptom, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{symptom}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Metrics</Text>
            <View style={styles.metricsContainer}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Sleep Quality</Text>
                <Text style={styles.metricValue}>{entry.health_metrics.sleep_quality}/10</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Mental Clarity</Text>
                <Text style={styles.metricValue}>{entry.health_metrics.mental_clarity}/10</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Energy Level</Text>
                <Text style={styles.metricValue}>{entry.health_metrics.energy_level}/10</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Exercise</Text>
                <Text style={styles.metricValue}>{entry.health_metrics.exercise_minutes} min</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Water</Text>
                <Text style={styles.metricValue}>{entry.health_metrics.water_glasses} glasses</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Entry not found</Text>
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: typography.h2.color,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: spacing.md,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateIcon: {
    marginRight: spacing.sm,
  },
  date: {
    fontSize: typography.caption.fontSize,
    color: typography.caption.color,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  moodEmoji: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  moodText: {
    fontSize: typography.body.fontSize,
    color: typography.body.color,
  },
  contentContainer: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.medium,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  content: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: typography.body.color,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: typography.h3.color,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primaryLight}99`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.small,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagIcon: {
    marginRight: spacing.xs,
  },
  tagText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
  },
  metricsContainer: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.medium,
    ...shadows.small,
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  metricLabel: {
    fontSize: typography.body.fontSize,
    color: typography.body.color,
  },
  metricValue: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  errorText: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});