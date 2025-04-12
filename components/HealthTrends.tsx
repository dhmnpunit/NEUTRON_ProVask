import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/design';
import { JournalEntry } from '@/types/health';

interface HealthIssue {
  day: string;
  issue: string;
  recommendation: string;
  icon: string;
}

interface HealthTrendsProps {
  title?: string;
  subtitle?: string;
  entries: JournalEntry[];
  style?: StyleProp<ViewStyle>;
}

export const HealthTrends: React.FC<HealthTrendsProps> = ({
  title = "Your Health Trends & Early Signals",
  subtitle = "Patterns detected from your logs to help you stay ahead",
  entries = [],
  style
}) => {
  // This would normally be derived from actual data analysis
  // For demo, we're hardcoding the issues shown in the image
  const healthIssues: HealthIssue[] = [
    {
      day: "Sat",
      issue: "Low hydration",
      recommendation: "Drink 1L more than usual",
      icon: "💧"
    },
    {
      day: "Fri",
      issue: "Late dinner & poor sleep",
      recommendation: "Avoid food 2h before bed",
      icon: "🚶‍♂️"
    },
    {
      day: "thu",
      issue: "No activity",
      recommendation: "Try a short walk today",
      icon: "😐"
    },
    {
      day: "wed",
      issue: "Good dipped, less sleep",
      recommendation: "Wind down earlier tonight",
      icon: "😐"
    },
    {
      day: "tue",
      issue: "Good sleep & exercise",
      recommendation: "Nice job! Keep it up",
      icon: "😊"
    }
  ];

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {healthIssues.map((issue, index) => (
        <View key={index} style={styles.issueRow}>
          <View style={styles.dayColumn}>
            <Text style={styles.day}>{issue.day}</Text>
            <Text style={styles.icon}>{issue.icon}</Text>
          </View>

          <View style={styles.issueColumn}>
            <Text style={styles.issueText}>{issue.issue}</Text>
            <Text style={styles.recommendation}>{issue.recommendation}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card || '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow || '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: fonts.headingSemiBold,
    color: colors.text || '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary || '#666666',
    marginBottom: 16,
  },
  issueRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider || '#EEEEEE',
  },
  dayColumn: {
    width: 40,
    alignItems: 'center',
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.headingSemiBold,
    color: colors.text || '#000000',
    marginBottom: 4,
  },
  icon: {
    fontSize: 20,
  },
  issueColumn: {
    flex: 1,
    paddingLeft: 12,
  },
  issueText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.headingSemiBold,
    color: colors.text || '#000000',
    marginBottom: 2,
  },
  recommendation: {
    fontSize: 13,
    color: colors.textSecondary || '#666666',
  },
}); 