import { supabase } from '@/lib/supabase';
import { JournalEntry, HealthMetrics, MoodType } from '@/types/health';

export const getJournalEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }

  return data as JournalEntry[];
};

export interface CreateJournalEntryParams {
  user_id: string;
  content: string;
  mood?: MoodType;
  health_metrics: HealthMetrics;
  tags?: string[];
  symptoms: string[];
}

export const addJournalEntry = async (params: CreateJournalEntryParams): Promise<JournalEntry> => {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: params.user_id,
      content: params.content,
      mood: params.mood,
      health_metrics: params.health_metrics,
      tags: params.tags || [],
      symptoms: params.symptoms,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
  // Remove fields that should not be updated
  const { id: _id, user_id: _userId, created_at: _createdAt, ...validUpdates } = updates as any;
  
  const { data, error } = await supabase
    .from('journal_entries')
    .update(validUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating journal entry:', error);
    throw error;
  }

  return data as JournalEntry;
};

export const getJournalEntryById = async (id: string) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching journal entry:', error);
    throw error;
  }

  return data as JournalEntry;
};

export const deleteJournalEntry = async (id: string) => {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting journal entry:', error);
    throw error;
  }
}; 