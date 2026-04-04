import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import PrimaryButton from '../../components/PrimaryButton';

const LoginScreen = ({ navigation }) => {
  const TEST_EMAIL = 'business@test.com';
  const [activeTab, setActiveTab] = useState('Phone'); // 'Phone' | 'Email'
  const [inputValue, setInputValue] = useState('');

  const handleSendOTP = () => {
    // Mock MSG91 Integration - Navigate to OTPScreen
    navigation.navigate('OTP', {
      method: activeTab,
      contact: activeTab === 'Phone' ? `+91 ${inputValue}` : inputValue
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.header}>
              <Text style={styles.logo}>BizNex</Text>
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'Phone' && styles.activeTab]}
                onPress={() => { setActiveTab('Phone'); setInputValue(''); }}
              >
                <Text style={[styles.tabText, activeTab === 'Phone' && styles.activeTabText]}>Phone</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'Email' && styles.activeTab]}
                onPress={() => { setActiveTab('Email'); setInputValue(''); }}
              >
                <Text style={[styles.tabText, activeTab === 'Email' && styles.activeTabText]}>Email</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {activeTab === 'Phone' ? (
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="phone-pad"
                    value={inputValue}
                    onChangeText={setInputValue}
                    maxLength={10}
                  />
                </View>
              ) : (
                <TextInput
                  style={[styles.input, styles.fullInput]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={inputValue}
                  onChangeText={setInputValue}
                />
              )}

              <PrimaryButton 
                title="Send OTP" 
                onPress={handleSendOTP} 
                disabled={activeTab === 'Phone' ? inputValue.length < 10 : inputValue.length < 5}
                style={styles.button}
              />

              <View style={styles.hintBanner}>
                <Text style={styles.hintText}>
                  {activeTab === 'Phone'
                    ? '🧪 Use any 10-digit number  •  OTP: 123456'
                    : `🧪 Use ${TEST_EMAIL}  •  OTP: 123456`
                  }
                </Text>
              </View>

              <View style={styles.footerContainer}>
                <Text style={styles.trialText}>
                  ✓ 14-day free Explorer trial — No credit card needed
                </Text>
                <Text style={styles.termsText}>
                  By continuing you agree to our Terms & Privacy Policy
                </Text>
              </View>
            </View>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    ...typography.h1,
    color: colors.accent,
    fontSize: 36,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#162A48',
    borderRadius: 10,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    ...typography.body,
    color: colors.secondaryText,
    fontFamily: 'Inter_600SemiBold',
  },
  activeTabText: {
    color: colors.surface,
  },
  formContainer: {
    flex: 1,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    height: 56,
  },
  countryCode: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  countryCodeText: {
    ...typography.body,
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 16,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    ...typography.body,
    color: colors.primary,
  },
  fullInput: {
    flex: 0,
    borderRadius: 10,
    height: 56,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  hintBanner: {
    backgroundColor: 'rgba(201, 168, 76, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.25)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  hintText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.accent,
    textAlign: 'center',
  },
  footerContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  trialText: {
    ...typography.bodySmall,
    color: colors.accent,
    marginBottom: 16,
    textAlign: 'center',
  },
  termsText: {
    ...typography.bodySmall,
    color: colors.secondaryText,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;
