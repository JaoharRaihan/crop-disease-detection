import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Dimensions } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && screenWidth >= 1024;

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 88, // Increased height for better appearance
            paddingBottom: 20,
            paddingTop: 8,
          },
          web: {
            backgroundColor: '#f1f8e9',
            borderTopWidth: 1,
            borderTopColor: '#c8e6c9',
            height: isDesktop ? 70 : 80,
            paddingBottom: isDesktop ? 12 : 16,
            paddingTop: 8,
            elevation: 8,
            shadowColor: '#4caf50',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          },
          default: {
            backgroundColor: '#f1f8e9',
            borderTopWidth: 1,
            borderTopColor: '#c8e6c9',
            height: 80,
            paddingBottom: 16,
            paddingTop: 8,
            elevation: 8,
          },
        }),
        tabBarLabelStyle: {
          fontSize: isDesktop ? 14 : 12,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '🏠 রোগ সনাক্তকরণ',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 32 : 28} 
              name="leaf.fill" 
              color={focused ? '#2e7d32' : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '📚 কৃষি শিক্ষা',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 32 : 28} 
              name="book.fill" 
              color={focused ? '#2e7d32' : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
