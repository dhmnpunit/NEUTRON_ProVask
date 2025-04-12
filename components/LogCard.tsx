import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { X, Tag } from 'lucide-react-native';

interface LogCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  feeling?: string;
  feelingEmoji?: string;
  worth?: boolean;
  notes?: string;
  onPress?: () => void;
  onDelete?: () => void;
  date?: string;
  tags?: string[];
}

export const LogCard: React.FC<LogCardProps> = ({
  title,
  subtitle,
  icon,
  feeling,
  feelingEmoji,
  worth,
  notes,
  onPress,
  onDelete,
  date,
  tags
}) => {
  // Format the date if provided
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    
    return { day, month };
  };
  
  const formattedDate = formatDate(date);
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        {formattedDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateDay}>{formattedDate.day}</Text>
            <Text style={styles.dateMonth}>{formattedDate.month}</Text>
          </View>
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <View>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              </View>
            </View>
            
            {onDelete && (
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={onDelete}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <X size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
          
          {(feeling || worth !== undefined) && (
            <View style={styles.detailsRow}>
              {feeling && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Feeling</Text>
                  <View style={styles.feelingContainer}>
                    {feelingEmoji && <Text style={styles.emoji}>{feelingEmoji}</Text>}
                    <Text style={styles.detailValue}>{feeling}</Text>
                  </View>
                </View>
              )}
              
              {worth !== undefined && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Worth it?</Text>
                  <View 
                    style={[
                      styles.worthBadge,
                      worth ? styles.worthYes : styles.worthNo
                    ]}
                  >
                    <Text 
                      style={[
                        styles.worthText,
                        worth ? styles.worthYesText : styles.worthNoText
                      ]}
                    >
                      {worth ? 'Yes' : 'No'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
          
          {notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notes} numberOfLines={3}>{notes}</Text>
            </View>
          )}
          
          {tags && tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Tag size={14} color={colors.textSecondary} style={styles.tagIcon} />
              <View style={styles.tags}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
  },
  dateContainer: {
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    margin: 14,
    minWidth: 60,
    height: 70,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateDay: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
  },
  dateMonth: {
    fontSize: 16,
    color: colors.textSecondary,
    textTransform: 'lowercase',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  detailItem: {
    marginRight: 24,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
  },
  feelingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 16,
    marginRight: 4,
  },
  worthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  worthYes: {
    backgroundColor: colors.primaryLight,
  },
  worthNo: {
    backgroundColor: colors.danger + '20',
  },
  worthText: {
    fontSize: 14,
    fontWeight: '500',
  },
  worthYesText: {
    color: colors.primary,
  },
  worthNoText: {
    color: colors.danger,
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    alignItems: 'center',
  },
  tagIcon: {
    marginRight: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  tag: {
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});