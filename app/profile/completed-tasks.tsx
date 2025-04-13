import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/design';
import { Stack, useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { useHealthStore } from '@/store/health-store';
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { CheckCircleIcon, ArrowLeftIcon, ClockIcon, TrashIcon } from 'react-native-heroicons/outline';
import { Task } from '@/store/health-store';

export default function CompletedTasksScreen() {
  const router = useRouter();
  const { tasks, deleteTask } = useHealthStore();
  const [filterMode, setFilterMode] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get all completed tasks with filter
  const completedTasks = useMemo(() => {
    let filtered = tasks.filter(task => task.completed);
    
    // Apply filter
    if (filterMode === 'today') {
      filtered = filtered.filter(task => 
        task.completedAt && isToday(new Date(task.completedAt))
      );
    } else if (filterMode === 'week') {
      filtered = filtered.filter(task => 
        task.completedAt && isThisWeek(new Date(task.completedAt))
      );
    } else if (filterMode === 'month') {
      filtered = filtered.filter(task => 
        task.completedAt && isThisMonth(new Date(task.completedAt))
      );
    }
    
    // Sort by completion date (newest first)
    return filtered.sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [tasks, filterMode]);
  
  // Format date with relative time
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      if (isToday(date)) {
        return `Today at ${format(date, 'h:mm a')}`;
      } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'h:mm a')}`;
      } else {
        return format(date, 'MMM d, yyyy • h:mm a');
      }
    } catch (error) {
      return dateString;
    }
  };
  
  // Handle task deletion
  const handleDeleteTask = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Render each task item
  const renderTaskItem = ({ item }: { item: Task }) => {
    return (
      <View style={styles.taskItem}>
        <View style={styles.taskLeftContent}>
          <CheckCircleIcon size={22} color={colors.primary} style={styles.taskIcon} />
          <View style={styles.taskDetails}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription} numberOfLines={2}>{item.description}</Text>
            <View style={styles.taskDateContainer}>
              <ClockIcon size={12} color={colors.textSecondary} />
              <Text style={styles.taskDate}>
                {formatDate(item.completedAt || '')}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.taskActions}>
          <View style={styles.taskReward}>
            <Text style={styles.taskRewardText}>+{item.coins}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteTask(item.id)}
            disabled={isDeleting}
          >
            <TrashIcon size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Empty state when no tasks
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No completed tasks</Text>
      <Text style={styles.emptyDescription}>Tasks you complete will appear here.</Text>
    </View>
  );
  
  return (
    <ScreenWrapper>
      <Stack.Screen 
        options={{
          title: "Completed Tasks",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: fonts.headingSemiBold,
            color: colors.text,
          },
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ArrowLeftIcon size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }} 
      />
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          <TouchableOpacity 
            style={[styles.filterButton, filterMode === 'all' && styles.filterButtonActive]}
            onPress={() => setFilterMode('all')}
          >
            <Text style={[styles.filterText, filterMode === 'all' && styles.filterTextActive]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filterMode === 'today' && styles.filterButtonActive]}
            onPress={() => setFilterMode('today')}
          >
            <Text style={[styles.filterText, filterMode === 'today' && styles.filterTextActive]}>Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filterMode === 'week' && styles.filterButtonActive]}
            onPress={() => setFilterMode('week')}
          >
            <Text style={[styles.filterText, filterMode === 'week' && styles.filterTextActive]}>This Week</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filterMode === 'month' && styles.filterButtonActive]}
            onPress={() => setFilterMode('month')}
          >
            <Text style={[styles.filterText, filterMode === 'month' && styles.filterTextActive]}>This Month</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {isDeleting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}
      
      <FlatList
        data={completedTasks}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: colors.card,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  filterTextActive: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  taskItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskLeftContent: {
    flexDirection: 'row',
    flex: 1,
  },
  taskIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: fonts.headingSemiBold,
    color: colors.text,
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  taskDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  taskActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  taskReward: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  taskRewardText: {
    fontSize: 14,
    fontFamily: fonts.headingSemiBold,
    color: colors.primary,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.headingSemiBold,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
}); 