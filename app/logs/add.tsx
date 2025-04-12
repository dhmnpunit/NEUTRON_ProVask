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
  Platform,
  Modal
} from 'react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useRouter, Stack } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { ChevronLeftIcon, CheckIcon, XMarkIcon, PlusIcon, TagIcon, ChevronDownIcon } from 'react-native-heroicons/outline';
import { addJournalEntry } from '@/services/journalService';
import { MoodType, HealthMetrics } from '@/types/health';
import { ActionButton } from '@/components/ActionButton';

const COMMON_SYMPTOMS = [
  'Headache',
  'Fatigue',
  'Nausea',
  'Dizziness',
  'Muscle Pain',
  'Joint Pain',
  'Fever',
  'Cough',
  'Sore Throat',
  'Other'
];

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
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [showSymptomPicker, setShowSymptomPicker] = useState(false);

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

  const removeSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const handleSelectSymptom = (symptom: string) => {
    if (symptom === 'Other') {
      setShowSymptomPicker(false);
      setTimeout(() => {
        Alert.prompt(
          'Add Other Symptom',
          'Please enter your symptom',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Add',
              onPress: (text) => {
                if (text && !symptoms.includes(text)) {
                  setSymptoms([...symptoms, text]);
                }
              }
            }
          ]
        );
      }, 500);
    } else if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
    setShowSymptomPicker(false);
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

  const renderNumberOption = (
    value: number,
    currentValue: number,
    onSelect: (value: number) => void
  ) => (
    <TouchableOpacity 
      style={[
        styles.moodOption, 
        currentValue === value && styles.moodOptionSelected
      ]}
      onPress={() => onSelect(value)}
    >
      <Text style={[
        styles.numberValue,
        currentValue === value && styles.numberValueSelected
      ]}>
        {value}
      </Text>
      <Text style={styles.moodLabel}>
        {value === 1 ? 'Poor' : value === 5 ? 'Great' : ''}
      </Text>
    </TouchableOpacity>
  );

  const renderMetricSelector = (
    label: string,
    value: number,
    onSelect: (value: number) => void
  ) => (
    <View style={styles.metricContainer}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.moodContainer}>
        {[1,2,3,4,5].map((num) => (
          <React.Fragment key={num}>
            {renderNumberOption(num, value, onSelect)}
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenWrapper>
      <Stack.Screen 
        options={{
          title: "new journal entry",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }} 
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
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
            
            {renderMetricSelector(
              'Sleep Quality',
              healthMetrics.sleep_quality,
              (value) => setHealthMetrics({...healthMetrics, sleep_quality: value})
            )}

            {renderMetricSelector(
              'Mental Clarity',
              healthMetrics.mental_clarity,
              (value) => setHealthMetrics({...healthMetrics, mental_clarity: value})
            )}

            {renderMetricSelector(
              'Energy Level',
              healthMetrics.energy_level,
              (value) => setHealthMetrics({...healthMetrics, energy_level: value})
            )}

            {renderMetricSelector(
              'Exercise (minutes)',
              Math.floor(healthMetrics.exercise_minutes / 10),
              (value) => setHealthMetrics({...healthMetrics, exercise_minutes: value * 10})
            )}

            {renderMetricSelector(
              'Water (glasses)',
              healthMetrics.water_glasses,
              (value) => setHealthMetrics({...healthMetrics, water_glasses: value})
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Symptoms (if any)</Text>
            <TouchableOpacity 
              style={styles.symptomPickerButton}
              onPress={() => setShowSymptomPicker(true)}
            >
              <Text style={styles.symptomPickerText}>Select Symptom</Text>
              <ChevronDownIcon size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.tagsContainer}>
              {symptoms.map((symptom, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{symptom}</Text>
                  <TouchableOpacity onPress={() => removeSymptom(symptom)}>
                    <XMarkIcon size={14} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <ActionButton
            title="Save Entry"
            onPress={handleSaveEntry}
            primary
            fullWidth
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showSymptomPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSymptomPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Symptom</Text>
              <TouchableOpacity 
                onPress={() => setShowSymptomPicker(false)}
                style={styles.modalCloseButton}
              >
                <XMarkIcon size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {COMMON_SYMPTOMS.map((symptom) => (
                <TouchableOpacity
                  key={symptom}
                  style={styles.symptomOption}
                  onPress={() => handleSelectSymptom(symptom)}
                >
                  <Text style={styles.symptomOptionText}>{symptom}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
  numberValue: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  numberValueSelected: {
    color: colors.primary,
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
  metricContainer: {
    marginBottom: 20,
  },
  metricLabel: {
    fontSize: 16,
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
  tagText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  symptomPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  symptomPickerText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScroll: {
    padding: 16,
  },
  symptomOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  symptomOptionText: {
    fontSize: 16,
    color: colors.text,
  },
});