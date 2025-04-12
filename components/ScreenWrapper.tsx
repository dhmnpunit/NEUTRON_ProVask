import React from 'react';
import { View, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/design';

type ScreenWrapperProps = {
  children: React.ReactNode;
  withPadding?: boolean;
};

export function ScreenWrapper({ children, withPadding = false }: ScreenWrapperProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, withPadding && styles.contentWithPadding]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
  contentWithPadding: {
    padding: spacing.md,
  },
}); 