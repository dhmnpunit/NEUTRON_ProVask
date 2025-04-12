import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { ChevronLeft, Check, X, Plus, Tag } from 'lucide-react-native';
import { addJournalEntry } from '@/services/journalService';
import { MoodType, HealthMetrics } from '@/types/health';
import Slider from '@react-native-community/slider';

export default function AddJournalEntryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Journal entry state
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType | undefined>(undefined);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    sleep_quality: 5,
    mental_clarity: 5,
    energy_level: 5,
    exercise_minutes: 0,
    water_glasses: 0
  });
  const [tags, setTags] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newSymptom, setNewSymptom] = useState('');

  const handleSaveEntry = async () => {
    if (!content) {
      Alert.alert('Error', 'Please enter some content for your journal entry');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to save an entry');
      return;
    }

    try {
      setLoading(true);
      await addJournalEntry({
        user_id: user.id,
        content,
        mood,
        health_metrics: healthMetrics,
        tags,
        symptoms
      });
      
      router.replace('/logs');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addSymptom = () => {
    if (newSymptom.trim() && !symptoms.includes(newSymptom.trim())) {
      setSymptoms([...symptoms, newSymptom.trim()]);
      setNewSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const renderMoodOption = (moodType: MoodType, emoji: string, label: string) => (
    <TouchableOpacity 
      style={[
        styles.moodOption, 
        mood === moodType && styles.moodOptionSelected
      ]}
      onPress={() => setMood(moodType)}
    >
      <Text style={styles.moodEmoji}>{emoji}</Text>
      <Text style={styles.moodLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>new journal entry</Text>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveEntry}
            disabled={loading}
          >
            <Check size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How are you feeling today?</Text>
            <View style={styles.moodContainer}>
              {renderMoodOption('terrible', '😫', 'Terrible')}
              {renderMoodOption('bad', '🙁', 'Bad')}
              {renderMoodOption('neutral', '😐', 'Neutral')}
              {renderMoodOption('good', '🙂', 'Good')}
              {renderMoodOption('great', '😄', 'Great')}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Journal Entry</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Write about your day, health, thoughts..."
              placeholderTextColor={colors.textTertiary}
              multiline
              value={content}
              onChangeText={setContent}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Metrics</Text>
            
            <Text style={styles.metricLabel}>
              Sleep Quality: {healthMetrics.sleep_quality}/10
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={healthMetrics.sleep_quality}
              onValueChange={(value: number) => 
                setHealthMetrics({...healthMetrics, sleep_quality: value})
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
            />

            <Text style={styles.metricLabel}>
              Mental Clarity: {healthMetrics.mental_clarity}/10
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={healthMetrics.mental_clarity}
              onValueChange={(value: number) => 
                setHealthMetrics({...healthMetrics, mental_clarity: value})
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
            />

            <Text style={styles.metricLabel}>
              Energy Level: {healthMetrics.energy_level}/10
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={healthMetrics.energy_level}
              onValueChange={(value: number) => 
                setHealthMetrics({...healthMetrics, energy_level: value})
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
            />

            <Text style={styles.metricLabel}>
              Exercise (minutes): {healthMetrics.exercise_minutes}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={120}
              step={5}
              value={healthMetrics.exercise_minutes}
              onValueChange={(value: number) => 
                setHealthMetrics({...healthMetrics, exercise_minutes: value})
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
            />

            <Text style={styles.metricLabel}>
              Water (glasses): {healthMetrics.water_glasses}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={12}
              step={1}
              value={healthMetrics.water_glasses}
              onValueChange={(value: number) => 
                setHealthMetrics({...healthMetrics, water_glasses: value})
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a tag (e.g., exercise, nutrition)"
                placeholderTextColor={colors.textTertiary}
                value={newTag}
                onChangeText={setNewTag}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Tag size={14} color={colors.primary} style={styles.tagIcon} />
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <X size={14} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Symptoms (if any)</Text>
            <View style={styles.tagsInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a symptom (e.g., headache, fatigue)"
                placeholderTextColor={colors.textTertiary}
                value={newSymptom}
                onChangeText={setNewSymptom}
                onSubmitEditing={addSymptom}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addSymptom}>
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.tagsContainer}>
              {symptoms.map((symptom, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{symptom}</Text>
                  <TouchableOpacity onPress={() => removeSymptom(symptom)}>
                    <X size={14} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.success,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    width: '18%',
  },
  moodOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    color: colors.text,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  metricLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  tagsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginRight: 4,
  },
});