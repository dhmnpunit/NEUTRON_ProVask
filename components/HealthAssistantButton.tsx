import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { colors } from '@/constants/colors';
import { typography, radius, shadows } from '@/constants/design';
import { ChatBubbleLeftRightIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';

type HealthAssistantButtonProps = {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
};

/**
 * A floating action button for quick access to the Health Assistant
 * Can be placed on any screen where users might want AI assistance
 */
export function HealthAssistantButton({ 
  showLabel = false, 
  size = 'medium' 
}: HealthAssistantButtonProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push('/(tabs)/chat');
  };
  
  // Determine button size based on prop
  const buttonSize = 
    size === 'small' ? 40 : 
    size === 'large' ? 60 : 50;
    
  const iconSize = 
    size === 'small' ? 18 : 
    size === 'large' ? 28 : 24;
  
  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Health Assistant</Text>
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.button,
          { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 }
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <ChatBubbleLeftRightIcon size={iconSize} color={colors.background} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  button: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  labelContainer: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.small,
    marginBottom: 8,
    ...shadows.small,
  },
  label: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '500',
  },
}); 