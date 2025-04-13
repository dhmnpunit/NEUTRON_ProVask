import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/design';
import { JournalEntry, SleepData, WaterData, MoodData, ActivityData } from '@/types/health';
import Constants from 'expo-constants';
import { format, parseISO } from 'date-fns';

interface HealthInsight {
  day: string;
  month: string;
  date: string;
  summary: string;
  insight: string;
  suggestion: string;
  icon: string;
}

interface HealthTrendsProps {
  title?: string;
  subtitle?: string;
  sleepData: SleepData[];
  waterData: WaterData[];
  moodData: MoodData[];
  activityData: ActivityData[];
  last7Days?: string[];
  style?: StyleProp<ViewStyle>;
}

// Endpoint for Gemini API
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Get API key from environment variables
const getGeminiApiKey = () => {
  if (Constants.expoConfig?.extra?.geminiApiKey) {
    return Constants.expoConfig.extra.geminiApiKey;
  }
  
  if (process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    return process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  }
  
  return null;
};

export const HealthTrends: React.FC<HealthTrendsProps> = ({
  title = "Your Health Insights",
  subtitle = "Personalized analysis based on your journal entries",
  sleepData = [],
  waterData = [],
  moodData = [],
  activityData = [],
  last7Days,
  style
}) => {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  useEffect(() => {
    async function generateInsights() {
      setLoading(true);
      
      try {
        // 1. Get API key
        const apiKey = getGeminiApiKey();
        if (!apiKey) {
          console.error('No Gemini API key found');
          setLoading(false);
          return;
        }
        
        // 2. Organize health data by date
        const dateMap = new Map();
        
        function addToDateMap(items: any[], type: string) {
          items.forEach(item => {
            if (!item.date) return;
            
            const dateStr = typeof item.date === 'string' 
              ? item.date.split('T')[0] 
              : format(item.date, 'yyyy-MM-dd');
              
            if (!dateMap.has(dateStr)) {
              dateMap.set(dateStr, {});
            }
            
            const dateData = dateMap.get(dateStr);
            dateData[type] = item;
          });
        }
        
        addToDateMap(sleepData, 'sleep');
        addToDateMap(waterData, 'water');
        addToDateMap(moodData, 'mood');
        addToDateMap(activityData, 'activity');
        
        // If last7Days is provided, ensure all days exist in the map
        if (last7Days && last7Days.length > 0) {
          last7Days.forEach(dateStr => {
            if (!dateMap.has(dateStr)) {
              dateMap.set(dateStr, {});
            }
          });
        }
        
        // Exit if no data
        if (dateMap.size === 0) {
          setInsights([]);
          setLoading(false);
          return;
        }
        
        // 3. Filter out dates with no meaningful data (or use last7Days if provided)
        const validDates = last7Days 
          ? Array.from(dateMap.entries()).filter(([dateStr]) => last7Days.includes(dateStr))
          : Array.from(dateMap.entries()).filter(([_, data]) => {
              // Check if the date has at least one type of health data
              return Object.keys(data).length > 0;
            });
            
        // Sort dates in reverse chronological order
        validDates.sort(([dateA], [dateB]) => {
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        
        // 4. Create prompt for Gemini API
        const prompt = `
          You are a health analyst assistant. I will provide you with a user's health data from their journal entries.
          Please analyze this data and provide concise, helpful insights.
          
          For each date, I'll share the user's:
          - Sleep quality (1-10 scale)
          - Water intake (glasses)
          - Mood (terrible, bad, neutral, good, great)
          - Activity level (exercise minutes)
          
          Based on this data, provide for EACH DATE:
          1. A very brief summary (one short sentence, max 40 chars)
          2. A specific health insight (one concise sentence, max 60 chars)
          3. A personalized suggestion (one concise suggestion, max 60 chars)
          4. An emoji that best represents their overall health status that day
          
          Here's the data for analysis:
          ${validDates.map(([date, data]) => {
            return `
              Date: ${date}
              Sleep: ${JSON.stringify(data.sleep || 'No data')}
              Water: ${JSON.stringify(data.water || 'No data')}
              Mood: ${JSON.stringify(data.mood || 'No data')}
              Activity: ${JSON.stringify(data.activity || 'No data')}
            `;
          }).join('\n')}
          
          Format your response as a JSON array with objects for EACH DATE in the data, with these properties:
          - date: the date in YYYY-MM-DD format
          - summary: a brief summary (one short sentence, max 40 chars)
          - insight: a specific observation (one concise sentence, max 60 chars)
          - suggestion: actionable advice (one concise suggestion, max 60 chars)
          - icon: a single emoji representing health status
          
          Make all text extremely concise and focused. Prioritize brevity over details.
          Return ONLY the JSON array.
        `;
        
        // 5. Call Gemini API
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1024,
              topP: 0.8,
              topK: 40
            }
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(`API error: ${data.error?.message || 'Unknown error'}`);
        }
        
        // 6. Process response
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        
        if (!jsonMatch) {
          throw new Error('Could not find valid JSON in API response');
        }
        
        // 7. Parse and format insights
        const parsedInsights = JSON.parse(jsonMatch[0]);
        
        const formattedInsights = parsedInsights.map(item => {
          const dateObj = parseISO(item.date);
          return {
            ...item,
            day: format(dateObj, 'd'),
            month: format(dateObj, 'MMM')
          };
        });
        
        setInsights(formattedInsights);
      } catch (error) {
        console.error('Error generating health insights:', error);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    }
    
    generateInsights();
  }, [sleepData, waterData, moodData, activityData, last7Days]);
  
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, style]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </View>
    );
  }
  
  if (insights.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No health data logged yet</Text>
          <Text style={styles.emptyStateSubtext}>Log your daily health to see trends and insights</Text>
        </View>
      </View>
    );
  }
  
  const toggleExpand = (date: string) => {
    setExpandedInsight(expandedInsight === date ? null : date);
  };
  
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      
      {insights.map((insight, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.insightCard}
          onPress={() => toggleExpand(insight.date)}
          activeOpacity={0.7}
        >
          <View style={styles.insightHeader}>
            <View style={styles.dateContainer}>
              <Text style={styles.dayNumber}>{insight.day}</Text>
              <Text style={styles.month}>{insight.month}</Text>
            </View>
            
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                {insight.summary}
              </Text>
            </View>
            
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{insight.icon}</Text>
            </View>
          </View>
          
          {expandedInsight === insight.date && (
            <View style={styles.expandedContent}>
              <View style={styles.insightSection}>
                <Text style={styles.sectionTitle}>Insight</Text>
                <Text style={styles.sectionContent}>{insight.insight}</Text>
              </View>
              
              <View style={styles.insightSection}>
                <Text style={styles.sectionTitle}>Suggestion</Text>
                <Text style={styles.sectionContent}>{insight.suggestion}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    minHeight: 200,
  },
  loader: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    fontFamily: fonts.headingBold,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  emptyStateContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: `${colors.background}40`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: `${colors.border}60`,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: fonts.headingBold,
  },
  month: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  iconContainer: {
    marginLeft: 'auto',
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  summaryContainer: {
    flex: 1,
    marginLeft: 12,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: `${colors.border}40`,
  },
  insightSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
}); 