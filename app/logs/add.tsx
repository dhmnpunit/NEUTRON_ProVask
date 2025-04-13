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
  Modal,
  Dimensions,
  StatusBar
} from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, shadows, fonts, componentStyles, iconSizes } from '@/constants/design';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { 
  ChevronLeftIcon, 
  CheckIcon, 
  XMarkIcon, 
  TagIcon,
  ChevronDownIcon,
  PlusIcon,
  CalendarDaysIcon
} from 'react-native-heroicons/outline';
import { SparklesIcon } from 'react-native-heroicons/solid';
import { addJournalEntry } from '@/services/journalService';
import { MoodType, HealthMetrics } from '@/types/health';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ActionButton } from '@/components/ActionButton';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { ChevronLeft } from 'lucide-react-native';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

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
  const [entryDate, setEntryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    sleep_quality: 4,
    mental_clarity: 4,
    energy_level: 4,
    exercise_minutes: 0,
    water_glasses: 0,
    sleep_hours: 7
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
        symptoms,
        created_at: entryDate.toISOString()
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/logs');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to save journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const handleSelectSymptom = (symptom: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
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
      }, 300);
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
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setMood(moodType);
      }}
    >
      <Text style={styles.moodEmoji}>{emoji}</Text>
      <Text style={[
        styles.moodLabel,
        mood === moodType && styles.moodLabelSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderNumberOption = (
    value: number,
    currentValue: number,
    onSelect: (value: number) => void
  ) => (
    <TouchableOpacity 
      style={[
        styles.numberOption, 
        currentValue === value && styles.numberOptionSelected
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect(value);
      }}
    >
      <Text style={[
        styles.numberValue,
        currentValue === value && styles.numberValueSelected
      ]}>
        {value}
      </Text>
      <Text style={[
        styles.moodLabel,
        currentValue === value && styles.moodLabelSelected
      ]}>
        {value === 1 ? 'Low' : value === 4 ? 'Mid' : value === 7 ? 'High' : ''}
      </Text>
    </TouchableOpacity>
  );

  const renderMetricSelector = (
    label: string,
    value: number,
    onSelect: (value: number) => void,
    accentColor?: string
  ) => (
    <View style={styles.metricContainer}>
      <View style={styles.metricLabelContainer}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}/7</Text>
      </View>
      <View style={styles.sliderContainer}>
        {[1,2,3,4,5,6,7].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.numberOptionSmall,
              value === num && styles.smallOptionSelected
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(num);
            }}
          >
            <Text style={[
              styles.numberValueSmall,
              value === num && styles.smallValueSelected
            ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setEntryDate(selectedDate);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <ChevronLeft size={iconSizes.medium} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Journal Entry</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.headerDateButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowDatePicker(true);
            }}
          >
            <Text style={styles.headerDateText}>
              {format(entryDate, 'MMM d, yyyy')}
            </Text>
            <CalendarDaysIcon size={20} color={colors.primary} style={styles.headerDateIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <ScrollView style={styles.scrollView}>
          <Text style={styles.sectionTitle}>Mood</Text>
          <View style={styles.moodContainer}>
            {renderMoodOption('terrible', '😫', 'Terrible')}
            {renderMoodOption('bad', '🙁', 'Bad')}
            {renderMoodOption('neutral', '😐', 'Neutral')}
            {renderMoodOption('good', '🙂', 'Good')}
            {renderMoodOption('great', '😄', 'Great')}
          </View>

          <Text style={styles.sectionTitle}>Journal Entry</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Write about your day, health, thoughts..."
            placeholderTextColor={colors.textTertiary}
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />

          <Text style={styles.sectionTitle}>Health Metrics</Text>
          
          {renderMetricSelector(
            'Sleep Quality',
            healthMetrics.sleep_quality,
            (value) => setHealthMetrics({...healthMetrics, sleep_quality: value}),
            colors.sleep
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

          <View style={styles.metricContainer}>
            <View style={styles.metricLabelContainer}>
              <Text style={styles.metricLabel}>Sleep Time (hours)</Text>
              <Text style={styles.metricValue}>{(healthMetrics.sleep_hours ?? 7).toFixed(1)} hrs</Text>
            </View>
            
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={[
                  styles.stepperButton, 
                  (healthMetrics.sleep_hours ?? 7) <= 1 && styles.stepperButtonDisabled
                ]}
                onPress={() => {
                  const currentHours = healthMetrics.sleep_hours ?? 7;
                  if (currentHours > 1) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setHealthMetrics({...healthMetrics, sleep_hours: currentHours - 0.5});
                  }
                }}
                disabled={(healthMetrics.sleep_hours ?? 7) <= 1}
              >
                <Text style={[
                  styles.stepperButtonText,
                  (healthMetrics.sleep_hours ?? 7) <= 1 && styles.stepperButtonTextDisabled
                ]}>-</Text>
              </TouchableOpacity>
              
              <View style={styles.stepperValueContainer}>
                <Text style={styles.stepperValue}>{(healthMetrics.sleep_hours ?? 7).toFixed(1)}</Text>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  (healthMetrics.sleep_hours ?? 7) >= 12 && styles.stepperButtonDisabled
                ]}
                onPress={() => {
                  const currentHours = healthMetrics.sleep_hours ?? 7;
                  if (currentHours < 12) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setHealthMetrics({...healthMetrics, sleep_hours: currentHours + 0.5});
                  }
                }}
                disabled={(healthMetrics.sleep_hours ?? 7) >= 12}
              >
                <Text style={[
                  styles.stepperButtonText,
                  (healthMetrics.sleep_hours ?? 7) >= 12 && styles.stepperButtonTextDisabled
                ]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.metricContainer}>
            <View style={styles.metricLabelContainer}>
              <Text style={styles.metricLabel}>Exercise (minutes)</Text>
              <Text style={styles.metricValue}>{healthMetrics.exercise_minutes} mins</Text>
            </View>
            
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={[
                  styles.stepperButton, 
                  healthMetrics.exercise_minutes <= 0 && styles.stepperButtonDisabled
                ]}
                onPress={() => {
                  if (healthMetrics.exercise_minutes > 0) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setHealthMetrics({...healthMetrics, exercise_minutes: healthMetrics.exercise_minutes - 5});
                  }
                }}
                disabled={healthMetrics.exercise_minutes <= 0}
              >
                <Text style={[
                  styles.stepperButtonText,
                  healthMetrics.exercise_minutes <= 0 && styles.stepperButtonTextDisabled
                ]}>-</Text>
              </TouchableOpacity>
              
              <View style={styles.stepperValueContainer}>
                <Text style={styles.stepperValue}>{healthMetrics.exercise_minutes}</Text>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  healthMetrics.exercise_minutes >= 120 && styles.stepperButtonDisabled
                ]}
                onPress={() => {
                  if (healthMetrics.exercise_minutes < 120) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setHealthMetrics({...healthMetrics, exercise_minutes: healthMetrics.exercise_minutes + 5});
                  }
                }}
                disabled={healthMetrics.exercise_minutes >= 120}
              >
                <Text style={[
                  styles.stepperButtonText,
                  healthMetrics.exercise_minutes >= 120 && styles.stepperButtonTextDisabled
                ]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.metricContainer}>
            <View style={styles.metricLabelContainer}>
              <Text style={styles.metricLabel}>Water (glasses)</Text>
              <Text style={styles.metricValue}>{healthMetrics.water_glasses} glasses</Text>
            </View>
            
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  healthMetrics.water_glasses <= 0 && styles.stepperButtonDisabled
                ]}
                onPress={() => {
                  if (healthMetrics.water_glasses > 0) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setHealthMetrics({...healthMetrics, water_glasses: healthMetrics.water_glasses - 1});
                  }
                }}
                disabled={healthMetrics.water_glasses <= 0}
              >
                <Text style={[
                  styles.stepperButtonText,
                  healthMetrics.water_glasses <= 0 && styles.stepperButtonTextDisabled
                ]}>-</Text>
              </TouchableOpacity>
              
              <View style={styles.stepperValueContainer}>
                <Text style={styles.stepperValue}>{healthMetrics.water_glasses}</Text>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  healthMetrics.water_glasses >= 12 && styles.stepperButtonDisabled
                ]}
                onPress={() => {
                  if (healthMetrics.water_glasses < 12) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setHealthMetrics({...healthMetrics, water_glasses: healthMetrics.water_glasses + 1});
                  }
                }}
                disabled={healthMetrics.water_glasses >= 12}
              >
                <Text style={[
                  styles.stepperButtonText,
                  healthMetrics.water_glasses >= 12 && styles.stepperButtonTextDisabled
                ]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Symptoms (if any)</Text>
          <TouchableOpacity 
            style={styles.symptomPickerButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowSymptomPicker(true);
            }}
          >
            <Text style={styles.symptomPickerText}>Select Symptom</Text>
            <PlusIcon size={20} color={colors.primary} />
          </TouchableOpacity>

          {symptoms.length > 0 ? (
            <View style={styles.tagsContainer}>
              {symptoms.map((symptom, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{symptom}</Text>
                  <TouchableOpacity 
                    onPress={() => removeSymptom(symptom)}
                    style={styles.tagRemoveButton}
                  >
                    <XMarkIcon size={14} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noSymptomsText}>No symptoms selected</Text>
          )}
        </ScrollView>

        <BlurView intensity={80} style={styles.footer}>
          <PrimaryButton
            title="Save Journal Entry"
            onPress={handleSaveEntry}
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            icon={<CheckIcon size={20} color="#FFFFFF" style={{ marginRight: spacing.sm }} />}
          />
        </BlurView>
      </KeyboardAvoidingView>

      {/* Date picker for iOS or Android */}
      {showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerModalContent}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity 
                  onPress={() => setShowDatePicker(false)}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.datePickerCancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Select Date</Text>
                <TouchableOpacity 
                  onPress={() => setShowDatePicker(false)}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.datePickerDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.simpleDatePicker}>
                <Text style={styles.currentDateText}>{format(entryDate, 'MMMM d, yyyy')}</Text>
                
                <View style={styles.dateButtonsRow}>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                      const yesterday = new Date(entryDate);
                      yesterday.setDate(yesterday.getDate() - 1);
                      setEntryDate(yesterday);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={styles.dateButtonText}>Yesterday</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                      setEntryDate(new Date());
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={styles.dateButtonText}>Today</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.dateButtonsRow}>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                      const lastWeek = new Date(entryDate);
                      lastWeek.setDate(lastWeek.getDate() - 7);
                      setEntryDate(lastWeek);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={styles.dateButtonText}>Last Week</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                      const lastMonth = new Date(entryDate);
                      lastMonth.setMonth(lastMonth.getMonth() - 1);
                      setEntryDate(lastMonth);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={styles.dateButtonText}>Last Month</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        visible={showSymptomPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSymptomPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={typography.h3}>Select Symptom</Text>
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
                  <CheckIcon 
                    size={20} 
                    color={symptoms.includes(symptom) ? colors.primary : 'transparent'} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight || 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    height: 56,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: radius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${colors.border}40`,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
    marginLeft: spacing.sm,
    fontWeight: 'normal',
    fontFamily: fonts.regular,
  },
  card: {
    ...componentStyles.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
  },
  sectionTitle: {
    ...typography.label,
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  moodOption: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.small,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    marginHorizontal: spacing.xs / 2,
  },
  moodOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  moodLabelSelected: {
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  numberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numberOption: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.small,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    marginHorizontal: spacing.xs / 2,
  },
  numberOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  numberValue: {
    fontSize: 20,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  numberValueSelected: {
    color: colors.primary,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.medium,
    padding: spacing.md,
    minHeight: 120,
    color: colors.text,
    fontSize: 16,
    backgroundColor: colors.background,
  },
  metricContainer: {
    marginBottom: spacing.lg,
  },
  metricLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metricLabel: {
    ...typography.body,
    color: colors.text,
    fontFamily: fonts.medium,
  },
  metricValue: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseOption: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: radius.small,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    marginHorizontal: spacing.xs / 2,
    height: 40,
  },
  exerciseOptionSelected: {
    borderColor: colors.activity,
    backgroundColor: colors.activityLight,
  },
  exerciseText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  exerciseTextSelected: {
    color: colors.activity,
    fontFamily: fonts.medium,
  },
  waterOption: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: radius.small,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    marginHorizontal: spacing.xs / 2,
    height: 40,
  },
  waterOptionSelected: {
    borderColor: colors.water,
    backgroundColor: colors.waterLight,
  },
  waterText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  waterTextSelected: {
    color: colors.water,
    fontFamily: fonts.medium,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xl,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.small,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: spacing.xs,
    fontFamily: fonts.medium,
  },
  tagRemoveButton: {
    padding: 2,
  },
  noSymptomsText: {
    ...typography.caption,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  symptomPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.medium,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  symptomPickerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.large,
    borderTopRightRadius: radius.large,
    maxHeight: '70%',
    ...shadows.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalCloseButton: {
    padding: spacing.xs,
  },
  modalScroll: {
    padding: spacing.md,
  },
  symptomOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  symptomOptionText: {
    ...typography.body,
    color: colors.text,
  },
  numberOptionSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: radius.small,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    marginHorizontal: spacing.xs / 2,
    height: 40,
  },
  numberValueSmall: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  smallValueSelected: {
    color: colors.primary,
  },
  smallOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.medium,
    overflow: 'hidden',
    marginHorizontal: spacing.xs,
    height: 46,
  },
  stepperButton: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperValueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: '100%',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  stepperValue: {
    fontSize: 18,
    color: colors.text,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  stepperButtonText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stepperButtonDisabled: {
    backgroundColor: colors.border,
  },
  stepperButtonTextDisabled: {
    color: colors.textTertiary,
  },
  headerDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.medium,
    backgroundColor: `${colors.primary}10`,
  },
  headerDateText: {
    ...typography.body,
    color: colors.primary,
    fontSize: 14,
  },
  headerDateIcon: {
    marginLeft: spacing.xs,
  },
  datePickerModalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.large,
    borderTopRightRadius: radius.large,
    maxHeight: '70%',
    ...shadows.medium,
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  datePickerCancelText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  datePickerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  datePickerDoneText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  datePickerIOS: {
    width: 320,
    height: 260,
  },
  datePickerContainerIOS: {
    padding: spacing.md,
  },
  simpleDatePicker: {
    padding: spacing.lg,
  },
  currentDateText: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  dateButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    width: '100%',
  },
  dateButton: {
    padding: spacing.md,
    borderRadius: radius.medium,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  dateButtonText: {
    ...typography.body,
    color: colors.primary,
    fontFamily: fonts.medium,
  },
});