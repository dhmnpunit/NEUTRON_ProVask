import { supabase } from '@/lib/supabase';

export type ChatMessage = {
  id: string;
  user_id: string;
  content: string;
  sender: 'user' | 'assistant';
  created_at: string;
};

/**
 * Save a chat message to the database
 * @param userId - The user's ID
 * @param content - Message content
 * @param sender - Who sent the message (user or assistant)
 * @returns The saved message or null if there was an error
 */
export const saveChatMessage = async (
  userId: string,
  content: string,
  sender: 'user' | 'assistant'
): Promise<ChatMessage | null> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        content,
        sender
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error saving chat message:', error);
      return null;
    }
    
    return data as ChatMessage;
  } catch (error) {
    console.error('Error in saveChatMessage:', error);
    return null;
  }
};

/**
 * Get chat history for a user
 * @param userId - The user's ID
 * @param limit - Maximum number of messages to retrieve
 * @returns Array of chat messages
 */
export const getChatHistory = async (
  userId: string,
  limit = 50
): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);
      
    if (error) {
      console.error('Error retrieving chat history:', error);
      return [];
    }
    
    return data as ChatMessage[];
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    return [];
  }
};

/**
 * Delete chat history for a user
 * @param userId - The user's ID
 * @returns Boolean indicating success
 */
export const clearChatHistory = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error clearing chat history:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in clearChatHistory:', error);
    return false;
  }
}; 