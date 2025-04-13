import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/design';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ActionButton } from '@/components/ActionButton';
import { useAuth } from '@/context/AuthContext';
import { getJournalEntries } from '@/services/journalService';
import { useHealthStore } from '@/store/health-store';
import { CheckIcon, XMarkIcon, GiftIcon } from 'react-native-heroicons/outline';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default function FlipDiceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { userProfile, updateHealthCoins, addTask, completeTask } = useHealthStore();
  
  const [isFlipping, setIsFlipping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [hasFlipped, setHasFlipped] = useState(false);
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });
  
  const generateChallenge = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get user's journal entries to make personalized suggestions
      const entries = await getJournalEntries(user.id);
      
      // Extract relevant data for personalization
      const healthData = entries.map(entry => ({
        date: entry.created_at,
        mood: entry.mood,
        sleep_quality: entry.health_metrics.sleep_quality,
        energy_level: entry.health_metrics.energy_level,
        water_glasses: entry.health_metrics.water_glasses,
        exercise_minutes: entry.health_metrics.exercise_minutes,
        symptoms: entry.symptoms,
      }));
      
      // Create a prompt for AI to generate a personalized challenge
      const prompt = `
        Based on this user's health data, suggest ONE personalized health challenge or activity that would be beneficial.
        Keep it simple, specific, and achievable in one day.
        
        User's recent health data:
        ${JSON.stringify(healthData)}
        
        Format your response as JSON with these properties:
        - title: a catchy name for the challenge (max 50 chars)
        - description: detailed instructions (max 150 chars)
        - difficulty: "easy", "medium", or "hard"
        - category: "sleep", "hydration", "activity", "nutrition", or "mental"
        - coins: reward amount (10-50 based on difficulty)
        
        Return ONLY the JSON object.
      `;
      
      // Mock API call (in a real app, you'd call your API here)
      // For demo purposes, we'll use a timeout to simulate API call
      setTimeout(() => {
        // Mock example challenges
        const challenges = [
          {
            title: "10-Minute Mindful Break",
            description: "Take a 10-minute break from screens and practice deep breathing or meditation to reset your mental state.",
            difficulty: "easy",
            category: "mental",
            coins: 15
          },
          {
            title: "Hydration Boost",
            description: "Drink 3 extra glasses of water today, spaced evenly throughout your day.",
            difficulty: "easy", 
            category: "hydration",
            coins: 10
          },
          {
            title: "Power Walk Challenge",
            description: "Take a brisk 20-minute walk outdoors and notice 5 things you find beautiful or interesting.",
            difficulty: "medium",
            category: "activity",
            coins: 25
          },
          {
            title: "Early Sleep Experiment",
            description: "Go to bed 30 minutes earlier than usual tonight and note how you feel tomorrow morning.",
            difficulty: "medium",
            category: "sleep",
            coins: 20
          },
          {
            title: "Nutrient-Dense Meal",
            description: "Prepare one meal with at least 4 different colored vegetables or fruits.",
            difficulty: "medium",
            category: "nutrition",
            coins: 30
          }
        ];
        
        // Select a random challenge from the array
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        
        setChallenge(randomChallenge);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error generating challenge:', error);
      setIsLoading(false);
    }
  };
  
  const handleFlipDice = () => {
    setIsFlipping(true);
    
    // Start animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          delay: 600,
          duration: 300,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsFlipping(false);
      rotateAnim.setValue(0);
      setHasFlipped(true);
      generateChallenge();
    });
  };
  
  const handleAccept = () => {
    if (!challenge) return;
    
    // Add task to the user's tasks
    addTask({
      id: Date.now().toString(),
      title: challenge.title,
      description: challenge.description,
      completed: false,
      coins: challenge.coins,
      category: challenge.category,
      createdAt: new Date().toISOString(),
    });
    
    // Reset challenge state so user can flip again
    setChallenge(null);
    setHasFlipped(false);
    
    // Show success message or navigate
    router.push('/');
  };
  
  const handleSkip = () => {
    // Reset and allow to flip again
    setChallenge(null);
    setHasFlipped(false);
  };
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'sleep': return colors.sleep || '#6C63FF';
      case 'hydration': return colors.water || '#63C0FF';
      case 'activity': return colors.activity || '#FF6363';
      case 'nutrition': return colors.nutrition || '#63FF7C';
      case 'mental': return colors.mood || '#FFD763';
      default: return colors.primary;
    }
  };
  
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Flip the Dice</Text>
        <Text style={styles.subtitle}>
          Get a personalized health challenge based on your data
        </Text>
        
        {!hasFlipped ? (
          <View style={styles.diceContainer}>
            <Animated.View
              style={[
                styles.dice,
                {
                  transform: [
                    { rotate },
                    { scale: scaleAnim },
                  ],
                },
              ]}
            >
              <Text style={styles.diceEmoji}>🎲</Text>
            </Animated.View>
            
            <PrimaryButton
              title="Flip the Dice"
              onPress={handleFlipDice}
              disabled={isFlipping}
              style={styles.flipButton}
            />
          </View>
        ) : (
          <View style={styles.challengeContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Generating your challenge...</Text>
              </View>
            ) : challenge ? (
              <>
                <View 
                  style={[
                    styles.challengeCard, 
                    { borderLeftColor: getCategoryColor(challenge.category) }
                  ]}
                >
                  <View style={styles.challengeHeader}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <View style={[
                      styles.difficultyBadge, 
                      { 
                        backgroundColor: 
                          challenge.difficulty === 'easy' ? '#63FF7C' : 
                          challenge.difficulty === 'medium' ? '#FFD763' : 
                          '#FF6363' 
                      }
                    ]}>
                      <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.challengeDescription}>{challenge.description}</Text>
                  
                  <View style={styles.rewardContainer}>
                    <GiftIcon size={20} color={colors.primary} />
                    <Text style={styles.rewardText}>
                      Reward: <Text style={styles.coinsText}>{challenge.coins} health coins</Text>
                    </Text>
                  </View>
                </View>
                
                <View style={styles.actionButtons}>
                  <ActionButton
                    title="Accept"
                    onPress={handleAccept}
                    icon={<CheckIcon size={18} color="#FFFFFF" />}
                    primary
                    style={styles.actionButton}
                  />
                  <ActionButton
                    title="Skip"
                    onPress={handleSkip}
                    icon={<XMarkIcon size={18} color={colors.textSecondary} />}
                    style={[styles.actionButton, styles.skipButton]}
                  />
                </View>
              </>
            ) : null}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  diceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  dice: {
    width: 150,
    height: 150,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceEmoji: {
    fontSize: 100,
  },
  flipButton: {
    minWidth: 200,
  },
  challengeContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  challengeCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontFamily: fonts.headingSemiBold,
    fontSize: 18,
    color: colors.text,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  difficultyText: {
    fontFamily: fonts.headingMedium,
    fontSize: 12,
    color: colors.text,
  },
  challengeDescription: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  coinsText: {
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
}); 