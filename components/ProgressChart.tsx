import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';

interface DataPoint {
  value: number;
  label: string;
}

interface ProgressChartProps {
  data: DataPoint[];
  title: string;
  color: string;
  maxValue?: number;
  unit?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  color,
  maxValue,
  unit = '',
}) => {
  // Calculate the maximum value for scaling
  const calculatedMax = maxValue || Math.max(...data.map(d => d.value)) * 1.2;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.chartContainer}>
        {data.map((point, index) => {
          const barHeight = (point.value / calculatedMax) * 150;
          
          return (
            <View key={index} style={styles.barContainer}>
              <Text style={styles.barValue}>
                {point.value}{unit}
              </Text>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: barHeight, 
                      backgroundColor: color,
                    }
                  ]} 
                />
              </View>
              <Text style={styles.barLabel}>{point.label}</Text>
            </View>
          );
        })}
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
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  barWrapper: {
    height: 150,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 8,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});