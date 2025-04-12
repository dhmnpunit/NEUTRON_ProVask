import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { HealthChallenge } from '@/types/health';
import { Dumbbell, Brain, Apple, Moon } from 'lucide-react-native';

interface HealthChallengeCardProps {
  challenge: HealthChallenge;
  onComplete: () => void;
  onSkip: () => void;
}

export const HealthChallengeCard: React.FC<HealthChallengeCardProps> = ({
  challenge,
  onComplete,
  onSkip,
}) => {
  const getCategoryIcon = () => {
    switch (challenge.category) {
      case 'fitness':
        return <Dumbbell size={24} color="#fff" />;
      case 'mental':
        return <Brain size={24} color="#fff" />;
      case 'nutrition':
        return <Apple size={24} color="#fff" />;
      case 'sleep':
        return <Moon size={24} color="#fff" />;
      default:
        return <Dumbbell size={24} color="#fff" />;
    }
  };
  
  const getCategoryColor = () => {
    switch (challenge.category) {
      case 'fitness':
        return colors.activity;
      case 'mental':
        return colors.mood;
      case 'nutrition':
        return colors.nutrition;
      case 'sleep':
        return colors.sleep;
      default:
        return colors.primary;
    }
  };
  
  const getDifficultyColor = () => {
    switch (challenge.difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
        {getCategoryIcon()}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{challenge.title}</Text>
          <View style={[
            styles.difficultyBadge, 
            { backgroundColor: getDifficultyColor() + '20' }
          ]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
              {challenge.difficulty}
            </Text>
          </View>
        </View>
        
        <Text style={styles.description}>{challenge.description}</Text>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.completeButton]} 
            onPress={onComplete}
          >
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.skipButton]} 
            onPress={onSkip}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryBadge: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  skipButton: {
    backgroundColor: colors.divider,
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
});