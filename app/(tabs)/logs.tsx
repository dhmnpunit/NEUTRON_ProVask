import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from 'react-native-heroicons/outline';
import { JournalEntry, MoodType } from '@/types/health';
import { getJournalEntries } from '@/services/journalService';
import { LogCard } from '@/components/LogCard';
import { typography, spacing, radius, shadows, iconSizes } from '@/constants/design';

// Helper function to get mood emojis based on mood type
const getMoodEmoji = (mood?: MoodType): string => {
  if (!mood) return '';
  
  switch(mood) {
    case 'great':
      return '😊';
    case 'good':
      return '🙂';
    case 'neutral':
      return '😐';
    case 'bad':
      return '😔';
    case 'terrible':
      return '😡';
    default:
      return '';
  }
};

export default function LogsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await getJournalEntries(user!.id);
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => 
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>your health logs</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/logs/add')}
        >
          <PlusIcon size={iconSizes.medium} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <MagnifyingGlassIcon size={iconSizes.medium} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="search your logs..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <FunnelIcon size={iconSizes.medium} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.entriesContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading entries...</Text>
        ) : filteredEntries.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery ? 'No entries found' : 'No entries yet. Start logging your health!'}
          </Text>
        ) : (
          filteredEntries.map(entry => (
            <LogCard
              key={entry.id}
              title={`Health Log - ${new Date(entry.created_at).toLocaleDateString()}`}
              content={entry.content}
              symptoms={entry.symptoms}
              date={entry.created_at}
              tags={entry.tags}
              feelingEmoji={getMoodEmoji(entry.mood)}
              feeling={entry.mood}
              metrics={{
                water: entry.health_metrics.water_glasses,
                sleep: entry.health_metrics.sleep_quality,
                exercise: entry.health_metrics.exercise_minutes
              }}
              onPress={() => router.push(`/logs/${entry.id}`)}
            />
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: typography.h2.color,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: radius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
    fontSize: typography.body.fontSize,
  },
  filterButton: {
    padding: spacing.sm,
  },
  entriesContainer: {
    flex: 1,
    padding: spacing.md,
  },
  loadingText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.xl,
    fontSize: typography.body.fontSize,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.xl,
    fontSize: typography.body.fontSize,
  },
});