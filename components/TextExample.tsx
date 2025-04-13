import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from './StyledText';
import { colors, spacing } from '../constants/design';

const TextExample = () => {
  return (
    <View style={styles.container}>
      <StyledText variant="h1">Heading 1</StyledText>
      <StyledText variant="h2">Heading 2</StyledText>
      <StyledText variant="h3">Heading 3</StyledText>
      
      <View style={styles.spacer} />
      
      <StyledText variant="body">
        This is a regular body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </StyledText>
      
      <View style={styles.spacer} />
      
      <StyledText variant="body" weight="semiBold">
        This is semibold body text that emphasizes important information.
      </StyledText>
      
      <View style={styles.spacer} />
      
      <StyledText variant="bodySmall" color={colors.textSecondary}>
        This is smaller body text in a secondary color.
      </StyledText>
      
      <View style={styles.spacer} />
      
      <StyledText variant="caption" italic>
        This is an italic caption text often used for image descriptions.
      </StyledText>
      
      <View style={styles.spacer} />
      
      <StyledText variant="label" weight="medium" color={colors.primary}>
        PRIMARY LABEL
      </StyledText>
      
      <View style={styles.spacer} />
      
      <StyledText 
        variant="body"
        align="center"
        numberOfLines={2}
      >
        This centered text will be limited to 2 lines. If it exceeds that limit, it will be truncated with an ellipsis at the end.
      </StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  spacer: {
    height: spacing.md,
  },
});

export default TextExample; 