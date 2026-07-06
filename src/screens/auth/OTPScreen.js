import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEST_OTP = '123456';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import PrimaryButton from '../../components/PrimaryButton';
import OTPInput from '../../components/OTPInput';

const OTPScreen = ({ route, navigation }) => {
  const { contact = '+91 9999999999', method = 'Phone' } = route.params || {};
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [error, setError] = useState('');

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleVerify = async () => {
    if (otp !== TEST_OTP) {
      setError(`Incorrect OTP. Use ${TEST_OTP} for testing.`);
      return;
    }
    setError('');
    try {
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        navigation.navigate('ProfileSetup1');
      }
    } catch (e) {
      console.error('Failed to read profile in OTP verify:', e);
      navigation.navigate('ProfileSetup1');
    }
  };

  const handleResend = () => {
    setTimeLeft(30);
    setError('');
    setOtp('');
  };

  // Basic obfuscation for display
  const maskedContact = method === 'Phone' 
    ? contact.replace(/(\+\d{2})\s(\d{2})\d{4}(\d{4})/, '$1 $2****$3')
    : contact.replace(/(.{2}).*(@.*)/, '$1***$2');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.header}>
              <Text style={styles.title}>Enter OTP</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit code to
              </Text>
              <Text style={styles.contactText}>{maskedContact}</Text>
            </View>

            <OTPInput length={6} value={otp} onChange={(val) => { setOtp(val); setError(''); }} />

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <View style={styles.hintBanner}>
              <Text style={styles.hintText}>🧪 Test OTP: <Text style={styles.hintBold}>{TEST_OTP}</Text></Text>
            </View>

            <View style={styles.resendContainer}>
              {timeLeft > 0 ? (
                <Text style={styles.timerText}>
                  Resend code in 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.spacer} />

            <PrimaryButton 
              title="Verify & Continue" 
              onPress={handleVerify} 
              disabled={otp.length !== 6}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    ...typography.h2,
    color: colors.surface,
    marginBottom: 12,
  },
  subtitle: {
    ...typography.body,
    color: colors.secondaryText,
  },
  contactText: {
    ...typography.body,
    color: colors.accent,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 4,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  timerText: {
    ...typography.bodySmall,
    color: colors.secondaryText,
  },
  resendText: {
    ...typography.bodySmall,
    color: colors.accent,
    fontFamily: 'Inter_600SemiBold',
    textDecorationLine: 'underline',
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 8,
  },
  hintBanner: {
    backgroundColor: 'rgba(201, 168, 76, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.3)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  hintText: {
    ...typography.bodySmall,
    color: colors.secondaryText,
    fontSize: 12,
  },
  hintBold: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.accent,
    letterSpacing: 2,
  },
  spacer: {
    flex: 1,
  },
});

export default OTPScreen;
