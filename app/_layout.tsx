import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-get-random-values';

import { useColorScheme } from '@/hooks/useColorScheme';

// Custom Agriculture Theme
const AgricultureLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4caf50',
    background: '#f1f8e9',
    card: '#ffffff',
    text: '#1b5e20',
    border: '#c8e6c9',
    notification: '#66bb6a',
  },
};

const AgricultureDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#66bb6a',
    background: '#1b5e20',
    card: '#2e7d32',
    text: '#e8f5e8',
    border: '#4caf50',
    notification: '#a5d6a7',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? AgricultureDarkTheme : AgricultureLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        backgroundColor={colorScheme === 'dark' ? '#1b5e20' : '#f1f8e9'}
      />
    </ThemeProvider>
  );
}
