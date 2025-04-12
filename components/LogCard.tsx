import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { X } from 'lucide-react-native';

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
  onDelete
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
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
          <Text style={styles.notes}>{notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 12,
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
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 12,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});