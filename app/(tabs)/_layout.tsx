import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import { HomeIcon, BookOpenIcon, ChartBarIcon, TrophyIcon, CubeIcon } from 'react-native-heroicons/outline';
import { View, Platform, StatusBar } from 'react-native';

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
          name="stats"
          options={{
            title: 'Statistics',
            tabBarLabel: 'Stats',
            tabBarIcon: ({ color, size }) => (
              <ChartBarIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Leaderboard',
            tabBarLabel: 'Compete',
            tabBarIcon: ({ color, size }) => (
              <TrophyIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="dice"
          options={{
            title: 'Health Dice',
            tabBarLabel: 'Dice',
            tabBarIcon: ({ color, size }) => (
              <CubeIcon size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}