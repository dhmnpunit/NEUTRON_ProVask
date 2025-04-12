import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated } from 'react-native';
import { colors } from '@/constants/colors';
import { X, Tag, Droplet, Moon, Dumbbell } from 'lucide-react-native';
import { typography, spacing, radius, shadows, iconSizes } from '@/constants/design';
import { Divider, GradientCard, CardPattern } from './VisualEnhancements';

interface LogCardProps {
  title: string;
  subtitle?: string;
  content?: string;
  symptoms?: string[];
  icon?: React.ReactNode;
  feeling?: string;
  feelingEmoji?: string;
  metrics?: {
    water?: number;
    sleep?: number;
    exercise?: number;
  };
  onPress?: () => void;
  onDelete?: () => void;
  date?: string;
  tags?: string[];
}

export const LogCard: React.FC<LogCardProps> = ({
  title,
  subtitle,
  content,
  symptoms,
  icon,
  feeling,
  feelingEmoji,
  metrics,
  onPress,
  onDelete,
  date,
  tags
}) => {
  // Animation refs
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  
  // Format the date if provided
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    
    return { day, month };
  };
  
  const formattedDate = formatDate(date);
  
  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim
        }
      ]}
    >
      <Pressable 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <GradientCard 
          style={styles.card}
          startColor={feeling ? `${getMoodColor(feeling)}15` : `${colors.primaryLight}20`}
          endColor={colors.card}
        >
          <CardPattern patternColor={`${colors.primary}08`} />
          <View style={styles.contentContainer}>
            {/* Date display */}
            {formattedDate && (
              <View style={styles.dateContainer}>
                <Text style={styles.dateDay}>{formattedDate.day}</Text>
                <Text style={styles.dateMonth}>{formattedDate.month}</Text>
              </View>
            )}
            
            {/* Main content */}
            <View style={styles.contentMiddle}>
              {/* Title and content */}
              <View>
                <Text style={styles.logContent} numberOfLines={2}>
                  {content || title}
                </Text>
                
                {symptoms && symptoms.length > 0 && (
                  <Text style={styles.symptomsText}>
                    <Text style={{fontWeight: '500'}}>Symptoms: </Text>
                    {symptoms.join(', ')}
                  </Text>
                )}
                
                {/* Tags */}
                {tags && tags.length > 0 && (
                  <View style={styles.tagsRow}>
                    {tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              
              {/* Delete button */}
              {onDelete && (
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={onDelete}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <X size={iconSizes.small} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Right side metrics */}
            <View style={styles.metricsContainer}>
              {feelingEmoji && (
                <View style={styles.metricBadge}>
                  <Text style={styles.emojiText}>{feelingEmoji}</Text>
                </View>
              )}
              
              {/* Health metrics in a row */}
              {(metrics?.water || metrics?.sleep || metrics?.exercise) && (
                <View style={styles.metricsRow}>
                  {metrics?.water && (
                    <View style={styles.metricItem}>
                      <Droplet size={14} color={colors.info} />
                      <Text style={[styles.metricValue, { color: colors.info }]}>{metrics.water}</Text>
                    </View>
                  )}
                  
                  {metrics?.sleep && (
                    <View style={styles.metricItem}>
                      <Moon size={14} color={colors.success} />
                      <Text style={[styles.metricValue, { color: colors.success }]}>{metrics.sleep}</Text>
                    </View>
                  )}
                  
                  {metrics?.exercise && (
                    <View style={styles.metricItem}>
                      <Dumbbell size={14} color={colors.warning} />
                      <Text style={[styles.metricValue, { color: colors.warning }]}>{metrics.exercise}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </GradientCard>
      </Pressable>
    </Animated.View>
  );
};

// Helper function to get mood colors
const getMoodColor = (mood: string): string => {
  switch (mood.toLowerCase()) {
    case 'great':
    case 'happy':
      return colors.success;
    case 'good':
      return colors.info;
    case 'neutral':
      return colors.textTertiary;
    case 'bad':
    case 'sad':
      return colors.warning;
    case 'terrible':
    case 'angry':
      return colors.danger;
    default:
      return colors.textTertiary;
  }
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    borderRadius: radius.medium,
    ...shadows.small,
  },
  card: {
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  dateContainer: {
    backgroundColor: `${colors.background}90`,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.small,
    minWidth: 40,
    borderWidth: 1,
    borderColor: `${colors.border}80`,
  },
  dateDay: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: typography.h3.color,
    letterSpacing: -0.3,
  },
  dateMonth: {
    fontSize: typography.caption.fontSize,
    color: typography.caption.color,
    textTransform: 'uppercase',
    letterSpacing: 0.1,
  },
  contentMiddle: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  logContent: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: typography.body.color,
    marginBottom: spacing.xs / 2,
  },
  symptomsText: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: spacing.xs,
    backgroundColor: `${colors.border}40`,
    borderRadius: radius.circle,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    backgroundColor: `${colors.primaryLight}40`,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 4,
    borderRadius: radius.small,
  },
  tagText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.primary,
    letterSpacing: 0.1,
  },
  metricsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: spacing.xs,
  },
  metricBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primaryLight}30`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emojiText: {
    fontSize: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: `${colors.background}80`,
    borderRadius: radius.small,
    padding: spacing.xs / 2,
    borderWidth: 1,
    borderColor: `${colors.border}50`,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xs / 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
});