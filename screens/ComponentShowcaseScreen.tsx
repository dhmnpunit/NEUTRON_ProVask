import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyledText from '../components/StyledText';
import { AccentLine, GradientCard } from '../components/VisualEnhancements';
import JournalEntryCard from '../components/JournalEntryCard';
import TextExample from '../components/TextExample';
import { colors, spacing } from '../constants/design';

const ComponentShowcaseScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StyledText variant="h1" weight="bold">Component Showcase</StyledText>
        <AccentLine color={colors.primary} />
        
        <View style={styles.section}>
          <StyledText variant="h2">Typography</StyledText>
          <TextExample />
        </View>
        
        <View style={styles.section}>
          <StyledText variant="h2">Visual Enhancements</StyledText>
          
          <View style={styles.subsection}>
            <StyledText variant="h3">Accent Lines</StyledText>
            <AccentLine color={colors.primary} />
            <View style={styles.spacer} />
            <AccentLine color={colors.accent} />
            <View style={styles.spacer} />
            <AccentLine color={colors.success} />
          </View>
          
          <View style={styles.subsection}>
            <StyledText variant="h3">Gradient Cards</StyledText>
            <View style={styles.row}>
              <View style={styles.cardWrapper}>
                <GradientCard 
                  startColor={colors.gradientStart} 
                  endColor={colors.gradientEnd}
                  style={styles.gradientCard}
                >
                  <StyledText variant="body" color={colors.white}>
                    Primary Gradient
                  </StyledText>
                </GradientCard>
              </View>
              
              <View style={styles.cardWrapper}>
                <GradientCard 
                  startColor={colors.accentLight} 
                  endColor={colors.accent}
                  style={styles.gradientCard}
                >
                  <StyledText variant="body" color={colors.white}>
                    Accent Gradient
                  </StyledText>
                </GradientCard>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <StyledText variant="h2">Journal Entry Cards</StyledText>
          
          <JournalEntryCard
            date="2023-06-15"
            title="Great Day at the Beach"
            content="Spent the day at the beach with friends. The weather was perfect and the water was refreshing."
            mood="happy"
            moodEmoji="😄"
            onPress={() => console.log('Card pressed')}
          />
          
          <View style={styles.spacer} />
          
          <JournalEntryCard
            date="2023-06-14"
            title="Productive Work Day"
            content="Completed all tasks on my to-do list and started working on a new project."
            mood="neutral"
            moodEmoji="😐"
            onPress={() => console.log('Card pressed')}
          />
          
          <View style={styles.spacer} />
          
          <JournalEntryCard
            date="2023-06-13"
            title="Feeling Under the Weather"
            content="Caught a cold and had to stay in bed most of the day. Hoping to feel better tomorrow."
            mood="sad"
            moodEmoji="😞"
            onPress={() => console.log('Card pressed')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    marginTop: spacing.xl,
  },
  subsection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  spacer: {
    height: spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  cardWrapper: {
    width: '50%',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  gradientCard: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ComponentShowcaseScreen; 