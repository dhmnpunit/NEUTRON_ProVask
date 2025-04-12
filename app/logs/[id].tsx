import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';
import { colors } from '@/constants/colors';
import { useHealthStore } from '@/store/health-store';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Calendar, Tag, Trash2, Edit2, Save, X } from 'lucide-react-native';
import { MoodType } from '@/types/health';

export default function JournalEntryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    journalEntries, 
    updateJournalEntry, 
    deleteJournalEntry 
  } = useHealthStore();
  
  const entry = journalEntries.find(e => e.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(entry?.content || '');
  const [editedTags, setEditedTags] = useState(entry?.tags.join(', ') || '');
  
  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Entry Not Found' }} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Journal entry not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
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
  
  const handleSave = () => {
    // Process tags from comma-separated string to array
    const tagsArray = editedTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    updateJournalEntry(entry.id, {
      content: editedContent,
      tags: tagsArray
    });
    
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteJournalEntry(entry.id);
            router.back();
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Journal Entry',
          headerRight: () => (
            <View style={styles.headerButtons}>
              {isEditing ? (
                <>
                  <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => setIsEditing(false)}
                  >
                    <X size={20} color={colors.danger} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={handleSave}
                  >
                    <Save size={20} color={colors.success} />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => setIsEditing(true)}
                  >
                    <Edit2 size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={handleDelete}
                  >
                    <Trash2 size={20} color={colors.danger} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          )
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Calendar size={16} color={colors.textSecondary} style={styles.dateIcon} />
            <Text style={styles.date}>{formatDate(entry.date)}</Text>
          </View>
          
          {entry.mood && (
            <View style={[
              styles.moodBadge, 
              { backgroundColor: getMoodColor(entry.mood) + '20' }
            ]}>
              <Text style={[
                styles.moodText, 
                { color: getMoodColor(entry.mood) }
              ]}>
                {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
              </Text>
            </View>
          )}
        </View>
        
        {isEditing ? (
          <View style={styles.editContainer}>
            <Text style={styles.editLabel}>Journal Entry</Text>
            <TextInput
              style={styles.editInput}
              value={editedContent}
              onChangeText={setEditedContent}
              multiline
              placeholder="Write your journal entry here..."
              placeholderTextColor={colors.textTertiary}
            />
            
            <Text style={styles.editLabel}>Tags (comma-separated)</Text>
            <TextInput
              style={styles.editTagsInput}
              value={editedTags}
              onChangeText={setEditedTags}
              placeholder="e.g. workout, stress, sleep"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        ) : (
          <>
            <Text style={styles.content}>{entry.content}</Text>
            
            {entry.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <Tag size={16} color={colors.textSecondary} style={styles.tagsIcon} />
                <View style={styles.tags}>
                  {entry.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
        
        <View style={styles.aiInsightContainer}>
          <Text style={styles.aiInsightTitle}>AI Health Insights</Text>
          <Text style={styles.aiInsightText}>
            Based on your journal entry, it seems like you had a {entry.mood || "neutral"} day. 
            {entry.mood === 'great' || entry.mood === 'good' 
              ? " Keep up the positive momentum by maintaining your healthy habits."
              : entry.mood === 'bad' || entry.mood === 'terrible'
                ? " Consider taking some time for self-care activities like meditation or a short walk to improve your mood."
                : " Try to identify what factors contributed to your day and how you might improve tomorrow."}
          </Text>
          
          <Text style={styles.aiInsightText}>
            {entry.tags.includes('workout') 
              ? "Great job on your workout! Regular exercise is linked to improved mood and energy levels."
              : entry.tags.includes('stress')
                ? "I notice you mentioned stress. Try deep breathing exercises or mindfulness to help manage stress levels."
                : entry.tags.includes('sleep')
                  ? "Sleep quality has a significant impact on overall health. Aim for 7-8 hours of quality sleep each night."
                  : "Remember that consistency in healthy habits leads to long-term wellbeing improvements."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 6,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  moodBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  moodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  tagsIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tags: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 12,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  aiInsightContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  aiInsightText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  editContainer: {
    marginBottom: 24,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  editTagsInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});