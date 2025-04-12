import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/health';

/**
 * Create a new user profile after signup
 */
export const createUserProfile = async (userId: string, name: string): Promise<UserProfile | null> => {
  try {
    const newProfile = {
      id: userId,
      name,
      streak: 0,
      level: 1,
      experience: 0,
      healthCoins: 0,
      joinedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
};

/**
 * Get a user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

/**
 * Update user profile fields
 */
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<Omit<UserProfile, 'id'>>
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}; 