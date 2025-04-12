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
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, BeakerIcon, CloudIcon, MoonIcon } from 'react-native-heroicons/outline';
import { JournalEntry } from '@/types/health';
import { getJournalEntries } from '@/services/journalService';
import { LogCard } from '@/components/LogCard';

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
          <PlusIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <MagnifyingGlassIcon size={20} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="search your logs..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <FunnelIcon size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoriesContainer}>
        <TouchableOpacity style={[styles.categoryButton, styles.categoryButtonActive]}>
          <Text style={[styles.categoryText, styles.categoryTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <BeakerIcon size={16} color={colors.textSecondary} style={styles.categoryIcon} />
          <Text style={styles.categoryText}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <CloudIcon size={16} color={colors.textSecondary} style={styles.categoryIcon} />
          <Text style={styles.categoryText}>Water</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <MoonIcon size={16} color={colors.textSecondary} style={styles.categoryIcon} />
          <Text style={styles.categoryText}>Sleep</Text>
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
              subtitle={entry.content.substring(0, 60) + (entry.content.length > 60 ? '...' : '')}
              notes={entry.content}
              date={entry.created_at}
              tags={entry.tags}
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
  addButton: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
  },
  filterButton: {
    padding: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: colors.card,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  entriesContainer: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 32,
  },
});