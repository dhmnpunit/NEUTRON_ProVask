import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { colors } from '@/constants/colors';
import { useHealthStore } from '@/store/health-store';
import { ProgressChart } from '@/components/ProgressChart';
import { 
  Moon, 
  Droplet, 
  Smile, 
  Footprints, 
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react-native';

type TimeRange = 'week' | 'month' | 'year';

export default function StatsScreen() {
  const { 
    sleepData, 
    waterData, 
    moodData, 
    activityData 
  } = useHealthStore();
  
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  // Helper to get data for the selected time range
  const getFilteredData = <T extends { date: string }>(data: T[], range: TimeRange): T[] => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (range) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };
  
  // Prepare data for charts
  const filteredSleepData = getFilteredData(sleepData, timeRange);
  const filteredWaterData = getFilteredData(waterData, timeRange);
  const filteredActivityData = getFilteredData(activityData, timeRange);
  
  // Format data for sleep chart
  const sleepChartData = filteredSleepData.slice(0, 7).reverse().map(item => ({
    value: item.hoursSlept,
    label: formatDateLabel(item.date, timeRange),
  }));
  
  // Format data for water chart
  const waterChartData = filteredWaterData.slice(0, 7).reverse().map(item => ({
    value: item.glasses,
    label: formatDateLabel(item.date, timeRange),
  }));
  
  // Format data for steps chart
  const stepsChartData = filteredActivityData.slice(0, 7).reverse().map(item => ({
    value: item.steps / 1000, // Convert to K for better display
    label: formatDateLabel(item.date, timeRange),
  }));
  
  // Helper to format date labels based on time range
  function formatDateLabel(dateString: string, range: TimeRange): string {
    const date = new Date(dateString);
    switch (range) {
      case 'week':
        return date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 1);
      case 'month':
        return date.getDate().toString();
      case 'year':
        return date.toLocaleDateString('en-US', { month: 'short' }).substring(0, 1);
    }
  }
  
  // Calculate trends
  const calculateTrend = (data: number[]): { value: number; isPositive: boolean } => {
    if (data.length < 2) return { value: 0, isPositive: true };
    
    const first = data[data.length - 1];
    const last = data[0];
    const diff = last - first;
    const percentage = (diff / first) * 100;
    
    return {
      value: Math.abs(Math.round(percentage)),
      isPositive: diff >= 0
    };
  };
  
  const sleepTrend = calculateTrend(filteredSleepData.map(d => d.hoursSlept));
  const waterTrend = calculateTrend(filteredWaterData.map(d => d.glasses));
  const stepsTrend = calculateTrend(filteredActivityData.map(d => d.steps));
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timeRangeSelector}>
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === 'week' ? styles.timeRangeButtonActive : {}
          ]}
          onPress={() => setTimeRange('week')}
        >
          <Text 
            style={[
              styles.timeRangeButtonText,
              timeRange === 'week' ? styles.timeRangeButtonTextActive : {}
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === 'month' ? styles.timeRangeButtonActive : {}
          ]}
          onPress={() => setTimeRange('month')}
        >
          <Text 
            style={[
              styles.timeRangeButtonText,
              timeRange === 'month' ? styles.timeRangeButtonTextActive : {}
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === 'year' ? styles.timeRangeButtonActive : {}
          ]}
          onPress={() => setTimeRange('year')}
        >
          <Text 
            style={[
              styles.timeRangeButtonText,
              timeRange === 'year' ? styles.timeRangeButtonTextActive : {}
            ]}
          >
            Year
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Your Health Trends</Text>
          
          <View style={styles.trendCardsContainer}>
            <View style={styles.trendCard}>
              <View style={styles.trendIconContainer}>
                <Moon size={20} color={colors.sleep} />
              </View>
              <Text style={styles.trendLabel}>Sleep</Text>
              <View style={styles.trendValueContainer}>
                {sleepTrend.isPositive ? (
                  <TrendingUp size={16} color={colors.success} />
                ) : (
                  <TrendingDown size={16} color={colors.danger} />
                )}
                <Text 
                  style={[
                    styles.trendValue,
                    { color: sleepTrend.isPositive ? colors.success : colors.danger }
                  ]}
                >
                  {sleepTrend.value}%
                </Text>
              </View>
            </View>
            
            <View style={styles.trendCard}>
              <View style={styles.trendIconContainer}>
                <Droplet size={20} color={colors.water} />
              </View>
              <Text style={styles.trendLabel}>Water</Text>
              <View style={styles.trendValueContainer}>
                {waterTrend.isPositive ? (
                  <TrendingUp size={16} color={colors.success} />
                ) : (
                  <TrendingDown size={16} color={colors.danger} />
                )}
                <Text 
                  style={[
                    styles.trendValue,
                    { color: waterTrend.isPositive ? colors.success : colors.danger }
                  ]}
                >
                  {waterTrend.value}%
                </Text>
              </View>
            </View>
            
            <View style={styles.trendCard}>
              <View style={styles.trendIconContainer}>
                <Footprints size={20} color={colors.activity} />
              </View>
              <Text style={styles.trendLabel}>Steps</Text>
              <View style={styles.trendValueContainer}>
                {stepsTrend.isPositive ? (
                  <TrendingUp size={16} color={colors.success} />
                ) : (
                  <TrendingDown size={16} color={colors.danger} />
                )}
                <Text 
                  style={[
                    styles.trendValue,
                    { color: stepsTrend.isPositive ? colors.success : colors.danger }
                  ]}
                >
                  {stepsTrend.value}%
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <ProgressChart
          data={sleepChartData}
          title="Sleep Duration"
          color={colors.sleep}
          maxValue={10}
          unit="h"
        />
        
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Moon size={20} color={colors.sleep} />
            <Text style={styles.insightTitle}>Sleep Insight</Text>
          </View>
          <Text style={styles.insightText}>
            Your sleep quality has improved by 15% this week. You average 7.5 hours of sleep, which is close to the recommended 8 hours.
          </Text>
          <TouchableOpacity style={styles.insightAction}>
            <Text style={styles.insightActionText}>View sleep tips</Text>
            <ArrowRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <ProgressChart
          data={waterChartData}
          title="Water Intake"
          color={colors.water}
          maxValue={10}
          unit=""
        />
        
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Droplet size={20} color={colors.water} />
            <Text style={styles.insightTitle}>Hydration Insight</Text>
          </View>
          <Text style={styles.insightText}>
            You're drinking less water than last week. Try to increase your intake to reach your daily goal of 8 glasses.
          </Text>
          <TouchableOpacity style={styles.insightAction}>
            <Text style={styles.insightActionText}>Set hydration reminder</Text>
            <ArrowRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <ProgressChart
          data={stepsChartData}
          title="Daily Steps (K)"
          color={colors.activity}
          maxValue={12}
          unit="K"
        />
        
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Footprints size={20} color={colors.activity} />
            <Text style={styles.insightTitle}>Activity Insight</Text>
          </View>
          <Text style={styles.insightText}>
            You're 2,500 steps away from your daily goal. A 20-minute walk could help you reach it.
          </Text>
          <TouchableOpacity style={styles.insightAction}>
            <Text style={styles.insightActionText}>Start walking workout</Text>
            <ArrowRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.predictiveCard}>
          <View style={styles.predictiveHeader}>
            <Calendar size={20} color="#fff" />
            <Text style={styles.predictiveTitle}>Predictive Analysis</Text>
          </View>
          <Text style={styles.predictiveText}>
            Based on your current trends, your energy levels may decrease in the next 3 days if sleep quality doesn't improve.
          </Text>
          <Text style={styles.predictiveText}>
            Recommendation: Go to bed 30 minutes earlier tonight.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primaryLight,
  },
  timeRangeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  timeRangeButtonTextActive: {
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  trendCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  trendIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  trendValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  insightCard: {
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
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  insightAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
  predictiveCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  predictiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictiveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  predictiveText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 8,
  },
});