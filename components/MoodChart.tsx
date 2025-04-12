import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { MoodData } from '@/types/health';

interface MoodChartProps {
  data: MoodData[];
  title: string;
  subtitle: string;
}

const getMoodEmoji = (mood: string): string => {
  switch (mood) {
    case 'great': return '😄';
    case 'good': return '🙂';
    case 'neutral': return '😐';
    case 'bad': return '🙁';
    case 'terrible': return '😫';
    default: return '😐';
  }
};

const getMoodColor = (mood: string): string => {
  switch (mood) {
    case 'great': return colors.success;
    case 'good': return colors.primary;
    case 'neutral': return colors.textTertiary;
    case 'bad': return colors.warning;
    case 'terrible': return colors.danger;
    default: return colors.textTertiary;
  }
};

export const MoodChart: React.FC<MoodChartProps> = ({
  data,
  title,
  subtitle
}) => {
  // Get last 7 days of data
  const chartData = data.slice(0, 7).reverse();
  
  // Format day labels
  const formatDay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().substring(0, 3);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.gridLines}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
        </View>
        
        <View style={styles.barsContainer}>
          {chartData.map((item, index) => {
            const moodValue = ['terrible', 'bad', 'neutral', 'good', 'great'].indexOf(item.mood) + 1;
            const barHeight = (moodValue / 5) * 100;
            
            return (
              <View key={index} style={styles.barColumn}>
                <Text style={styles.emojiLabel}>{getMoodEmoji(item.mood)}</Text>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: `${barHeight}%`,
                        backgroundColor: getMoodColor(item.mood)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.dayLabel}>{formatDay(item.date)}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chartContainer: {
    height: 180,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 24,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: colors.divider,
    width: '100%',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 24,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  emojiLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  barWrapper: {
    width: '100%',
    height: '70%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dayLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
});