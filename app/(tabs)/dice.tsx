import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing
} from 'react-native';
import { colors } from '@/constants/colors';
import { useHealthStore } from '@/store/health-store';
import { Dice5, ThumbsUp, ThumbsDown } from 'lucide-react-native';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function DiceScreen() {
  const { 
    currentChallenge, 
    rollNewChallenge, 
    completeChallenge,
    userProfile
  } = useHealthStore();
  
  const [isRolling, setIsRolling] = useState(false);
  const spinValue = new Animated.Value(0);
  
  // Roll animation
  const startRollAnimation = () => {
    setIsRolling(true);
    
    // Trigger haptic feedback on native platforms
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start(() => {
      setIsRolling(false);
      rollNewChallenge();
    });
  };
  
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });
  
  const handleCompleteChallenge = () => {
    completeChallenge();
    
    // Trigger haptic feedback on native platforms
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const handleSkipChallenge = () => {
    // Just roll a new challenge
    rollNewChallenge();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>health dice</Text>
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>{userProfile.streak} day streak 🔥</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        {currentChallenge ? (
          <View style={styles.challengeCard}>
            <Text style={styles.challengeTitle}>{currentChallenge.title}</Text>
            <Text style={styles.challengeDescription}>{currentChallenge.description}</Text>
            
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>
                {currentChallenge.difficulty} challenge
              </Text>
            </View>
            
            <View style={styles.challengeActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleSkipChallenge}
              >
                <ThumbsDown size={20} color={colors.textSecondary} />
                <Text style={styles.actionButtonText}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]}
                onPress={handleCompleteChallenge}
              >
                <ThumbsUp size={20} color="#FFFFFF" />
                <Text style={styles.completeButtonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Roll the dice</Text>
            <Text style={styles.emptyText}>
              Get a random health challenge to improve your wellbeing
            </Text>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.diceButton}
          onPress={startRollAnimation}
          disabled={isRolling}
        >
          <Animated.View
            style={[
              styles.diceIconContainer,
              { transform: [{ rotate: spin }] }
            ]}
          >
            <Dice5 size={32} color="#FFFFFF" />
          </Animated.View>
          <Text style={styles.diceButtonText}>
            {isRolling ? 'Rolling...' : 'Roll for Challenge'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.coinsContainer}>
          <Text style={styles.coinsText}>
            You have {userProfile.healthCoins} health coins 💰
          </Text>
        </View>
      </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  streakContainer: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  challengeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  challengeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.cardLight,
    flex: 1,
    marginHorizontal: 6,
  },
  completeButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  diceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  diceIconContainer: {
    marginRight: 12,
  },
  diceButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  coinsContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  coinsText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});