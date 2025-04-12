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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { ChevronLeftIcon, TrashIcon, PencilIcon, ClockIcon, TagIcon } from 'react-native-heroicons/outline';
import { getJournalEntryById, deleteJournalEntry } from '@/services/journalService';
import { JournalEntry, MoodType } from '@/types/health';

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

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeftIcon size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>journal entry</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push(`/logs/edit/${id}`)}
          >
            <PencilIcon size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleDelete}
          >
            <TrashIcon size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : entry ? (
        <ScrollView style={styles.container}>
          <View style={styles.dateContainer}>
            <ClockIcon size={16} color={colors.textSecondary} style={styles.dateIcon} />
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
                    <TagIcon size={14} color={colors.primary} style={styles.tagIcon} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateIcon: {
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  moodText: {
    fontSize: 16,
    color: colors.text,
  },
  contentContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  content: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 14,
    color: colors.primary,
  },
  metricsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metricLabel: {
    fontSize: 16,
    color: colors.text,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});