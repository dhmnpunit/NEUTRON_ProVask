import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Text
} from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, shadows, iconSizes, fonts } from '@/constants/design';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { JournalEntry, MoodType } from '@/types/health';
import { getJournalEntries } from '@/services/journalService';
import { LogCard } from '@/components/LogCard';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Search, Filter, Plus, CalendarDays, BookOpen } from 'lucide-react-native';

// Helper function to get mood emojis based on mood type
const getMoodEmoji = (mood?: MoodType): string => {
  if (!mood) return '';
  
  switch(mood) {
    case 'great': return '😊';
    case 'good': return '🙂';
    case 'neutral': return '😐';
    case 'bad': return '😔';
    case 'terrible': return '😡';
    default: return '';
  }
};

// Get filter display name
const getFilterDisplayName = (filter: 'all' | 'today' | 'week' | 'month'): string => {
  switch (filter) {
    case 'all': return 'all';
    case 'today': return 'today';
    case 'week': return 'this week';
    case 'month': return 'this month';
    default: return 'all';
  }
};

export default function LogsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getJournalEntries(user.id);
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchEntries();
  };

  const filteredEntries = entries.filter(entry => {
    // Text search filter
    const matchesSearch = searchQuery === '' || 
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    // Time-based filter
    if (activeFilter === 'all') return true;
    
    const entryDate = new Date(entry.created_at);
    const today = new Date();
    
    if (activeFilter === 'today') {
      return entryDate.getDate() === today.getDate() &&
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getFullYear() === today.getFullYear();
    }
    
    if (activeFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return entryDate >= oneWeekAgo;
    }
    
    if (activeFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      return entryDate >= oneMonthAgo;
    }
    
    return true;
  });
  
  // Create floating action button
  const FloatingActionButton = () => (
    <TouchableOpacity 
      style={styles.fab}
      onPress={() => router.push('/logs/add')}
    >
      <Plus size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Journal"
        elevated
        rightActions={(
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/logs/add')}
          >
            <Plus size={iconSizes.medium} color={colors.primary} />
          </TouchableOpacity>
        )}
      />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={iconSizes.small} color={colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search journal entries..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filterIconButton}
          onPress={() => setShowFilterOptions(!showFilterOptions)}
        >
          <Filter size={iconSizes.small} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {showFilterOptions && (
        <>
          <TouchableOpacity 
            style={styles.filterOverlay}
            activeOpacity={0.5}
            onPress={() => setShowFilterOptions(false)}
          />
          <View style={styles.filterOptionsContainer}>
            <View style={styles.filterOptionsHeader}>
              <Text style={styles.filterOptionsTitle}>filter by</Text>
              <TouchableOpacity onPress={() => setShowFilterOptions(false)}>
                <Text style={styles.filterOptionsDone}>done</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'today' && styles.activeFilterOption]} 
              onPress={() => {
                setActiveFilter('today');
                setShowFilterOptions(false);
              }}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'today' && styles.activeFilterOptionText]}>today</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'week' && styles.activeFilterOption]} 
              onPress={() => {
                setActiveFilter('week');
                setShowFilterOptions(false);
              }}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'week' && styles.activeFilterOptionText]}>this week</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'month' && styles.activeFilterOption]} 
              onPress={() => {
                setActiveFilter('month');
                setShowFilterOptions(false);
              }}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'month' && styles.activeFilterOptionText]}>this month</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'all' && styles.activeFilterOption]} 
              onPress={() => {
                setActiveFilter('all');
                setShowFilterOptions(false);
              }}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'all' && styles.activeFilterOptionText]}>all entries</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView 
          style={styles.entriesContainer}
          contentContainerStyle={[
            styles.entriesContentContainer,
            filteredEntries.length === 0 && styles.emptyContentContainer
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {filteredEntries.length === 0 ? (
            <EmptyState
              title="No journal entries found"
              description={searchQuery ? "No entries match your search" : "Start tracking your health by creating a new journal entry"}
              icon={<BookOpen size={36} color={colors.primary} />}
              action={{
                title: "Add First Entry",
                onPress: () => router.push('/logs/add')
              }}
              centered
              gradient
            />
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
                  sleep: entry.health_metrics.sleep_hours,
                  exercise: entry.health_metrics.exercise_minutes
                }}
                onPress={() => router.push(`/logs/${entry.id}`)}
              />
            ))
          )}
        </ScrollView>
      )}
      
      {!loading && filteredEntries.length > 0 && <FloatingActionButton />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: radius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    flex: 1,
    marginRight: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: colors.text,
    fontSize: typography.body.fontSize,
  },
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.circle,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  entriesContainer: {
    flex: 1,
  },
  entriesContentContainer: {
    padding: spacing.md,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.circle,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  filterOptionsContainer: {
    position: 'absolute',
    top: 'auto',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopLeftRadius: radius.large,
    borderTopRightRadius: radius.large,
    zIndex: 10,
    ...shadows.medium
  },
  filterOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.md,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterOptionsTitle: {
    ...typography.h3,
    color: colors.text,
    fontFamily: fonts.medium,
  },
  filterOptionsDone: {
    ...typography.body,
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  filterOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    backgroundColor: colors.card,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilterOption: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  filterOptionText: {
    ...typography.body,
    fontSize: 16,
    color: colors.text,
  },
  activeFilterOptionText: {
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  filterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 5,
  },
});