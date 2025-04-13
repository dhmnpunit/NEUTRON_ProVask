import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Linking,
  Image,
} from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, shadows } from '@/constants/design';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { ArrowUpIcon, TrashIcon, InformationCircleIcon } from 'react-native-heroicons/outline';
import { getHealthAssistantResponse, getPersonalizedInsights } from '@/services/healthAssistantService';
import { useAuth } from '@/context/AuthContext';
import { saveChatMessage, getChatHistory, clearChatHistory, ChatMessage } from '@/services/chatService';
import Constants from 'expo-constants';

// Import Isha profile picture
const IshaProfileImage = require('@/assets/isha.png');

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  user_id?: string;
  created_at?: string;
};

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hello! I'm Isha, your health assistant. How can I help you today?",
    sender: 'assistant',
    timestamp: new Date(),
  },
];

// Suggested questions to help users get started
const suggestedQuestions = [
  "How can I improve my sleep quality?",
  "What exercises are good for beginners?",
  "How much water should I drink daily?",
  "How can I manage stress better?",
  "What are healthy snack options?"
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuth();
  const [showApiKeyNotice, setShowApiKeyNotice] = useState(false);

  // Load chat history and insights when component mounts
  useEffect(() => {
    if (user) {
      loadChatHistory();
      loadPersonalizedInsights();
    }
  }, [user]);
  
  // Load personalized insights based on user data
  const loadPersonalizedInsights = async () => {
    if (!user) return;
    
    try {
      setIsLoadingInsights(true);
      const userInsights = await getPersonalizedInsights(user.id);
      setInsights(userInsights);
    } catch (error) {
      console.error('Failed to load personalized insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // Check if API key is configured
  useEffect(() => {
    const apiKey = Constants.expoConfig?.extra?.geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      setShowApiKeyNotice(true);
    }
  }, []);

  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const chatHistory = await getChatHistory(user.id);
      
      // Convert ChatMessage objects to local Message format
      const formattedMessages: Message[] = chatHistory.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender as 'user' | 'assistant',
        timestamp: new Date(msg.created_at),
        user_id: msg.user_id,
        created_at: msg.created_at
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === '' || !user) return;

    const userMessageId = Date.now().toString();
    
    // Create new user message
    const newUserMessage: Message = {
      id: userMessageId,
      content: inputText,
      sender: 'user',
      timestamp: new Date(),
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    // Save the user message to the database
    await saveChatMessage(user.id, inputText, 'user');

    // Update local state immediately with the new message
    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Get response from health assistant
      const assistantResponse = await getHealthAssistantResponse(inputText, user.id);

      // Save the assistant's response to the database
      await saveChatMessage(user.id, assistantResponse, 'assistant');

      // Update local state with the assistant's response
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantResponse,
        sender: 'assistant',
        timestamp: new Date(),
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
      
      // Refresh personalized insights after new messages
      loadPersonalizedInsights();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;
    
    Alert.alert(
      'Clear Conversation',
      'Are you sure you want to clear this conversation? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearChatHistory(user.id);
              setMessages(initialMessages);
            } catch (error) {
              console.error('Error clearing chat history:', error);
              Alert.alert('Error', 'Failed to clear conversation history');
            }
          }
        }
      ]
    );
  };

  const handleQuestionSuggestion = (question: string) => {
    setInputText(question);
  };

  if (isLoadingHistory) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingHistoryContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingHistoryText}>Loading your conversation...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={IshaProfileImage} style={styles.assistantAvatar} />
            <Text style={styles.headerTitle}>Isha</Text>
          </View>
          {messages.length > 1 && (
            <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
              <TrashIcon size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        {showApiKeyNotice && (
          <View style={styles.apiKeyNotice}>
            <InformationCircleIcon size={20} color={colors.info} style={styles.noticeIcon} />
            <Text style={styles.noticeText}>
              Running in offline mode. For AI-powered responses, add your Gemini API key to the .env file.
            </Text>
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://makersuite.google.com/app/apikey')}
              style={styles.noticeLink}
            >
              <Text style={styles.noticeLinkText}>Get API Key</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          ListHeaderComponent={
            messages.length === 1 ? (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Try asking about:</Text>
                <View style={styles.suggestionsGrid}>
                  {suggestedQuestions.map((question, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.suggestionButton}
                      onPress={() => handleQuestionSuggestion(question)}
                    >
                      <Text style={styles.suggestionText}>{question}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null
          }
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble,
              item.sender === 'user' ? styles.userMessage : styles.assistantMessage
            ]}>
              <Text style={[
                styles.messageText,
                item.sender === 'user' ? styles.userMessageText : styles.assistantMessageText
              ]}>
                {item.content}
              </Text>
            </View>
          )}
          ListFooterComponent={
            messages.length > 2 && insights.length > 0 ? (
              <View style={styles.insightsContainer}>
                <Text style={styles.insightsTitle}>Personalized Insights</Text>
                {isLoadingInsights ? (
                  <View style={styles.insightsLoading}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.insightsLoadingText}>Loading insights...</Text>
                  </View>
                ) : (
                  insights.map((insight, index) => (
                    <View key={index} style={styles.insightItem}>
                      <Text style={styles.insightText}>{insight}</Text>
                    </View>
                  ))
                )}
              </View>
            ) : null
          }
        />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask Isha a question..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={200}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === '' ? styles.sendButtonDisabled : null
            ]}
            onPress={handleSend}
            disabled={inputText.trim() === '' || isLoading}
          >
            <ArrowUpIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assistantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.xs,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  messageBubble: {
    borderRadius: radius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    maxWidth: '80%',
    ...shadows.small,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
  },
  messageText: {
    fontSize: typography.body.fontSize,
  },
  userMessageText: {
    color: colors.background,
  },
  assistantMessageText: {
    color: colors.text,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: radius.medium,
    alignSelf: 'flex-start',
    marginLeft: spacing.md,
    marginBottom: spacing.sm,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.text,
    minHeight: 44,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    alignSelf: 'flex-end',
  },
  sendButtonDisabled: {
    backgroundColor: colors.divider,
  },
  suggestionsContainer: {
    marginBottom: spacing.md,
  },
  suggestionsTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  suggestionButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.small,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  suggestionText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  insightsContainer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.medium,
    ...shadows.small,
  },
  insightsTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingVertical: spacing.xs,
  },
  insightText: {
    ...typography.caption,
    color: colors.text,
  },
  loadingHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingHistoryText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  apiKeyNotice: {
    backgroundColor: colors.info + '20',
    padding: spacing.sm,
    borderRadius: radius.small,
    margin: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  noticeIcon: {
    marginRight: spacing.xs,
  },
  noticeText: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
  noticeLink: {
    marginTop: spacing.xs,
    backgroundColor: colors.info,
    padding: spacing.xs,
    borderRadius: radius.small,
    alignSelf: 'flex-start',
  },
  noticeLinkText: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '500',
  },
  insightsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  insightsLoadingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
}); 