import { BlurView } from 'expo-blur';
import { StyleSheet, Platform } from 'react-native';
import { View } from 'react-native';

// This creates a beautiful agriculture-themed tab bar background
export default function TabBarBackground() {
  if (Platform.OS === 'ios') {
    return (
      <BlurView 
        tint="light" 
        intensity={95} 
        style={StyleSheet.absoluteFill} 
      />
    );
  }

  // For Android and Web - create a gradient-like agriculture background
  return (
    <View style={[StyleSheet.absoluteFill, styles.androidBackground]} />
  );
}

const styles = StyleSheet.create({
  androidBackground: {
    backgroundColor: '#f1f8e9', // Light green background
    borderTopWidth: 1,
    borderTopColor: '#c8e6c9', // Light green border
    elevation: 8,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
});

export function useBottomTabOverflow() {
  return 16; // Add some padding for better visual appearance
}
