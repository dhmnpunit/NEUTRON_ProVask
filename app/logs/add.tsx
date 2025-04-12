import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  TextInput
} from 'react-native';
import { colors } from '@/constants/colors';
import { useHealthStore } from '@/store/health-store';
import { Stack, useRouter } from 'expo-router';
import { MoodType } from '@/types/health';
import { MoodSelector } from '@/components/MoodSelector';
import { RatingSelector } from '@/components/RatingSelector';
import { ActionButton } from '@/components/ActionButton';
import { ChevronLeft } from 'lucide-react-native';

export default function AddJournalEntryScreen() {
  const router = useRouter();
  const { addJournalEntry } = useHealthStore();
  
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('neutral');
  const [sleepQuality, setSleepQuality] = useState(4);
  const [mentalClarity, setMentalClarity] = useState(4);
  const [energyLevel, setEnergyLevel] = useState(4);
  
  const handleSave = () => {
    if (!content.trim()) {
      return; // Don't save empty entries
    }
    
    // Create new journal entry
    addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      content: content.trim(),
      tags: ['mood', 'sleep', 'energy'].filter(tag => 
        (tag === 'mood' && mood !== 'neutral') ||
        (tag === 'sleep' && sleepQuality !== 4) ||
        (tag === 'energy' && energyLevel !== 4)
      ),
      mood
    });
    
    // Navigate back
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
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
        
        <ActionButton
          title="Save Health Log"
          onPress={handleSave}
          primary
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
});