import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import PrimaryButton from '../../components/PrimaryButton';
import StepIndicator from '../../components/StepIndicator';

const ProfileSetup3 = ({ navigation }) => {
  const [form, setForm] = useState({
    offer: '',
    lookingFor: '',
    keywordInput: ''
  });
  const [keywords, setKeywords] = useState([]);

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  const handleAddKeyword = () => {
    const newKeywords = form.keywordInput
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0 && !keywords.includes(k));
    
    if (newKeywords.length > 0) {
      setKeywords([...keywords, ...newKeywords]);
      updateForm('keywordInput', '');
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  const handleCompleteTask = () => {
    // Final assembly logic here if necessary
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const isFormValid = form.offer && form.lookingFor && keywords.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <StepIndicator currentStep={3} totalSteps={3} />
            <Text style={styles.title}>What does your business do?</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>What I Offer</Text>
              <TextInput 
                style={styles.textArea} 
                value={form.offer} 
                onChangeText={(v) => updateForm('offer', v)} 
                placeholder="Describe your products or services..." 
                placeholderTextColor={colors.placeholder} 
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />

              <Text style={styles.label}>What I'm Looking For</Text>
              <TextInput 
                style={styles.textArea} 
                value={form.lookingFor} 
                onChangeText={(v) => updateForm('lookingFor', v)} 
                placeholder="What kind of business connections do you need?" 
                placeholderTextColor={colors.placeholder} 
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />

              <Text style={styles.label}>Keywords</Text>
              <Text style={styles.subtext}>Press space or comma to add</Text>
              <TextInput 
                style={styles.input} 
                value={form.keywordInput} 
                onChangeText={(v) => {
                  updateForm('keywordInput', v);
                  if (v.includes(',') || v.endsWith(' ')) {
                    handleAddKeyword();
                  }
                }} 
                onSubmitEditing={handleAddKeyword}
                placeholder="e.g. Marketing, SEO, SaaS" 
                placeholderTextColor={colors.placeholder} 
              />
              
              <View style={styles.chipContainer}>
                {keywords.map((kw, index) => (
                  <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{kw}</Text>
                    <TouchableOpacity onPress={() => handleRemoveKeyword(kw)} style={styles.chipClose}>
                      <Ionicons name="close" color={colors.primary} size={14} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            </View>

            <View style={styles.spacer} />
            <PrimaryButton title="Complete Setup" onPress={handleCompleteTask} disabled={!isFormValid} />
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
  formGroup: { marginBottom: 20 },
  label: { ...typography.bodySmall, color: colors.secondaryText, marginBottom: 8 },
  subtext: { ...typography.bodySmall, fontSize: 12, color: colors.placeholder, marginBottom: 8, marginTop: -4 },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    ...typography.body,
    color: colors.primary,
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 120,
    ...typography.body,
    color: colors.primary,
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 8,
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
    marginRight: 6,
  },
  chipClose: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    padding: 2,
  },
  spacer: { flex: 1 },
});

export default ProfileSetup3;
