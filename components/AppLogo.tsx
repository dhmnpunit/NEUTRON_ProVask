import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HeartPulse } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing, radius, shadows } from '@/constants/design';

interface AppLogoProps {
  size?: number;
  color?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 60,
  color = colors.primary,
}) => {
  return (
    <View 
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `${color}20`,
        }
      ]}
    >
      <HeartPulse size={size * 0.6} color={color} strokeWidth={2.5} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
}); 