import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useRouter, Stack } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { Cog6ToothIcon, UserIcon, ArrowRightOnRectangleIcon, ChevronRightIcon, ShieldCheckIcon } from 'react-native-heroicons/outline';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if user is admin
    if (user) {
      checkAdminAccess();
    }
  }, [user]);
  
  // Check if current user has admin access
  const checkAdminAccess = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      
      if (!error && data) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScreenWrapper>
      <Stack.Screen 
        options={{
          title: "Profile",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/profile/edit')}
            >
              <Cog6ToothIcon size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <Image 
            source={{ 
              uri: user?.user_metadata?.avatar_url || 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.name || 'User')}&background=random`
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.user_metadata?.name || 'User'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/profile/edit')}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <UserIcon size={20} color={colors.primary} />
                </View>
                <Text style={styles.menuText}>Edit Profile</Text>
              </View>
              <ChevronRightIcon size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {isAdmin && (
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/profile/admin-settings')}
          >
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: colors.primaryLight }]}>
                <ShieldCheckIcon size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>Admin Settings</Text>
            </View>
            <ChevronRightIcon size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.settingItem, styles.dangerItem]}
          onPress={handleLogout}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.danger + '20' }]}>
              <ArrowRightOnRectangleIcon size={20} color={colors.danger} />
            </View>
            <Text style={[styles.menuText, { color: colors.danger }]}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  logoutButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsContainer: {
    marginTop: 24,
  },
  settingsHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  dangerItem: {
    backgroundColor: colors.danger + '20',
  },
}); 