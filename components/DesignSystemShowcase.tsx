import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Plus, Heart, Info, Clock, ChevronRight, Search } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, radius, shadows, iconSizes, fonts } from '@/constants/design';
import { PrimaryButton } from './PrimaryButton';
import { FloatingActionButton } from './FloatingActionButton';
import { ScreenHeader } from './ScreenHeader';
import { EmptyState } from './EmptyState';
import { GradientCard, AccentLine, Divider, CardPattern } from './VisualEnhancements';

export const DesignSystemShowcase: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Typography</Text>
      <View style={styles.showcaseCard}>
        <Text style={typography.h1}>Heading 1 (24px)</Text>
        <Text style={typography.h2}>Heading 2 (20px)</Text>
        <Text style={typography.h3}>Heading 3 (18px)</Text>
        <Text style={typography.body}>Body Text (16px)</Text>
        <Text style={typography.bodySmall}>Body Small (14px)</Text>
        <Text style={typography.caption}>Caption Text (12px)</Text>
        <Text style={typography.label}>Label Text (14px)</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Colors</Text>
      <View style={styles.showcaseCard}>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.primary }]} />
          <Text style={styles.colorName}>Primary</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.primaryLight }]} />
          <Text style={styles.colorName}>Primary Light</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.text }]} />
          <Text style={styles.colorName}>Text</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.textSecondary }]} />
          <Text style={styles.colorName}>Text Secondary</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.card }]} />
          <Text style={styles.colorName}>Card</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.background }]} />
          <Text style={styles.colorName}>Background</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Buttons</Text>
      <View style={styles.showcaseCard}>
        <View style={styles.buttonRow}>
          <PrimaryButton 
            title="Primary" 
            onPress={() => {}} 
            variant="primary"
            style={styles.showcaseButton}
          />
          <PrimaryButton 
            title="Secondary" 
            onPress={() => {}} 
            variant="secondary"
            style={styles.showcaseButton}
          />
        </View>
        <View style={styles.buttonRow}>
          <PrimaryButton 
            title="Outline" 
            onPress={() => {}} 
            variant="outline"
            style={styles.showcaseButton}
          />
          <PrimaryButton 
            title="Danger" 
            onPress={() => {}} 
            variant="danger"
            style={styles.showcaseButton}
          />
        </View>
        <View style={styles.buttonRow}>
          <PrimaryButton 
            title="Small" 
            onPress={() => {}} 
            size="small"
            style={styles.showcaseButton}
          />
          <PrimaryButton 
            title="Medium" 
            onPress={() => {}} 
            size="medium"
            style={styles.showcaseButton}
          />
        </View>
        <View style={styles.buttonRow}>
          <PrimaryButton 
            title="Large" 
            onPress={() => {}} 
            size="large"
            style={styles.showcaseButton}
          />
          <PrimaryButton 
            title="Loading" 
            onPress={() => {}} 
            loading={true}
            style={styles.showcaseButton}
          />
        </View>
        <View style={styles.buttonRow}>
          <PrimaryButton 
            title="With Icon" 
            onPress={() => {}} 
            icon={<Heart size={iconSizes.small} color="#FFFFFF" />}
            style={styles.showcaseButton}
          />
          <PrimaryButton 
            title="Disabled" 
            onPress={() => {}} 
            disabled={true}
            style={styles.showcaseButton}
          />
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Headers</Text>
      <View style={styles.showcaseCard}>
        <ScreenHeader 
          title="Standard Header" 
        />
        <View style={styles.spacer} />
        <ScreenHeader 
          title="With Back Button" 
          showBackButton={true}
        />
        <View style={styles.spacer} />
        <ScreenHeader 
          title="With Subtitle" 
          subtitle="Additional information here"
          showBackButton={true}
        />
        <View style={styles.spacer} />
        <ScreenHeader 
          title="Dark Variant" 
          showBackButton={true}
          isDark={true}
        />
      </View>
      
      <Text style={styles.sectionTitle}>Visual Enhancements</Text>
      <View style={styles.showcaseCard}>
        <Text style={styles.componentLabel}>Accent Line</Text>
        <View style={styles.accentLineShowcase}>
          <AccentLine color={colors.primary} />
          <AccentLine color={colors.success} />
          <AccentLine color={colors.warning} />
          <AccentLine color={colors.danger} />
        </View>
        
        <Text style={styles.componentLabel}>Divider</Text>
        <Divider />
        
        <Text style={styles.componentLabel}>Gradient Card</Text>
        <GradientCard style={styles.gradientCardShowcase}>
          <CardPattern />
          <Text style={styles.gradientCardText}>Gradient Card with Pattern</Text>
        </GradientCard>
      </View>
      
      <Text style={styles.sectionTitle}>Action Buttons</Text>
      <View style={[styles.showcaseCard, { height: 200 }]}>
        <View style={styles.fabShowcase}>
          <FloatingActionButton
            icon={<Plus size={iconSizes.medium} color="#FFFFFF" />}
            onPress={() => {}}
            position="bottomRight"
            size="medium"
          />
          <FloatingActionButton
            icon={<Search size={iconSizes.small} color="#FFFFFF" />}
            onPress={() => {}}
            position="bottomLeft"
            size="small"
            variant="secondary"
          />
          <FloatingActionButton
            icon={<Heart size={iconSizes.small} color="#FFFFFF" />}
            onPress={() => {}}
            label="Favorite"
            position="topRight"
          />
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Empty States</Text>
      <EmptyState
        title="No Items Found"
        description="Try adjusting your search or filters to find what you're looking for."
        icon={<Info size={iconSizes.large} color={colors.primary} />}
        action={{
          title: "Add Item",
          onPress: () => {},
        }}
        secondaryAction={{
          title: "Learn More",
          onPress: () => {},
        }}
        centered={false}
        gradient={true}
      />
      
      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontFamily: fonts.headingBold,
  },
  showcaseCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.medium,
    ...shadows.small,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.border}60`,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: radius.small,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.border}80`,
  },
  colorName: {
    ...typography.body,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  showcaseButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  componentLabel: {
    ...typography.label,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  gradientCardShowcase: {
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  gradientCardText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  accentLineShowcase: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  fabShowcase: {
    flex: 1,
    position: 'relative',
  },
  spacer: {
    height: spacing.lg,
  },
}); 