import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function ProfileLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="edit" />
      </Stack>
    </View>
  );
} 