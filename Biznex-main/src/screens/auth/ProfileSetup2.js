import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import PrimaryButton from '../../components/PrimaryButton';
import StepIndicator from '../../components/StepIndicator';

const ProfileSetup2 = ({ navigation }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  
  const [form, setForm] = useState({
    whatsApp: '', // Pre-filled roughly in reality, left empty for mock
    email: '',
    website: ''
  });

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  const pickImage = async (setter) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    navigation.navigate('ProfileSetup3');
  };

  // Mock checking valid form
  const isFormValid = form.email && form.whatsApp;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <StepIndicator currentStep={2} totalSteps={3} />
            <Text style={styles.title}>Add your profile photos</Text>

            <View style={styles.photoSection}>
              <View style={styles.photoContainer}>
                <Text style={styles.label}>Profile Photo</Text>
                <TouchableOpacity style={[styles.imageUpload, styles.circular]} onPress={() => pickImage(setProfilePhoto)}>
                  {profilePhoto ? (
                    <Image source={{ uri: profilePhoto }} style={styles.imageFullCircular} />
                  ) : (
                    <Ionicons name="camera-outline" color={colors.secondaryText} size={32} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.photoContainer}>
                <Text style={styles.label}>Company Logo</Text>
                <TouchableOpacity style={[styles.imageUpload, styles.square]} onPress={() => pickImage(setCompanyLogo)}>
                  {companyLogo ? (
                    <Image source={{ uri: companyLogo }} style={styles.imageFullSquare} />
                  ) : (
                    <Ionicons name="camera-outline" color={colors.secondaryText} size={32} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>WhatsApp Number</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput 
                  style={styles.inputWithPrefix} 
                  value={form.whatsApp} 
                  onChangeText={(v) => updateForm('whatsApp', v)} 
                  placeholder="WhatsApp number" 
                  placeholderTextColor={colors.placeholder} 
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <Text style={styles.label}>Email Address</Text>
              <TextInput 
                style={styles.input} 
                value={form.email} 
                onChangeText={(v) => updateForm('email', v)} 
                placeholder="work@company.com" 
                placeholderTextColor={colors.placeholder} 
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Website (Optional)</Text>
              <TextInput 
                style={styles.input} 
                value={form.website} 
                onChangeText={(v) => updateForm('website', v)} 
                placeholder="https://www.yourcompany.com" 
                placeholderTextColor={colors.placeholder} 
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.spacer} />
            <PrimaryButton title="Next" onPress={handleNext} disabled={!isFormValid} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  container: { flex: 1 },
  scrollContent: { padding: 24, flexGrow: 1 },
  title: { ...typography.h2, color: colors.surface, marginBottom: 24, textAlign: 'center' },
  photoSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, paddingHorizontal: 10 },
  photoContainer: { alignItems: 'center' },
  imageUpload: {
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  circular: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  square: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  imageFullCircular: { width: '100%', height: '100%', borderRadius: 50 },
  imageFullSquare: { width: '100%', height: '100%', borderRadius: 15 },
  formGroup: { marginBottom: 20 },
  label: { ...typography.bodySmall, color: colors.secondaryText, marginBottom: 8 },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    ...typography.body,
    color: colors.primary,
    marginBottom: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    height: 50,
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
  inputWithPrefix: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 16,
    ...typography.body,
    color: colors.primary,
  },
  spacer: { flex: 1 },
});

export default ProfileSetup2;
