import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkProfileAndNavigate = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('userProfile');
        if (storedProfile) {
          navigation.replace('Main');
        } else {
          navigation.replace('Onboarding');
        }
      } catch (error) {
        console.error('Failed to check userProfile in Splash:', error);
        navigation.replace('Onboarding');
      }
    };

    const timer = setTimeout(() => {
      checkProfileAndNavigate();
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BizNex</Text>
      <Text style={styles.subtitle}>Grow. Connect. Prosper.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.accent,
    fontSize: 36,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.surface,
  },
});

export default SplashScreen;
