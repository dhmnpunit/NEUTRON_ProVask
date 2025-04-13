// A service for handling health assistant responses and message management
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getJournalEntries } from './journalService';
import { parseISO, format, subDays } from 'date-fns';
import { JournalEntry, SleepData, WaterData, MoodData, ActivityData } from '@/types/health';
import { getChatHistory, ChatMessage } from './chatService';

// Endpoint for Gemini API - using Gemini 1.5 Flash which is widely available
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Get API key from environment variables
const getGeminiApiKey = () => {
  // For Expo, use Constants.expoConfig.extra or EXPO_PUBLIC env vars
  if (Constants.expoConfig?.extra?.geminiApiKey?.value) {
    return Constants.expoConfig.extra.geminiApiKey.value;
  }
  
  // Try to get from Expo public env vars
  if (process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    return process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  }
  
  return null;
};

/**
 * Get a response from Gemini for health-related questions
 * @param userInput - The text input from the user
 * @param userId - The user's ID to retrieve conversation history
 * @returns A relevant health response from the AI
 */
export const getAIHealthAssistantResponse = async (userInput: string, userId: string): Promise<string> => {
  try {
    const apiKey = getGeminiApiKey();
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.log('No valid API key found in environment variables, using offline responses');
      return getOfflineHealthAssistantResponse(userInput);
    }
    
    // Get recent conversation history (last 10 messages)
    const recentMessages = await getChatHistory(userId, 10);
    
    // Format conversation history for the prompt
    let conversationHistory = '';
    if (recentMessages && recentMessages.length > 0) {
      conversationHistory = 'Recent conversation history:\n';
      recentMessages.forEach(msg => {
        const role = msg.sender === 'user' ? 'User' : 'Isha';
        conversationHistory += `${role}: ${msg.content}\n`;
      });
      conversationHistory += '\n';
    }
    
    const systemPrompt = `You are Isha, a health assistant for a wellness tracking app called ProVask. 
    Your goal is to provide helpful, accurate, and personalized health information. 
    Keep your responses focused on general wellness, nutrition, exercise, sleep, hydration, and mental wellness.
    Be supportive and encouraging. Do not provide specific medical diagnoses or treatment recommendations.
    Keep responses concise (under 100 words) and conversational. Use simple language.
    
    IMPORTANT: Remember details about the user from previous messages in the conversation.
    Reference previous topics when appropriate to provide a continuous and coherent conversation experience.`;

    console.log('Making Gemini API request to:', GEMINI_API_ENDPOINT);
    
    // Updated Gemini API request format with conversation history
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\n${conversationHistory}User's current question: ${userInput}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
          topP: 0.95,
          topK: 40
        }
      })
    });

    const data = await response.json();
    
    // Log response status for debugging
    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return getOfflineHealthAssistantResponse(userInput);
    }
    
    if (data.error) {
      console.error('Gemini API data error:', data.error);
      return getOfflineHealthAssistantResponse(userInput);
    }
    
    // Debug response structure
    console.log('Gemini response structure:', JSON.stringify(data).substring(0, 200) + '...');
    
    // Extract response text from Gemini API response format
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!responseText) {
      console.error('No text found in Gemini response:', data);
      return getOfflineHealthAssistantResponse(userInput);
    }
    
    return responseText.trim();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fall back to offline responses if API call fails
    return getOfflineHealthAssistantResponse(userInput);
  }
};

/**
 * Helper function to generate health assistant responses based on user input (offline fallback)
 * @param userInput - The text input from the user
 * @returns A relevant health response
 */
export const getOfflineHealthAssistantResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  // Sleep related queries
  if (input.includes('sleep') || input.includes('tired') || input.includes('rest')) {
    return "Adults should aim for 7-9 hours of quality sleep per night. Creating a consistent sleep schedule can help improve your sleep quality. Based on your recent sleep data, you might benefit from going to bed 30 minutes earlier.";
  }
  
  // Water intake queries
  if (input.includes('water') || input.includes('hydration') || input.includes('drink')) {
    return "It's important to stay hydrated! Aim for 8 glasses of water daily. Would you like me to remind you to drink water throughout the day?";
  }
  
  // Exercise and activity queries
  if (input.includes('exercise') || input.includes('workout') || input.includes('active') || input.includes('run')) {
    return "Regular physical activity is essential for good health. Aim for at least 150 minutes of moderate exercise per week. Your activity levels have been below target lately. Would you like some workout suggestions tailored to your goals?";
  }
  
  // Mental health queries
  if (input.includes('stress') || input.includes('anxiety') || input.includes('mental') || input.includes('mood')) {
    return "Managing stress is important for your overall wellbeing. Have you tried meditation or deep breathing exercises? Even 5 minutes a day can make a difference. I've noticed your mood has been fluctuating recently - maintaining consistent sleep and exercise can help stabilize your mood.";
  }
  
  // Diet and nutrition queries
  if (input.includes('diet') || input.includes('nutrition') || input.includes('food') || input.includes('eat')) {
    return "A balanced diet rich in fruits, vegetables, lean proteins, and whole grains is key to good health. Would you like some healthy meal suggestions based on your health goals?";
  }
  
  // Health goals
  if (input.includes('goal') || input.includes('target') || input.includes('improve')) {
    return "Setting specific, measurable, achievable, relevant, and time-bound (SMART) goals can help you improve your health. Based on your data, I recommend focusing on increasing your daily activity and improving your sleep consistency.";
  }
  
  // General wellness
  if (input.includes('wellness') || input.includes('healthy') || input.includes('habit')) {
    return "Small, consistent habits are the foundation of good health. Try focusing on one new healthy habit each week, such as taking a short walk after dinner or drinking a glass of water when you wake up.";
  }
  
  // Default response
  return "I'm Isha, your health assistant, here to help with your wellness journey. You can ask me about sleep, exercise, water intake, nutrition, or stress management. What health topic would you like to discuss today?";
};

/**
 * Main function to get health assistant responses, using AI when possible or offline responses as fallback
 */
export const getHealthAssistantResponse = async (userInput: string, userId: string): Promise<string> => {
  try {
    // Use Gemini API
    return await getAIHealthAssistantResponse(userInput, userId);
  } catch (error) {
    console.error('Error in getHealthAssistantResponse:', error);
    return getOfflineHealthAssistantResponse(userInput);
  }
};

/**
 * Get personalized health insights based on user data
 * @param userId - The user's ID to fetch their health data
 * @returns An array of personalized health insights
 */
export const getPersonalizedInsights = async (userId: string): Promise<string[]> => {
  try {
    // Fetch user journal entries from Supabase
    const entries = await getJournalEntries(userId);
    
    // If no entries, return default insights
    if (!entries || entries.length === 0) {
      return getDefaultInsights();
    }
    
    // Process entries to extract health metrics
    const healthData = extractHealthDataFromJournalEntries(entries);
    
    // Generate insights based on actual user data and journal content
    const insights = await generateInsightsFromHealthDataAndJournals(healthData, entries, userId);
    
    return insights;
  } catch (error) {
    console.error('Error fetching personalized insights:', error);
    return getDefaultInsights();
  }
};

/**
 * Extract health data from journal entries
 */
function extractHealthDataFromJournalEntries(entries: JournalEntry[]) {
  // Get the 10 most recent entries
  const recentEntries = entries.slice(0, 10);
  
  // Extract health metrics from entries
  const sleepData: SleepData[] = [];
  const waterData: WaterData[] = [];
  const moodData: MoodData[] = [];
  const activityData: ActivityData[] = [];

  recentEntries.forEach(entry => {
    const date = entry.created_at.split('T')[0];
    
    // Extract sleep data if available
    if (entry.health_metrics.sleep_quality) {
      sleepData.push({
        date,
        hoursSlept: entry.health_metrics.sleep_hours || 8, // Use actual hours if available
        quality: entry.health_metrics.sleep_quality,
        bedTime: '22:00', // Placeholder
        wakeTime: '06:00', // Placeholder
      });
    }
    
    // Extract water data if available
    if (entry.health_metrics.water_glasses) {
      waterData.push({
        date,
        glasses: entry.health_metrics.water_glasses,
        target: 8, // Default target
      });
    }
    
    // Extract mood data if available
    if (entry.mood) {
      moodData.push({
        date,
        mood: entry.mood,
        notes: entry.content,
      });
    }
    
    // Extract activity data if available
    if (entry.health_metrics.exercise_minutes) {
      activityData.push({
        date,
        steps: 0, // We don't track steps
        activeMinutes: entry.health_metrics.exercise_minutes,
        workouts: [],
      });
    }
  });

  return { sleepData, waterData, moodData, activityData };
}

/**
 * Generate insights from health data and journal content using Gemini API
 */
async function generateInsightsFromHealthDataAndJournals(
  healthData: { 
    sleepData: SleepData[]; 
    waterData: WaterData[]; 
    moodData: MoodData[]; 
    activityData: ActivityData[];
  },
  journalEntries: JournalEntry[],
  userId: string
): Promise<string[]> {
  try {
    const apiKey = getGeminiApiKey();
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return getDefaultInsights();
    }
    
    // Get the 5 most recent journal entries for content analysis
    const recentJournals = journalEntries.slice(0, 5);
    
    // Create prompt with user's health data AND journal content
    const prompt = `
      You are a health insights assistant specializing in preventive healthcare. You'll analyze a user's health journal entries and metrics to provide personalized preventive health insights.
      
      Your task is to analyze both the health metrics and the content of their journal entries to identify patterns, potential early warning signs, and opportunities for health improvement.
      
      Focus on preventing potential health issues before they arise, and suggesting small habit changes that could improve overall wellbeing.
      
      Here's the user's journal entries:
      ${recentJournals.map(entry => `
      ---
      Date: ${entry.created_at.split('T')[0]}
      Mood: ${entry.mood || 'Not recorded'}
      Sleep Quality: ${entry.health_metrics.sleep_quality || 'Not recorded'}/10
      Water Glasses: ${entry.health_metrics.water_glasses || 'Not recorded'}
      Exercise Minutes: ${entry.health_metrics.exercise_minutes || 'Not recorded'}
      Energy Level: ${entry.health_metrics.energy_level || 'Not recorded'}/10
      Journal Content: ${entry.content}
      ---
      `).join('\n')}
      
      Here's additional aggregated health data:
      
      Sleep Quality Data:
      ${healthData.sleepData.map(item => 
        `Date: ${item.date}, Quality: ${item.quality}/10, Hours: ${item.hoursSlept}hr`
      ).join('\n')}
      
      Water Intake Data:
      ${healthData.waterData.map(item => 
        `Date: ${item.date}, Glasses: ${item.glasses}, Target: ${item.target}`
      ).join('\n')}
      
      Mood Data:
      ${healthData.moodData.map(item => 
        `Date: ${item.date}, Mood: ${item.mood}`
      ).join('\n')}
      
      Activity Data:
      ${healthData.activityData.map(item => 
        `Date: ${item.date}, Active Minutes: ${item.activeMinutes}`
      ).join('\n')}
      
      Based on this information, provide 5 personalized insights that:
      1. Identify patterns between different health metrics (sleep, water, mood, activity)
      2. Detect potential early warning signs of health issues
      3. Analyze the journal content for mentioned symptoms or concerns
      4. Suggest specific preventive actions based on the data
      5. Focus on small, actionable habit changes that could improve wellbeing
      
      Format your response as a JSON array of 5 insight strings.
      Each insight should be 1-2 sentences and around 100-150 characters.
      Do not include numbers, bullet points, or labels in your insights.
    `;
    
    // Call Gemini API
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
          topP: 0.9,
          topK: 40
        }
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error for insights:', data);
      return getDefaultInsights();
    }
    
    // Extract response text from Gemini API response
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!responseText) {
      return getDefaultInsights();
    }
    
    // Try to parse JSON array from the response
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const insights = JSON.parse(jsonMatch[0]);
        return insights.slice(0, 5); // Ensure we have exactly 5 insights
      } else {
        // Fallback if JSON parsing fails - extract text as insights
        const textInsights = responseText
          .split('\n')
          .filter(line => line.trim().length > 20 && !line.includes('```'))
          .slice(0, 5);
          
        if (textInsights.length > 0) {
          return textInsights;
        }
      }
    } catch (error) {
      console.error('Error parsing insights JSON:', error);
      // Try to extract text insights if JSON parsing fails
      const textInsights = responseText
        .split('\n')
        .filter(line => line.trim().length > 20 && !line.includes('```'))
        .slice(0, 5);
        
      if (textInsights.length > 0) {
        return textInsights;
      }
    }
    
    return getDefaultInsights();
  } catch (error) {
    console.error('Error generating insights from health data and journals:', error);
    return getDefaultInsights();
  }
}

/**
 * Default insights for when there's no data or API errors
 */
function getDefaultInsights(): string[] {
  return [
    "Regular sleep schedules can help stabilize your mood and improve overall energy levels.",
    "Staying hydrated throughout the day may help with the fatigue you've been experiencing.",
    "Consider mindfulness exercises to help manage stress patterns visible in your logs.",
    "Short walks after meals could improve your digestion and boost your reported energy levels.",
    "Gradual increases in daily activity may help with the sleep quality issues in your entries."
  ];
}

/**
 * Get health recommendations based on recent user health metrics
 * @param userId - The user's ID
 * @returns A recommendation object with action items
 */
export const getHealthRecommendations = (userId: string) => {
  // This would normally analyze user data and return personalized recommendations
  return {
    priority: "sleep",
    suggestions: [
      {
        title: "Go to bed 30 minutes earlier tonight",
        description: "Improve your sleep quality",
        category: "sleep"
      },
      {
        title: "Take a 10-minute walk after lunch",
        description: "Boost your daily activity",
        category: "activity"
      },
      {
        title: "Drink a glass of water before each meal",
        description: "Reach your hydration goals",
        category: "water"
      }
    ]
  };
}; 