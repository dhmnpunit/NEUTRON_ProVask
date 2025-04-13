import React from 'react';
import { View, StyleSheet, Image, Platform, StatusBar, ScrollView, useWindowDimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StyledText } from '@/components/StyledText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/constants/colors';
import { fonts, spacing, radius, typography, componentStyles, shadows } from '@/constants/design';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { ArrowRightIcon } from 'react-native-heroicons/outline';
import { 
  ChartBarIcon, 
  BookOpenIcon, 
  CubeIcon, 
  ChatBubbleLeftRightIcon 
} from 'react-native-heroicons/outline';
import { LinearGradient } from 'expo-linear-gradient';

export default function LandingPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with gradient */}
        <LinearGradient
          colors={[colors.primaryLight, colors.background]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContainer}>
            {/* App logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <StyledText style={styles.logoText}>T</StyledText>
              </View>
              <View>
                <StyledText style={styles.appName}>thryve</StyledText>
                <StyledText style={styles.tagline}>Your personal health companion</StyledText>
              </View>
            </View>
            
            {/* Hero section */}
            <View style={styles.heroContainer}>
              <View style={styles.heroTextContainer}>
                <StyledText style={styles.heroTitle}>Track Your Health Journey</StyledText>
                <StyledText style={styles.heroSubtitle}>
                  Log metrics, set goals, and build healthy habits with the support of our health companion app.
                </StyledText>
              </View>
              <View style={styles.heroImageContainer}>
                <View style={styles.heroImagePlaceholder}>
                  <ChartBarIcon size={48} color={colors.primary} />
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
        
        {/* Features section */}
        <View style={styles.sectionContainer}>
          <StyledText style={styles.sectionTitle}>Key Features</StyledText>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={[styles.iconCircle, { backgroundColor: colors.sleepLight }]}>
                <ChartBarIcon size={24} color={colors.sleep} />
              </View>
              <StyledText style={styles.featureTitle}>Health Stats</StyledText>
              <StyledText style={styles.featureDescription}>
                Track sleep, water, mood, and activity with intuitive visuals
              </StyledText>
            </View>
            
            <View style={styles.featureCard}>
              <View style={[styles.iconCircle, { backgroundColor: colors.moodLight }]}>
                <BookOpenIcon size={24} color={colors.mood} />
              </View>
              <StyledText style={styles.featureTitle}>Daily Journal</StyledText>
              <StyledText style={styles.featureDescription}>
                Record your moods and health experiences in one place
              </StyledText>
            </View>
            
            <View style={styles.featureCard}>
              <View style={[styles.iconCircle, { backgroundColor: colors.activityLight }]}>
                <CubeIcon size={24} color={colors.activity} />
              </View>
              <StyledText style={styles.featureTitle}>Challenges</StyledText>
              <StyledText style={styles.featureDescription}>
                Complete health challenges and earn rewards
              </StyledText>
            </View>
            
            <View style={styles.featureCard}>
              <View style={[styles.iconCircle, { backgroundColor: colors.waterLight }]}>
                <ChatBubbleLeftRightIcon size={24} color={colors.water} />
              </View>
              <StyledText style={styles.featureTitle}>AI Assistant</StyledText>
              <StyledText style={styles.featureDescription}>
                Get personalized health guidance and tips
              </StyledText>
            </View>
          </View>
        </View>
        
        {/* Streak section */}
        <View style={styles.streakContainer}>
          <LinearGradient
            colors={[`${colors.primary}20`, `${colors.primary}05`]}
            style={styles.streakGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.streakContent}>
              <StyledText style={styles.streakTitle}>Build Your Streak</StyledText>
              <StyledText style={styles.streakDescription}>
                Track your progress, earn rewards, and stay motivated on your health journey
              </StyledText>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
      
      {/* Action buttons */}
      <View style={styles.actionContainer}>
        <PrimaryButton 
          title="Get Started" 
          onPress={() => router.push('/auth/signup')}
          icon={<ArrowRightIcon size={20} color="white" />}
          style={styles.getStartedButton}
        />
        
        <Link href="/auth/login" asChild>
          <PrimaryButton 
            title="Log In" 
            variant="outline"
            style={styles.loginButton}
            onPress={() => {}}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : spacing.md,
    paddingBottom: spacing.xl,
  },
  headerContainer: {
    paddingHorizontal: spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontFamily: fonts.bold,
  },
  appName: {
    ...typography.h2,
    color: colors.primary,
  },
  tagline: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  heroContainer: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  heroTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTitle: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  heroImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    ...componentStyles.card,
    width: '48%',
    marginBottom: spacing.md,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureTitle: {
    ...typography.h3,
    marginBottom: spacing.xs,
    fontSize: 16,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  streakContainer: {
    paddingHorizontal: spacing.md,
  },
  streakGradient: {
    borderRadius: radius.medium,
    ...shadows.small,
  },
  streakContent: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  streakTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  streakDescription: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  getStartedButton: {
    marginBottom: spacing.md,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
}); 