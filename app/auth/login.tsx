import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Alert,
  Animated,
  Image
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router, Link } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, shadows, fonts } from '@/constants/design';
import { StatusBar } from 'expo-status-bar';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AtSignIcon, LockIcon, ArrowRightIcon } from 'lucide-react-native';
import { AppLogo } from '@/components/AppLogo';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Animate on component mount
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/thryve-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your health journey</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <AtSignIcon size={18} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <LockIcon size={18} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <PrimaryButton
              title="Log In"
              onPress={handleSignIn}
              loading={loading}
              disabled={loading}
              variant="primary"
              size="large"
              fullWidth
              icon={<ArrowRightIcon size={20} color="#fff" />}
              style={styles.loginButton}
              animateOnMount
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href="/auth/signup" asChild>
                <TouchableOpacity onPress={navigateToSignUp}>
                  <Text style={styles.signupText}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.small,
  },
  inputIcon: {
    marginHorizontal: spacing.md,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text,
    fontFamily: fonts.regular,
  },
  loginButton: {
    marginTop: spacing.lg,
    minHeight: 52,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  signupText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
}); 