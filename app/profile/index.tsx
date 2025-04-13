import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/design';
import { useAuth } from '@/context/AuthContext';
import { useRouter, Stack } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { 
  Cog6ToothIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon, 
  ChevronRightIcon, 
  ShieldCheckIcon,
  ClockIcon,
  CheckIcon
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { supabase } from '@/lib/supabase';
import { useHealthStore } from '@/store/health-store';
import { format, parseISO } from 'date-fns';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const { tasks, userProfile } = useHealthStore();
  
  // Get completed tasks
  const completedTasks = useMemo(() => {
    return tasks
      .filter(task => task.completed)
      .sort((a, b) => {
        // Sort by completion date, most recent first
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5); // Show only the 5 most recent
  }, [tasks]);

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

  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'MMM d, h:mm a');
    } catch (error) {
      return dateString;
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
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile.streak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile.healthCoins}</Text>
                <Text style={styles.statLabel}>Coins</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedTasks.length}</Text>
                <Text style={styles.statLabel}>Tasks</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Completed Tasks</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => router.push('/profile/completed-tasks')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tasksContainer}>
              {completedTasks.map((task) => (
                <View key={task.id} style={styles.completedTaskItem}>
                  <View style={styles.taskLeftContent}>
                    <CheckCircleIcon size={20} color={colors.primary} style={styles.taskIcon} />
                    <View style={styles.taskDetails}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <Text style={styles.taskDate}>
                        <ClockIcon size={12} color={colors.textSecondary} style={styles.smallIcon} />
                        {' '}
                        {formatDate(task.completedAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.taskReward}>
                    <Text style={styles.taskRewardText}>+{task.coins}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.tasksContainer}>
            <TouchableOpacity 
              style={styles.profileActionItem}
              onPress={() => router.push('/profile/edit')}
            >
              <View style={styles.taskLeftContent}>
                <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <UserIcon size={20} color={colors.primary} />
                </View>
                <Text style={styles.actionText}>Edit Profile</Text>
              </View>
              <ChevronRightIcon size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {isAdmin && (
              <TouchableOpacity 
                style={styles.profileActionItem}
                onPress={() => router.push('/profile/admin-settings')}
              >
                <View style={styles.taskLeftContent}>
                  <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <ShieldCheckIcon size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.actionText}>Admin Settings</Text>
                </View>
                <ChevronRightIcon size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.profileActionItem}
              onPress={handleLogout}
            >
              <View style={styles.taskLeftContent}>
                <View style={[styles.actionIconContainer, { backgroundColor: colors.danger + '20' }]}>
                  <ArrowRightOnRectangleIcon size={20} color={colors.danger} />
                </View>
                <Text style={[styles.actionText, { color: colors.danger }]}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: fonts.headingBold,
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  tasksContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  completedTaskItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIcon: {
    marginRight: 12,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontFamily: fonts.headingSemiBold,
    color: colors.text,
    marginBottom: 2,
  },
  taskDate: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallIcon: {
    marginRight: 4,
  },
  taskReward: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  taskRewardText: {
    fontSize: 12,
    fontFamily: fonts.headingSemiBold,
    color: colors.primary,
  },
  profileActionItem: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text,
  },
}); 