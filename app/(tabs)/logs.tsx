import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { colors } from '@/constants/colors';
import { useHealthStore } from '@/store/health-store';
import { LogCard } from '@/components/LogCard';
import { JournalEntry, MoodType } from '@/types/health';
import { Plus, Search, Filter, Coffee, Utensils, Moon, Droplet } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';

export default function LogsScreen() {
  const router = useRouter();
  const { journalEntries } = useHealthStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter entries based on search
  const filteredEntries = journalEntries.filter(entry => {
    return searchQuery === '' || 
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Get mood emoji
  const getMoodEmoji = (mood?: MoodType): string => {
    switch (mood) {
      case 'great': return '😄';
      case 'good': return '🙂';
      case 'neutral': return '😐';
      case 'bad': return '🙁';
      case 'terrible': return '😫';
      default: return '😐';
    }
  };
  
  const handleEntryPress = (entry: JournalEntry) => {
    // Navigate to entry detail
    router.push({
      pathname: '/logs/[id]',
      params: { id: entry.id }
    });
  };
  
  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>your health logs</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/logs/add')}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="search your logs..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoriesContainer}>
        <TouchableOpacity style={[styles.categoryButton, styles.categoryButtonActive]}>
          <Text style={[styles.categoryText, styles.categoryTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Utensils size={16} color={colors.textSecondary} style={styles.categoryIcon} />
          <Text style={styles.categoryText}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Droplet size={16} color={colors.textSecondary} style={styles.categoryIcon} />
          <Text style={styles.categoryText}>Water</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Moon size={16} color={colors.textSecondary} style={styles.categoryIcon} />
          <Text style={styles.categoryText}>Sleep</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.entriesContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <LogCard
              key={entry.id}
              title={entry.date}
              feeling={entry.mood}
              feelingEmoji={getMoodEmoji(entry.mood)}
              notes={entry.content}
              onPress={() => handleEntryPress(entry)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No logs found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Try adjusting your search"
                : "Start logging to track your health journey"}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/logs/add')}
            >
              <Text style={styles.emptyButtonText}>Create First Log</Text>
            </TouchableOpacity>
          </View>
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: colors.text,
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
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
    fontWeight: '500',
  },
  entriesContainer: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});