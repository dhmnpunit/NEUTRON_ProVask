import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, shadows } from '@/constants/design';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { ArrowLeftIcon, KeyIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Interface for app settings
interface AppSetting {
  id: string;
  setting_name: string;
  setting_value: string | null;
  is_encrypted: boolean;
}

export default function AdminSettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [enableAI, setEnableAI] = useState(true);
  const [messageRetention, setMessageRetention] = useState('30');
  
  useEffect(() => {
    checkAdminAccess();
    loadSettings();
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
      
      if (error) {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error in checkAdminAccess:', error);
      setIsAdmin(false);
    }
  };

  // Load app settings from Supabase
  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*');
      
      if (error) {
        console.error('Error loading settings:', error);
        Alert.alert('Error', 'Failed to load settings');
      } else if (data) {
        setSettings(data);
        
        // Set individual state variables
        const openaiKeySetting = data.find(s => s.setting_name === 'openai_api_key');
        if (openaiKeySetting?.setting_value) {
          setOpenaiKey('••••••••••••••••••••••••••••');
        }
        
        const retentionSetting = data.find(s => s.setting_name === 'message_retention_days');
        if (retentionSetting?.setting_value) {
          setMessageRetention(retentionSetting.setting_value);
        }
      }
    } catch (error) {
      console.error('Error in loadSettings:', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings to Supabase
  const saveSettings = async () => {
    if (!isAdmin) {
      Alert.alert('Error', 'You do not have permission to change settings');
      return;
    }
    
    setIsSaving(true);
    try {
      if (openaiKey && !openaiKey.includes('•')) {
        const { error: keyError } = await supabase
          .from('app_settings')
          .update({ setting_value: openaiKey })
          .eq('setting_name', 'openai_api_key');
        
        if (keyError) throw keyError;
      }
      
      const { error: retentionError } = await supabase
        .from('app_settings')
        .update({ setting_value: messageRetention })
        .eq('setting_name', 'message_retention_days');
      
      if (retentionError) throw retentionError;
      
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!isAdmin) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeftIcon size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Settings</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedText}>
            You don't have permission to access admin settings.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleBack}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeftIcon size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Assistant Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <KeyIcon size={20} color={colors.primary} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>OpenAI API Key</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter API key"
              placeholderTextColor={colors.textTertiary}
              value={openaiKey}
              onChangeText={setOpenaiKey}
              secureTextEntry={openaiKey.includes('•')}
            />
            {openaiKey.includes('•') && (
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => setOpenaiKey('')}
              >
                <Text style={styles.resetButtonText}>Change</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Text style={styles.settingLabel}>Enable AI Assistant</Text>
            </View>
            <Switch
              value={enableAI}
              onValueChange={setEnableAI}
              trackColor={{ false: colors.textTertiary, true: colors.primaryLight }}
              thumbColor={enableAI ? colors.primary : colors.textSecondary}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chat Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Text style={styles.settingLabel}>Message Retention (days)</Text>
            </View>
            <TextInput
              style={[styles.input, styles.shortInput]}
              placeholder="30"
              placeholderTextColor={colors.textTertiary}
              value={messageRetention}
              onChangeText={setMessageRetention}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Settings</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  backButton: {
    padding: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: radius.medium,
    padding: spacing.md,
    ...shadows.small,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: spacing.sm,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.small,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.text,
    width: '50%',
  },
  shortInput: {
    width: '20%',
    textAlign: 'center',
  },
  resetButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  resetButtonText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.medium,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  saveButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.medium,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  buttonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '500',
    textAlign: 'center',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  unauthorizedText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
}); 