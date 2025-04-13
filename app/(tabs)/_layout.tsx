import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import { HomeIcon, BookOpenIcon, ChatBubbleLeftRightIcon, CubeIcon } from 'react-native-heroicons/outline';
import { View, Platform, StatusBar, StyleSheet } from 'react-native';
import { fonts } from "@/constants/design";

const TabBarBackground = () => {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  return (
    <View style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: statusBarHeight,
      backgroundColor: colors.background 
    }} />
  );
};

const styles = StyleSheet.create({
  tabBarBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
});

export default function TabLayout() {
  return (
    <>
      <TabBarBackground />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            fontFamily: fonts.headingMedium,
          },
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            fontFamily: fonts.headingSemiBold,
          },
          headerTintColor: colors.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <HomeIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="logs"
          options={{
            title: 'Journal',
            tabBarLabel: 'Journal',
            tabBarIcon: ({ color, size }) => (
              <BookOpenIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="flip-dice"
          options={{
            title: 'Flip Dice',
            tabBarLabel: 'Challenges',
            tabBarIcon: ({ color, size }) => (
              <CubeIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Assistant',
            tabBarLabel: 'Assistant',
            tabBarIcon: ({ color, size }) => (
              <ChatBubbleLeftRightIcon size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}