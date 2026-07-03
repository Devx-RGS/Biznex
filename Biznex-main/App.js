import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { EnquiryProvider } from './src/context/EnquiryContext';
import { SettingsProvider } from './src/context/SettingsContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  /*
  if (!fontsLoaded) {
    // Return empty view or a very basic loading state while fonts are not ready
    return <View style={styles.container} />;
  }
  */

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SettingsProvider>
        <EnquiryProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </EnquiryProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1931',
  },
});
