/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#4caf50'; // Agriculture green
const tintColorDark = '#66bb6a'; // Lighter green for dark mode

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#81c784', // Light green for inactive tabs
    tabIconSelected: tintColorLight, // Primary green for active tabs
  },
  dark: {
    text: '#ECEDEE',
    background: '#1b5e20', // Dark green background
    tint: tintColorDark,
    icon: '#a5d6a7', // Light green icons
    tabIconDefault: '#a5d6a7', // Light green for inactive tabs
    tabIconSelected: tintColorDark, // Bright green for active tabs
  },
};
