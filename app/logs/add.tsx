import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { colors } from '@/constants/colors';
import { useHealthStore } from '@/store/health-store';
import { Stack, useRouter } from 'expo-router';
import { MoodType } from '@/types/health';
import { MoodSelector } from '@/components/MoodSelector';
import { RatingSelector } from '@/components/RatingSelector';
import { ActionButton } from '@/components/ActionButton';
import { ChevronLeft } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/ScreenWrapper';

export default function AddJournalEntryScreen() {
  const router = useRouter();
  const { addJournalEntry } = useHealthStore();
  
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('neutral');
  const [sleepQuality, setSleepQuality] = useState(4);
  const [mentalClarity, setMentalClarity] = useState(4);
  const [energyLevel, setEnergyLevel] = useState(4);
  
  const [symptoms, setSymptoms] = useState('');
  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [waterGlasses, setWaterGlasses] = useState('');
  const [hasHeadache, setHasHeadache] = useState(false);
  const [hasBodyPain, setHasBodyPain] = useState(false);
  const [hasFever, setHasFever] = useState(false);
  
  const handleSave = () => {
    if (!content.trim()) {
      return; // Don't save empty entries
    }
    
    const activeSymptoms = [];
    if (hasHeadache) activeSymptoms.push('headache');
    if (hasBodyPain) activeSymptoms.push('body pain');
    if (hasFever) activeSymptoms.push('fever');
    if (symptoms.trim()) activeSymptoms.push(...symptoms.split(',').map(s => s.trim()));
    
    addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      content: content.trim(),
      tags: ['mood', 'sleep', 'energy'].filter(tag => 
        (tag === 'mood' && mood !== 'neutral') ||
        (tag === 'sleep' && sleepQuality !== 4) ||
        (tag === 'energy' && energyLevel !== 4)
      ),
      mood,
      healthMetrics: {
        sleepQuality,
        mentalClarity,
        energyLevel,
        exerciseMinutes: parseInt(exerciseMinutes) || 0,
        waterGlasses: parseInt(waterGlasses) || 0,
      },
      symptoms: activeSymptoms,
    });
    
    router.back();
  };
  
  return (
    <ScreenWrapper>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>log your health</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <MoodSelector value={mood} onChange={setMood} />
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>notes</Text>
          <TextInput
            style={styles.textInput}
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="How are you feeling today? What affected your health?"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Activities</Text>
          
          <View style={styles.metricInput}>
            <Text style={styles.metricLabel}>Exercise (minutes)</Text>
            <TextInput
              style={styles.numberInput}
              value={exerciseMinutes}
              onChangeText={setExerciseMinutes}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.metricInput}>
            <Text style={styles.metricLabel}>Water (glasses)</Text>
            <TextInput
              style={styles.numberInput}
              value={waterGlasses}
              onChangeText={setWaterGlasses}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Symptoms</Text>
          
          <View style={styles.symptomToggle}>
            <Text style={styles.symptomLabel}>Headache</Text>
            <Switch
              value={hasHeadache}
              onValueChange={setHasHeadache}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={styles.symptomToggle}>
            <Text style={styles.symptomLabel}>Body Pain</Text>
            <Switch
              value={hasBodyPain}
              onValueChange={setHasBodyPain}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={styles.symptomToggle}>
            <Text style={styles.symptomLabel}>Fever</Text>
            <Switch
              value={hasFever}
              onValueChange={setHasFever}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Other Symptoms</Text>
            <TextInput
              style={[styles.textInput, { minHeight: 60 }]}
              value={symptoms}
              onChangeText={setSymptoms}
              multiline
              placeholder="Enter any other symptoms, separated by commas"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>
        
        <RatingSelector
          title="sleep quality"
          description="1 = terrible sleep, 7 = best sleep ever"
          value={sleepQuality}
          onChange={setSleepQuality}
        />
        
        <RatingSelector
          title="mental clarity"
          description="1 = brain fog, 7 = laser focused"
          value={mentalClarity}
          onChange={setMentalClarity}
        />
        
        <RatingSelector
          title="energy level"
          description="1 = exhausted, 7 = energized"
          value={energyLevel}
          onChange={setEnergyLevel}
        />
        
        <View style={styles.saveButtonContainer}>
          <ActionButton
            title="Save Health Log"
            onPress={handleSave}
            primary
            fullWidth
          />
        </View>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    color: colors.text,
    textAlignVertical: 'top',
  },
  metricInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 16,
    color: colors.text,
  },
  numberInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: 'center',
    fontSize: 16,
    color: colors.text,
  },
  symptomToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  symptomLabel: {
    fontSize: 16,
    color: colors.text,
  },
  saveButtonContainer: {
    marginBottom: 32,
  },
});