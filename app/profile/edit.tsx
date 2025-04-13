import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/design';
import { useAuth } from '@/context/AuthContext';
import { useRouter, Stack } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { updateUserProfile } from '@/services/profileService';
import { UserIcon, EnvelopeIcon, ArrowLeftIcon } from 'react-native-heroicons/outline';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      setLoading(true);
      if (user) {
        await updateUserProfile(user.id, { name });
        router.back();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Stack.Screen 
        options={{
          title: "Edit Profile",
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

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ 
                uri: user?.user_metadata?.avatar_url || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <UserIcon size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textSecondary}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputContainerDisabled}>
                  <EnvelopeIcon size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <Text style={styles.disabledText}>{user?.email}</Text>
                </View>
                <Text style={styles.helpText}>Email cannot be changed</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {loading ? (
              <View style={styles.loadingButton}>
                <ActivityIndicator color="white" size="small" />
              </View>
            ) : (
              <PrimaryButton
                title="Save Changes"
                onPress={handleSave}
                fullWidth
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  changePhotoButton: {
    marginTop: 8,
  },
  changePhotoText: {
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.headingSemiBold,
    color: colors.text,
    marginBottom: 12,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputWrapper: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground || colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  inputContainerDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.disabledBackground || colors.border + '50',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  inputIcon: {
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 12,
  },
  disabledText: {
    flex: 1,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 12,
  },
  helpText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  loadingButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 